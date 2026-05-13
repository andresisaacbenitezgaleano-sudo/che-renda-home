import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Check } from "lucide-react";
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

export const Route = createFileRoute("/publicar")({
  head: () => ({ meta: [{ title: "Publicar anuncio — Che Renda T&T" }] }),
  component: PublicarPage,
});

const STEPS = [
  "Información básica",
  "Ubicación",
  "Capacidad",
  "Servicios",
  "Precios",
];

const TIPOS = ["Casa", "Departamento", "Quinta", "Cabaña", "Glamping"];

const DEPARTAMENTOS: Record<string, string[]> = {
  Central: ["Asunción", "Luque", "San Lorenzo", "Lambaré", "Fernando de la Mora"],
  Cordillera: ["Caacupé", "Tobatí", "Piribebuy", "Atyrá"],
  Itapúa: ["Encarnación", "Hohenau", "Bella Vista"],
  "Alto Paraná": ["Ciudad del Este", "Hernandarias", "Presidente Franco"],
  Paraguarí: ["Paraguarí", "Piribebuy", "Yaguarón"],
  Misiones: ["San Juan Bautista", "Ayolas", "Santa Rosa"],
  Ñeembucú: ["Pilar", "Alberdi"],
  Guairá: ["Villarrica", "Colonia Independencia"],
};

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

function PublicarPage() {
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
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

  const toggleServicio = (s: string) =>
    setServicios((prev) => ({ ...prev, [s]: !prev[s] }));

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!user) {
      openAuthModal();
      return;
    }
    if (!titulo.trim() || !tipo || !precio || !modalidad) {
      toast.error("Completá todos los campos obligatorios");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("properties").insert({
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
      price_modality: modalidad === "noche" ? "per_night" : "full_weekend",
      status: "active",
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("¡Anuncio publicado correctamente!");
    navigate({ to: "/mis-propiedades" });
  };

  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold">Publicar anuncio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Completá los pasos para crear tu Che Renda.
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
                  <SelectContent>
                    {Object.keys(DEPARTAMENTOS).map((d) => (
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
                  <SelectContent>
                    {(DEPARTAMENTOS[departamento] ?? []).map((c) => (
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
                <Counter
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
                <Label htmlFor="precio">Precio base (USD) *</Label>
                <Input
                  id="precio"
                  type="number"
                  min={0}
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="120"
                />
              </div>
              <div className="grid gap-2">
                <Label>Modalidad de cobro *</Label>
                <Select value={modalidad} onValueChange={setModalidad}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná modalidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="noche">Por noche</SelectItem>
                    <SelectItem value="finde">
                      Por fin de semana completo
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-border/60 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={prev}
              disabled={step === 0}
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
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Publicar anuncio
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

function Counter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-8 w-8 rounded-full"
          onClick={() => onChange(value - 1)}
          disabled={value <= 0}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-6 text-center text-sm font-semibold">{value}</span>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-8 w-8 rounded-full"
          onClick={() => onChange(value + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
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
