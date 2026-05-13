import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Search, MapPin, CalendarDays, Users, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface GuestState {
  adultos: number;
  ninos: number;
  bebes: number;
  mascotas: number;
}

const initialGuests: GuestState = {
  adultos: 1,
  ninos: 0,
  bebes: 0,
  mascotas: 0,
};

function GuestRow({
  label,
  hint,
  value,
  onChange,
  min = 0,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-sm font-semibold text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{hint}</div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 rounded-full"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="w-5 text-center text-sm font-medium">{value}</span>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 rounded-full"
          onClick={() => onChange(value + 1)}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function SearchBar() {
  const [destino, setDestino] = useState("");
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState<GuestState>(initialGuests);

  const totalGuests = guests.adultos + guests.ninos;
  const guestLabel =
    totalGuests === 0 && guests.bebes === 0 && guests.mascotas === 0
      ? "Añadir"
      : `${totalGuests} huésped${totalGuests !== 1 ? "es" : ""}${
          guests.bebes ? `, ${guests.bebes} bebé${guests.bebes > 1 ? "s" : ""}` : ""
        }${guests.mascotas ? `, ${guests.mascotas} mascota${guests.mascotas > 1 ? "s" : ""}` : ""}`;

  const dateLabel = range?.from
    ? range.to
      ? `${format(range.from, "d MMM", { locale: es })} – ${format(range.to, "d MMM", { locale: es })}`
      : format(range.from, "d MMM", { locale: es })
    : "Añadir fechas";

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Mobile */}
      <div className="md:hidden">
        <button className="flex w-full items-center gap-3 rounded-full border border-border/60 bg-card px-4 py-3 shadow-[var(--shadow-float)]">
          <Search className="h-4 w-4 text-foreground" />
          <div className="flex-1 text-left">
            <div className="text-sm font-semibold text-foreground">¿A dónde vamos?</div>
            <div className="text-xs text-muted-foreground">
              Cualquier sitio · Cualquier fecha · Añadir huéspedes
            </div>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Search className="h-4 w-4" />
          </span>
        </button>
      </div>

      {/* Desktop capsule */}
      <div className="hidden md:block">
        <div className="flex items-stretch rounded-full border border-border/50 bg-card p-2 shadow-[var(--shadow-float)]">
          <div className="flex flex-1 items-center gap-3 rounded-full px-5 py-2 transition-colors hover:bg-accent/50">
            <MapPin className="h-4 w-4 text-brand" />
            <div className="flex-1">
              <label className="block text-[11px] font-bold uppercase tracking-wide text-foreground">
                Destinos
              </label>
              <Input
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                placeholder="Buscar región o ciudad"
                className="h-6 border-0 bg-transparent px-0 text-sm shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="my-2 w-px bg-border" />

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex flex-1 items-center gap-3 rounded-full px-5 py-2 text-left transition-colors hover:bg-accent/50">
                <CalendarDays className="h-4 w-4 text-brand" />
                <div className="flex-1">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-foreground">
                    Ingreso / Salida
                  </div>
                  <div
                    className={cn(
                      "text-sm",
                      range?.from ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {dateLabel}
                  </div>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="range"
                numberOfMonths={2}
                selected={range}
                onSelect={setRange}
                locale={es}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          <div className="my-2 w-px bg-border" />

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex flex-1 items-center gap-3 rounded-full px-5 py-2 text-left transition-colors hover:bg-accent/50">
                <Users className="h-4 w-4 text-brand" />
                <div className="flex-1">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-foreground">
                    Personas
                  </div>
                  <div className="truncate text-sm text-muted-foreground">{guestLabel}</div>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <GuestRow
                label="Adultos"
                hint="13 años o más"
                value={guests.adultos}
                onChange={(n) => setGuests({ ...guests, adultos: n })}
                min={1}
              />
              <div className="border-t border-border" />
              <GuestRow
                label="Niños"
                hint="De 2 a 12 años"
                value={guests.ninos}
                onChange={(n) => setGuests({ ...guests, ninos: n })}
              />
              <div className="border-t border-border" />
              <GuestRow
                label="Bebés"
                hint="Menores de 2 años"
                value={guests.bebes}
                onChange={(n) => setGuests({ ...guests, bebes: n })}
              />
              <div className="border-t border-border" />
              <GuestRow
                label="Mascotas"
                hint="¿Viajas con un animal de servicio?"
                value={guests.mascotas}
                onChange={(n) => setGuests({ ...guests, mascotas: n })}
              />
            </PopoverContent>
          </Popover>

          <Button
            size="icon"
            className="my-auto ml-2 h-12 w-12 shrink-0 rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105 hover:bg-primary/90"
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
