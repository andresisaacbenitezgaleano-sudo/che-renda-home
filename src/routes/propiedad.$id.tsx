import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Share, Heart, Star, Award, Grid3x3, ChevronDown,
  Users, Minus, Plus, CalendarDays,
  ChefHat, Wifi, Briefcase, Car, Cctv,
  Waves, Flame, Tv, Snowflake, Bed, Microwave, Shirt,
  ShieldCheck, HeartPulse, AlertTriangle, Bath, PawPrint,
  Trophy, Volleyball, Sparkles,
} from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";
import { es } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

import p1 from "@/assets/prop-1.jpg";
import p2 from "@/assets/prop-2.jpg";
import p3 from "@/assets/prop-3.jpg";
import p4 from "@/assets/prop-4.jpg";
import p5 from "@/assets/prop-5.jpg";

export const Route = createFileRoute("/propiedad/$id")({
  component: PropertyDetail,
  head: ({ params }) => ({
    meta: [
      { title: `Quinta Vacacional San Ber — Che Renda T&T` },
      {
        name: "description",
        content:
          "Quinta vacacional con piscina, parrilla y amplios espacios verdes en San Bernardino, Paraguay.",
      },
      { property: "og:title", content: `Propiedad ${params.id} — Che Renda T&T` },
    ],
  }),
});

const GALLERY = [p1, p2, p3, p4, p5];

const DESCRIPTION = `Quinta de descanso ubicada a pocos minutos del centro de San Bernardino, ideal para escapadas en familia o con amigos. Cuenta con amplios espacios verdes, piscina con deck de madera, quincho con parrilla tradicional paraguaya, y vista directa al lago Ypacaraí.

La casa principal tiene 4 habitaciones equipadas, sala de estar con chimenea, cocina completa con vajilla y todos los electrodomésticos necesarios para una estadía cómoda. Disponemos también de wifi de alta velocidad, smart TV y aire acondicionado en cada ambiente.

A pocos pasos encontrarás restaurantes, almacenes y la costanera. Recibimos huéspedes con mascotas previa coordinación. Nuestro equipo está disponible 24/7 para cualquier consulta durante tu estadía.`;

const QUICK_AMENITIES = [
  { icon: ChefHat, label: "Cocina equipada" },
  { icon: Wifi, label: "Wifi de alta velocidad" },
  { icon: Briefcase, label: "Zona de trabajo" },
  { icon: Car, label: "Estacionamiento gratuito" },
  { icon: Cctv, label: "Cámaras de seguridad" },
];

const AMENITY_GROUPS: { title: string; items: { icon: any; label: string }[] }[] = [
  {
    title: "Instalaciones y Ocio",
    items: [
      { icon: Waves, label: "Piscina" },
      { icon: Flame, label: "Quincho con parrilla" },
      { icon: Snowflake, label: "Salón climatizado" },
      { icon: Car, label: "Garage / Estacionamiento" },
      { icon: Trophy, label: "Cancha de fútbol" },
      { icon: Volleyball, label: "Cancha de vóley" },
      { icon: Sparkles, label: "Mesa de pool" },
      { icon: PawPrint, label: "Hamaca paraguaya" },
      { icon: Flame, label: "Lugar para fogatas" },
    ],
  },
  {
    title: "Confort y Habitaciones",
    items: [
      { icon: Snowflake, label: "3 habitaciones con aire acondicionado" },
      { icon: Bed, label: "1 habitación sin aire acondicionado" },
      { icon: Bed, label: "6 camas en total" },
      { icon: Microwave, label: "Microondas" },
      { icon: Wifi, label: "Wifi" },
      { icon: Briefcase, label: "Zona de trabajo" },
      { icon: Tv, label: "TV" },
      { icon: Shirt, label: "Espacio para guardar ropa" },
      { icon: Bed, label: "Almohadas y mantas adicionales" },
    ],
  },
  {
    title: "Seguridad y Básicos",
    items: [
      { icon: Cctv, label: "Cámaras interior y exterior" },
      { icon: HeartPulse, label: "Botiquín de primeros auxilios" },
      { icon: AlertTriangle, label: "Detector de monóxido de carbono" },
      { icon: AlertTriangle, label: "Detector de humo" },
      { icon: Bath, label: "Toallas, sábanas, jabón y papel higiénico" },
    ],
  },
  {
    title: "Reglas",
    items: [{ icon: PawPrint, label: "Se permiten mascotas" }],
  },
];

const REVIEWS = [
  { name: "Lucía", initial: "L", rating: 5, stay: "Estadía de una noche", date: "Marzo 2026", text: "Lugar hermoso, impecable y muy bien ubicado. Mariano súper atento, volveríamos sin dudarlo." },
  { name: "Carlos", initial: "C", rating: 5, stay: "Estadía de un fin de semana", date: "Febrero 2026", text: "La quinta superó nuestras expectativas. La piscina y el quincho son una maravilla. Los chicos disfrutaron muchísimo de los espacios verdes y la cancha." },
  { name: "Sofía", initial: "S", rating: 4, stay: "Estadía de dos noches", date: "Enero 2026", text: "Muy buena experiencia, todo limpio y prolijo. Recomendamos llevar repelente para las noches al aire libre." },
  { name: "Diego", initial: "D", rating: 5, stay: "Estadía de tres noches", date: "Diciembre 2025", text: "Anfitrión 10/10. La casa está equipada con todo lo necesario y el entorno es ideal para descansar." },
  { name: "Marina", initial: "M", rating: 5, stay: "Estadía de una noche", date: "Noviembre 2025", text: "Perfecta para una escapada corta. Vista al lago increíble." },
  { name: "Javier", initial: "J", rating: 4, stay: "Estadía de un fin de semana", date: "Octubre 2025", text: "Excelente relación precio-calidad. La cocina está muy bien equipada." },
  { name: "Paula", initial: "P", rating: 5, stay: "Estadía de dos noches", date: "Septiembre 2025", text: "Nos sentimos como en casa. Muy buena atención del anfitrión y todo funcionó perfecto." },
  { name: "Tomás", initial: "T", rating: 5, stay: "Estadía de cuatro noches", date: "Agosto 2025", text: "Vacaciones inolvidables en familia. La cancha de fútbol fue un éxito con los chicos." },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("h-3.5 w-3.5", i < n ? "fill-current text-foreground" : "text-muted-foreground/40")} />
      ))}
    </div>
  );
}

function ReviewCard({ r }: { r: typeof REVIEWS[number] }) {
  const [open, setOpen] = useState(false);
  const long = r.text.length > 140;
  return (
    <div className="rounded-2xl border border-border p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-brand text-sm font-bold text-primary-foreground">
          {r.initial}
        </div>
        <div>
          <div className="text-sm font-semibold">{r.name}</div>
          <div className="text-xs text-muted-foreground">{r.stay} · {r.date}</div>
        </div>
      </div>
      <div className="mt-2"><Stars n={r.rating} /></div>
      <p className={cn("mt-2 text-sm leading-relaxed", !open && long && "line-clamp-3")}>
        {r.text}
      </p>
      {long && (
        <button onClick={() => setOpen(!open)} className="mt-1 text-xs font-semibold underline underline-offset-4">
          {open ? "Mostrar menos" : "Mostrar más"}
        </button>
      )}
    </div>
  );
}

function GuestRow({
  label, hint, value, onChange, min = 0,
}: {
  label: string; hint: string; value: number;
  onChange: (n: number) => void; min?: number;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground">{hint}</div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          size="icon" variant="outline" className="h-8 w-8 rounded-full"
          onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
        ><Minus className="h-3.5 w-3.5" /></Button>
        <span className="w-5 text-center text-sm font-medium">{value}</span>
        <Button
          size="icon" variant="outline" className="h-8 w-8 rounded-full"
          onClick={() => onChange(value + 1)}
        ><Plus className="h-3.5 w-3.5" /></Button>
      </div>
    </div>
  );
}

function DateButton({
  label, date, onSelect, fromDate,
}: {
  label: string; date?: Date;
  onSelect: (d: Date | undefined) => void; fromDate?: Date;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex-1 rounded-lg border border-border px-3 py-2 text-left transition-colors hover:bg-accent/50">
          <div className="text-[10px] font-bold uppercase tracking-wide">{label}</div>
          <div className="text-sm text-foreground">
            {date ? format(date, "d MMM yyyy", { locale: es }) : "Añadir"}
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single" selected={date} onSelect={onSelect} locale={es}
          disabled={fromDate ? { before: fromDate } : undefined}
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}

function PropertyDetail() {
  const { id } = Route.useParams();
  const [fav, setFav] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [modality, setModality] = useState<"Por Noche" | "Por Fin de Semana Completo">("Por Noche");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState({ adultos: 2, ninos: 0, mascotas: 0 });
  const [availRange, setAvailRange] = useState<DateRange | undefined>();
  const [showAllReviews, setShowAllReviews] = useState(false);

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  const { data: property } = useQuery({
    queryKey: ["property", id],
    enabled: isUuid,
    queryFn: async () => {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      return data;
    },
  });

  const nights =
    availRange?.from && availRange?.to
      ? Math.max(0, differenceInCalendarDays(availRange.to, availRange.from))
      : 0;

  const basePrice = property
    ? Number(property.price)
    : modality === "Por Noche" ? 180 : 420;
  const totalGuests = guests.adultos + guests.ninos;
  const guestLabel = `${totalGuests} huésped${totalGuests !== 1 ? "es" : ""}${
    guests.mascotas ? `, ${guests.mascotas} mascota${guests.mascotas > 1 ? "s" : ""}` : ""
  }`;

  const displayTitle = property?.title ?? "Quinta Vacacional San Ber";
  const displayLocation = property
    ? [property.city, property.department].filter(Boolean).join(", ") || "Paraguay"
    : "San Bernardino, Paraguay";
  const displayDescription = property?.description ?? DESCRIPTION;

  return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <h1 className="font-display text-2xl font-bold sm:text-3xl">
              {displayTitle}
            </h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <Share className="h-4 w-4" /> Compartir
              </Button>
              <Button
                variant="ghost" size="sm" className="gap-2"
                onClick={() => setFav(!fav)}
              >
                <Heart className={cn("h-4 w-4", fav && "fill-primary text-primary")} />
                Guardar
              </Button>
            </div>
          </div>

          {/* Gallery */}
          <div className="relative grid h-[280px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl sm:h-[420px]">
            <img src={GALLERY[0]} alt="Vista principal" className="col-span-2 row-span-2 h-full w-full object-cover" />
            {GALLERY.slice(1, 5).map((src, i) => (
              <img key={i} src={src} alt={`Vista ${i + 2}`} className="h-full w-full object-cover" />
            ))}
            <button className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-background/90 px-3 py-2 text-sm font-medium shadow-md backdrop-blur-md hover:bg-background">
              <Grid3x3 className="h-4 w-4" /> Mostrar todas las fotos
            </button>
          </div>

          {/* Two columns */}
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Left */}
            <div className="space-y-8 lg:col-span-2">
              <div className="border-b border-border pb-6">
                <h2 className="font-display text-xl font-bold">
                  {displayTitle} en {displayLocation}
                </h2>
                <p className="mt-1 text-muted-foreground">
                  10 huéspedes máx. · 4 habitaciones · 6 camas · 3 baños
                </p>
              </div>

              {/* Quality badge */}
              <div className="flex items-center gap-4 rounded-2xl border border-border p-5 shadow-[var(--shadow-card)]">
                <Award className="h-10 w-10 text-primary" />
                <div className="flex-1">
                  <div className="font-semibold">Favorito entre huéspedes</div>
                  <div className="text-sm text-muted-foreground">
                    Una de las casas más queridas de Che Renda T&T
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 font-semibold">
                    <Star className="h-4 w-4 fill-current" /> 5.0
                  </div>
                  <div className="text-xs text-muted-foreground">128 evaluaciones</div>
                </div>
              </div>

              {/* Host */}
              <div className="flex items-center gap-4 border-b border-border pb-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-brand text-lg font-bold text-primary-foreground">
                  M
                </div>
                <div>
                  <div className="font-semibold">Anfitrión: Mariano</div>
                  <div className="text-sm text-muted-foreground">
                    7 años de experiencia en Che Renda T&T
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="mb-3 font-display text-xl font-bold">Sobre este lugar</h3>
                <p
                  className={cn(
                    "whitespace-pre-line text-sm leading-relaxed text-foreground/90",
                    !expanded && "line-clamp-4",
                  )}
                >
                  {displayDescription}
                </p>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-3 text-sm font-semibold underline underline-offset-4"
                >
                  {expanded ? "Mostrar menos" : "Mostrar más"}
                </button>
              </div>

              {/* What this place offers */}
              <div className="border-t border-border pt-8">
                <h3 className="mb-4 font-display text-xl font-bold">¿Qué ofrece este lugar?</h3>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {QUICK_AMENITIES.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-3 text-sm">
                      <Icon className="h-5 w-5 text-foreground" />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="mt-5 rounded-xl">
                      Mostrar los servicios
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-display text-2xl">Lo que ofrece este lugar</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 pt-2">
                      {AMENITY_GROUPS.map((g) => (
                        <div key={g.title}>
                          <h4 className="mb-3 text-base font-bold">{g.title}</h4>
                          <ul className="divide-y divide-border">
                            {g.items.map((it) => (
                              <li key={it.label} className="flex items-center gap-3 py-3 text-sm">
                                <it.icon className="h-5 w-5 shrink-0 text-foreground" />
                                <span>{it.label}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Availability calendar */}
              <div className="border-t border-border pt-8">
                <div className="mb-4 flex items-end justify-between gap-2">
                  <div>
                    <h3 className="font-display text-xl font-bold">
                      {nights > 0 ? `${nights} noche${nights > 1 ? "s" : ""} en Asunción` : "Elegí tus fechas"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {availRange?.from && availRange?.to
                        ? `${format(availRange.from, "d MMM", { locale: es })} – ${format(availRange.to, "d MMM yyyy", { locale: es })}`
                        : "Disponibilidad en tiempo real"}
                    </p>
                  </div>
                  <button
                    onClick={() => setAvailRange(undefined)}
                    className="text-sm font-semibold underline underline-offset-4"
                  >
                    Borrar fechas
                  </button>
                </div>
                <div className="rounded-2xl border border-border p-2">
                  <Calendar
                    mode="range"
                    numberOfMonths={typeof window !== "undefined" && window.innerWidth >= 768 ? 2 : 1}
                    selected={availRange}
                    onSelect={setAvailRange}
                    locale={es}
                    className={cn("p-3 pointer-events-auto [&_[data-selected=true]]:bg-foreground [&_[data-selected=true]]:text-background")}
                  />
                </div>
              </div>

              {/* Reviews */}
              <div className="border-t border-border pt-8">
                <div className="mb-5 flex items-center gap-2">
                  <Star className="h-5 w-5 fill-current" />
                  <h3 className="font-display text-xl font-bold">5.0 · {REVIEWS.length * 16} evaluaciones</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {REVIEWS.slice(0, 6).map((r, i) => <ReviewCard key={i} r={r} />)}
                </div>
                <Dialog open={showAllReviews} onOpenChange={setShowAllReviews}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="mt-6 rounded-xl">
                      Mostrar todo: evaluaciones
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-display text-2xl">Todas las evaluaciones</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4 pt-2">
                      {REVIEWS.map((r, i) => <ReviewCard key={i} r={r} />)}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Right — Sticky reservation */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-float)]">
                <div className="mb-4 flex items-baseline justify-between gap-2">
                  <div>
                    <span className="text-2xl font-bold">${basePrice}</span>
                    <span className="ml-1 text-sm text-muted-foreground">USD</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        {modality} <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setModality("Por Noche")}>
                        Por Noche
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setModality("Por Fin de Semana Completo")}>
                        Por Fin de Semana Completo
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 rounded-xl border border-border p-2">
                  <div className="flex gap-2">
                    <DateButton label="Check-in" date={checkIn} onSelect={setCheckIn} />
                    <DateButton label="Check-out" date={checkOut} onSelect={setCheckOut} fromDate={checkIn} />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-left transition-colors hover:bg-accent/50">
                        <Users className="h-4 w-4" />
                        <div className="flex-1">
                          <div className="text-[10px] font-bold uppercase tracking-wide">Huéspedes</div>
                          <div className="text-sm">{guestLabel}</div>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-4" align="end">
                      <GuestRow
                        label="Adultos" hint="13 años o más"
                        value={guests.adultos} min={1}
                        onChange={(n) => setGuests({ ...guests, adultos: n })}
                      />
                      <div className="border-t border-border" />
                      <GuestRow
                        label="Niños" hint="De 2 a 12 años"
                        value={guests.ninos}
                        onChange={(n) => setGuests({ ...guests, ninos: n })}
                      />
                      <div className="border-t border-border" />
                      <GuestRow
                        label="Mascotas" hint="¿Viajás con un animal?"
                        value={guests.mascotas}
                        onChange={(n) => setGuests({ ...guests, mascotas: n })}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button className="mt-4 h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90">
                  Reservar
                </Button>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Al presionar Reservar, aceptás las Normas de la Casa del Anfitrión
                  y las Políticas de Cancelación de Che Renda T&T.
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" /> Cancelación gratuita 48h
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </main>

        <Footer />
      </div>
  );
}
