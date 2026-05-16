import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Check, Upload, X, Loader2 } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/site/AuthContext";
import { PARAGUAY_DEPARTAMENTOS } from "@/lib/paraguay-geo";
import { compressImage } from "@/lib/image-compress";

const searchSchema = z.object({
  id: z.string().uuid().optional(),
});

export const Route = createFileRoute("/publicar")({
  head: () => ({ meta: [{ title: "Publicar anuncio — Che Renda T&T" }] }),
  validateSearch: searchSchema,
  component: PublicarPage,
});

const STEPS = [
  "Información básica",
  "Ubicación",
  "Capacidad",
  "Servicios",
  "Precio y horarios",
  "Fotos y publicación",
];

const TIPOS = ["Casa", "Departamento", "Quinta", "Cabaña", "Glamping"];

const INSTALACIONES = [
  "Piscina",
  "Quincho",
  "Salón climatizado",
  "Garage/Estacionamiento",
  "Cancha de fútbol",
  "Cancha de vóley",
  "Mesa de pool",
  "Hamaca paraguaya",
  "Lugar para fogatas",
];

const CONFORT = [
  "Cocina equipada",
  "Microondas",
  "Wifi",
  "Zona de trabajo",
  "TV",
  "Espacio para guardar ropa",
  "Almohadas adicionales",
  "Cámaras de seguridad",
  "Botiquín de primeros auxilios",
  "Detector de humo",
];

const MODALIDADES: { value: string; label: string }[] = [
  { value: "per_hour", label: "Por hora" },
  { value: "per_night", label: "Por noche" },
  { value: "per_week", label: "Por semana" },
  { value: "per_month", label: "Por mes" },
  { value: "annual", label: "Anual" },
  { value: "full_weekend", label: "Fin de semana completo" },
];

const MAX_IMAGES = 10;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

type ImageItem = {
  id: string;
  originalName: string;
  blob: Blob | null; // null = imagen ya almacenada (modo edición)
  previewUrl: string;
  compressedSize: number;
  existingUrl?: string;
};

function PublicarPage() {
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const { id: editingId } = Route.useSearch();
  const isEditing = !!editingId;

  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(isEditing);

  // Paso 1
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("");

  // Paso 2
  const [departamento, setDepartamento] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");

  // Paso 3
  const [counts, setCounts] = useState({
    huespedes: 1,
    habitaciones: 1,
    habAire: 0,
    habSinAire: 1,
    camas: 1,
    banos: 1,
  });

  // Paso 4
  const [servicios, setServicios] = useState<Record<string, boolean>>({});
  const [mascotas, setMascotas] = useState(false);

  // Paso 5
  const [precio, setPrecio] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [checkInTime, setCheckInTime] = useState("14:00");
  const [checkOutTime, setCheckOutTime] = useState("10:00");
  const [contactPhone, setContactPhone] = useState("");

  // Paso 6
  const [images, setImages] = useState<ImageItem[]>([]);
  const [compressing, setCompressing] = useState(false);
  const [aceptaLegal, setAceptaLegal] = useState(false);

  // Cargar propiedad existente (modo edición)
  useEffect(() => {
    if (!isEditing || !user) return;
    (async () => {
      setLoadingExisting(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", editingId!)
        .maybeSingle();
      if (error || !data) {
        toast.error("No se pudo cargar la publicación");
        setLoadingExisting(false);
        return;
      }
      setTitulo(data.title ?? "");
      setDescripcion(data.description ?? "");
      setTipo(data.property_type ?? "");
      setDepartamento(data.department ?? "");
      setCiudad(data.city ?? "");
      setDireccion(data.address ?? "");
      setCounts({
        huespedes: data.guests ?? 1,
        habitaciones: (data.rooms_ac ?? 0) + (data.rooms_no_ac ?? 0) || 1,
        habAire: data.rooms_ac ?? 0,
        habSinAire: data.rooms_no_ac ?? 0,
        camas: data.beds ?? 1,
        banos: data.bathrooms ?? 1,
      });
      setServicios((data.amenities as Record<string, boolean>) ?? {});
      setMascotas(!!data.pets_allowed);
      setPrecio(String(data.price ?? ""));
      setModalidad(data.price_modality ?? "");
      setCheckInTime((data as any).check_in_time ?? "14:00");
      setCheckOutTime((data as any).check_out_time ?? "10:00");
      setContactPhone((data as any).contact_phone ?? "");
      setImages(
        (data.images ?? []).map((url: string, i: number) => ({
          id: `existing-${i}`,
          originalName: `Imagen ${i + 1}`,
          blob: null,
          previewUrl: url,
          compressedSize: 0,
          existingUrl: url,
        })),
      );
      setAceptaLegal(true); // ya aceptó al publicar originalmente
      setLoadingExisting(false);
    })();
  }, [isEditing, editingId, user]);

  const toggleServicio = (s: string) =>
    setServicios((prev) => ({ ...prev, [s]: !prev[s] }));

  const validateStep = (s: number): string | null => {
    if (s === 0) {
      if (!titulo.trim()) return "Ingresá el título del alojamiento";
      if (!descripcion.trim()) return "Agregá una descripción";
      if (!tipo) return "Seleccioná el tipo de propiedad";
    }
    if (s === 1) {
      if (!departamento) return "Seleccioná un departamento";
      if (!ciudad) return "Seleccioná una ciudad";
    }
    if (s === 4) {
      if (!precio || Number(precio) <= 0) return "Ingresá un precio válido en Guaraníes";
      if (!modalidad) return "Seleccioná la modalidad de cobro";
      if (!checkInTime) return "Definí el horario de check-in";
      if (!checkOutTime) return "Definí el horario de check-out";
      if (!contactPhone.trim() || contactPhone.trim().length < 6)
        return "Ingresá un número de contacto válido";
    }
    return null;
  };

  const next = () => {
    const err = validateStep(step);
    if (err) {
      toast.error(err);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      toast.error(`Máximo ${MAX_IMAGES} imágenes`);
      return;
    }
    const list = Array.from(files).slice(0, remaining);
    setCompressing(true);
    const out: ImageItem[] = [];
    for (const f of list) {
      try {
        if (!f.type.startsWith("image/")) {
          toast.error(`${f.name}: no es una imagen`);
          continue;
        }
        if (f.size > MAX_FILE_BYTES) {
          toast.error(`${f.name}: supera 10 MB`);
          continue;
        }
        const blob = await compressImage(f);
        out.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          originalName: f.name,
          blob,
          previewUrl: URL.createObjectURL(blob),
          compressedSize: blob.size,
        });
      } catch {
        toast.error(`Error procesando ${f.name}`);
      }
    }
    setImages((prev) => [...prev, ...out]);
    setCompressing(false);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const it = prev.find((x) => x.id === id);
      if (it && it.blob) URL.revokeObjectURL(it.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  const submit = async () => {
    if (!user) {
      openAuthModal();
      return;
    }
    for (let i = 0; i <= 4; i++) {
      const err = validateStep(i);
      if (err) {
        toast.error(err);
        setStep(i);
        return;
      }
    }
    if (images.length === 0) {
      toast.error("Subí al menos una foto del alojamiento");
      return;
    }
    if (!aceptaLegal) {
      toast.error("Debés aceptar los términos y condiciones");
      return;
    }
    setBusy(true);
    try {
      // Subir solo las imágenes nuevas (blob != null); conservar las existentes
      const finalUrls: string[] = [];
      for (const img of images) {
        if (img.existingUrl && !img.blob) {
          finalUrls.push(img.existingUrl);
          continue;
        }
        if (!img.blob) continue;
        const path = `${user.id}/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.jpg`;
        const { error: upErr } = await supabase.storage
          .from("property-images")
          .upload(path, img.blob, {
            contentType: "image/jpeg",
            upsert: false,
          });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage
          .from("property-images")
          .getPublicUrl(path);
        finalUrls.push(pub.publicUrl);
      }

      const payload = {
        host_id: user.id,
        title: titulo.trim(),
        description: descripcion.trim() || null,
        property_type: tipo,
        department: departamento || null,
        city: ciudad || null,
        address: direccion || null,
        guests: counts.huespedes,
        rooms_ac: counts.habAire,
        rooms_no_ac: counts.habSinAire,
        beds: counts.camas,
        bathrooms: counts.banos,
        amenities: servicios,
        pets_allowed: mascotas,
        price: Number(precio),
        price_modality: modalidad as
          | "per_hour"
          | "per_night"
          | "per_week"
          | "per_month"
          | "annual"
          | "full_weekend",
        images: finalUrls,
        status: "active" as const,
        contact_phone: contactPhone.trim(),
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("properties")
          .update(payload)
          .eq("id", editingId!);
        if (error) throw error;
        toast.success("¡Anuncio actualizado correctamente!");
      } else {
        const { error } = await supabase.from("properties").insert(payload);
        if (error) throw error;
        toast.success("¡Anuncio publicado correctamente!");
      }
      navigate({ to: "/mis-propiedades" });
    } catch (e: any) {
      toast.error(e?.message ?? "No se pudo guardar el anuncio");
    } finally {
      setBusy(false);
    }
  };

  const ciudadesDelDepto = departamento
    ? PARAGUAY_DEPARTAMENTOS[departamento] ?? []
    : [];

  if (loadingExisting) {
    return (
      <SiteShell>
        <div className="mx-auto flex max-w-3xl items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Cargando publicación…
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold">
            {isEditing ? "Editar anuncio" : "Publicar anuncio"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEditing
              ? "Actualizá los datos de tu Che Renda."
              : "Completá los pasos para crear tu Che Renda."}
          </p>
        </div>

        <Stepper step={step} />

        <div className="mt-6 rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
          {step === 0 && (
            <div className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="titulo">Título del alojamiento *</Label>
                <Input
                  id="titulo"
                  maxLength={50}
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej: Quinta Vacacional San Ber"
                />
                <span className="text-right text-xs text-muted-foreground">
                  {titulo.length}/50
                </span>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Descripción *</Label>
                <Textarea
                  id="desc"
                  rows={6}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describí tu propiedad, el entorno y la experiencia."
                />
              </div>
              <div className="grid gap-2">
                <Label>Tipo de propiedad *</Label>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="grid gap-2">
                <Label>Departamento *</Label>
                <Select
                  value={departamento}
                  onValueChange={(v) => {
                    setDepartamento(v);
                    setCiudad("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná un departamento" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {Object.keys(PARAGUAY_DEPARTAMENTOS).map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Ciudad *</Label>
                <Select
                  value={ciudad}
                  onValueChange={setCiudad}
                  disabled={!departamento}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        departamento
                          ? "Seleccioná una ciudad"
                          : "Elegí primero un departamento"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {ciudadesDelDepto.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dir">Dirección de referencia</Label>
                <Input
                  id="dir"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ej: A 200 m de la plaza central"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["huespedes", "Huéspedes máximos"],
                  ["habitaciones", "Habitaciones totales"],
                  ["habAire", "Habitaciones con A/C"],
                  ["habSinAire", "Habitaciones sin A/C"],
                  ["camas", "Camas totales"],
                  ["banos", "Cantidad de baños"],
                ] as const
              ).map(([key, label]) => (
                <NumberRow
                  key={key}
                  label={label}
                  value={counts[key]}
                  onChange={(v) =>
                    setCounts((c) => ({ ...c, [key]: Math.max(0, v) }))
                  }
                />
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <ServicioBlock
                title="Instalaciones"
                items={INSTALACIONES}
                state={servicios}
                onToggle={toggleServicio}
              />
              <ServicioBlock
                title="Confort y seguridad"
                items={CONFORT}
                state={servicios}
                onToggle={toggleServicio}
              />
              <div>
                <h3 className="mb-3 font-display text-base font-semibold">
                  Reglas
                </h3>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 px-4 py-3">
                  <Checkbox
                    checked={mascotas}
                    onCheckedChange={(v) => setMascotas(!!v)}
                  />
                  <span className="text-sm">Se permiten mascotas</span>
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="precio">Precio base (Gs.) *</Label>
                <Input
                  id="precio"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="Ej: 350000"
                />
              </div>
              <div className="grid gap-2">
                <Label>Modalidad de cobro *</Label>
                <Select value={modalidad} onValueChange={setModalidad}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná modalidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODALIDADES.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="ci">Horario de Check-in *</Label>
                  <Input
                    id="ci"
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="co">Horario de Check-out *</Label>
                  <Input
                    id="co"
                    type="time"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tel">Número de contacto del anfitrión *</Label>
                <Input
                  id="tel"
                  type="tel"
                  inputMode="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Ej: +595 981 123 456"
                />
                <p className="text-xs text-muted-foreground">
                  Se compartirá con los huéspedes que confirmen una reserva.
                </p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h3 className="mb-2 font-display text-base font-semibold">
                  Fotos del alojamiento
                </h3>
                <p className="mb-3 text-xs text-muted-foreground">
                  Hasta {MAX_IMAGES} imágenes. Se aceptan archivos de hasta 10
                  MB; se comprimen automáticamente para optimizar la carga.
                </p>

                <label
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/70 bg-muted/30 px-6 py-8 text-center transition hover:bg-muted/50",
                    compressing && "pointer-events-none opacity-60",
                  )}
                >
                  {compressing ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">
                    {compressing
                      ? "Procesando imágenes…"
                      : "Subir fotos desde tu dispositivo"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    JPG, PNG o WEBP
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      handleFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>

                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {images.map((img) => (
                      <div
                        key={img.id}
                        className="group relative overflow-hidden rounded-xl border border-border/60"
                      >
                        <img
                          src={img.previewUrl}
                          alt={img.originalName}
                          className="aspect-square w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          className="absolute right-1.5 top-1.5 rounded-full bg-background/90 p-1 shadow opacity-0 transition group-hover:opacity-100"
                          aria-label="Eliminar"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {img.compressedSize > 0 && (
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1 text-[10px] text-white">
                            {(img.compressedSize / 1024).toFixed(0)} KB
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox
                    checked={aceptaLegal}
                    onCheckedChange={(v) => setAceptaLegal(!!v)}
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-relaxed">
                    Acepto los{" "}
                    <a
                      href="/terminos-y-condiciones"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary underline-offset-2 hover:underline"
                    >
                      términos, bases y condiciones legales
                    </a>{" "}
                    de Che Renda T&T.
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-border/60 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={prev}
              disabled={step === 0 || busy}
            >
              Atrás
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={next}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                type="button"
                onClick={submit}
                disabled={busy || !aceptaLegal || images.length === 0}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {busy ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando…
                  </>
                ) : isEditing ? (
                  "Guardar cambios"
                ) : (
                  "Publicar anuncio"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="flex items-center gap-2 overflow-x-auto">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                active && "border-primary bg-primary text-primary-foreground",
                done && "border-foreground bg-foreground text-background",
                !active && !done && "border-border text-muted-foreground",
              )}
            >
              {done ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "hidden whitespace-nowrap text-xs font-medium sm:inline",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="ml-1 hidden h-px flex-1 bg-border sm:block" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function NumberRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 px-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <Input
        type="number"
        inputMode="numeric"
        min={0}
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          onChange(Number.isFinite(v) ? Math.max(0, v) : 0);
        }}
        className="h-9 w-20 text-center"
      />
    </div>
  );
}

function ServicioBlock({
  title,
  items,
  state,
  onToggle,
}: {
  title: string;
  items: string[];
  state: Record<string, boolean>;
  onToggle: (s: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-3 font-display text-base font-semibold">{title}</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((s) => (
          <label
            key={s}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 px-4 py-2.5 hover:bg-accent"
          >
            <Checkbox
              checked={!!state[s]}
              onCheckedChange={() => onToggle(s)}
            />
            <span className="text-sm">{s}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
