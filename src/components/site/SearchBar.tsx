import { useMemo, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Search, MapPin, CalendarDays, Users, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { PARAGUAY_DEPARTAMENTOS } from "@/lib/paraguay-geo";
import { formatGs } from "@/lib/format";

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

export interface SearchFilters {
  department?: string;
  city?: string;
  dateFrom?: Date;
  dateTo?: Date;
  guests: number;
  priceMin?: number;
  priceMax?: number;
}

const ANY = "__any__";

function NumberField({
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
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="flex-1">
        <div className="text-sm font-semibold text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{hint}</div>
      </div>
      <Input
        type="number"
        inputMode="numeric"
        min={min}
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          onChange(Number.isFinite(v) ? Math.max(min, v) : min);
        }}
        className="h-9 w-20 text-center"
      />
    </div>
  );
}

function DestinoPicker({
  department,
  city,
  onChange,
}: {
  department?: string;
  city?: string;
  onChange: (d?: string, c?: string) => void;
}) {
  const departamentos = useMemo(() => Object.keys(PARAGUAY_DEPARTAMENTOS), []);
  const ciudades = department ? PARAGUAY_DEPARTAMENTOS[department] ?? [] : [];

  return (
    <div className="space-y-3 p-1">
      <div>
        <label className="mb-1 block text-xs font-semibold text-foreground">
          Departamento
        </label>
        <Select
          value={department ?? ANY}
          onValueChange={(v) => onChange(v === ANY ? undefined : v, undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Cualquier departamento" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value={ANY}>Cualquier departamento</SelectItem>
            {departamentos.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-foreground">
          Ciudad
        </label>
        <Select
          value={city ?? ANY}
          onValueChange={(v) =>
            onChange(department, v === ANY ? undefined : v)
          }
          disabled={!department}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                department ? "Cualquier ciudad" : "Elegí un departamento"
              }
            />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value={ANY}>Cualquier ciudad</SelectItem>
            {ciudades.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function PriceBlock({
  min,
  max,
  onChange,
}: {
  min?: number;
  max?: number;
  onChange: (min?: number, max?: number) => void;
}) {
  return (
    <div className="space-y-3 p-1">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Mínimo (Gs.)</Label>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="0"
            value={min ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              onChange(v === "" ? undefined : Math.max(0, Number(v)), max);
            }}
            className="mt-1 h-10"
          />
        </div>
        <div>
          <Label className="text-xs">Máximo (Gs.)</Label>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Sin tope"
            value={max ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              onChange(min, v === "" ? undefined : Math.max(0, Number(v)));
            }}
            className="mt-1 h-10"
          />
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Todos los precios en Guaraníes (Gs.).
      </p>
    </div>
  );
}

export function SearchBar({
  onSearch,
}: {
  onSearch?: (f: SearchFilters) => void;
}) {
  const [department, setDepartment] = useState<string | undefined>();
  const [city, setCity] = useState<string | undefined>();
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState<GuestState>(initialGuests);
  const [priceMin, setPriceMin] = useState<number | undefined>();
  const [priceMax, setPriceMax] = useState<number | undefined>();
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalGuests = guests.adultos + guests.ninos;
  const guestLabel =
    totalGuests === 0 && guests.bebes === 0 && guests.mascotas === 0
      ? "Añadir"
      : `${totalGuests} huésped${totalGuests !== 1 ? "es" : ""}${
          guests.bebes ? `, ${guests.bebes} bebé${guests.bebes > 1 ? "s" : ""}` : ""
        }${guests.mascotas ? `, ${guests.mascotas} mascota${guests.mascotas > 1 ? "s" : ""}` : ""}`;

  const destinoLabel = city ?? department ?? "Buscar región o ciudad";

  const dateLabel = range?.from
    ? range.to
      ? `${format(range.from, "d MMM", { locale: es })} – ${format(range.to, "d MMM", { locale: es })}`
      : format(range.from, "d MMM", { locale: es })
    : "Añadir fechas";

  const priceLabel =
    priceMin == null && priceMax == null
      ? "Cualquier precio"
      : `${priceMin != null ? formatGs(priceMin) : "Gs. 0"} – ${
          priceMax != null ? formatGs(priceMax) : "∞"
        }`;

  const runSearch = () => {
    onSearch?.({
      department,
      city,
      dateFrom: range?.from,
      dateTo: range?.to,
      guests: totalGuests,
      priceMin,
      priceMax,
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Mobile */}
      <div className="md:hidden">
        <Popover open={mobileOpen} onOpenChange={setMobileOpen}>
          <PopoverTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-full border border-border/60 bg-card px-4 py-3 shadow-[var(--shadow-float)]">
              <Search className="h-4 w-4 text-foreground" />
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold text-foreground">
                  ¿A dónde vamos?
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {(city || department) ?? "Cualquier sitio"} ·{" "}
                  {range?.from ? dateLabel : "Cualquier fecha"} ·{" "}
                  {totalGuests} huésp.
                </div>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Search className="h-4 w-4" />
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="center"
            className="z-50 max-h-[80vh] w-[92vw] max-w-md space-y-4 overflow-y-auto p-4"
          >
            <div>
              <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-foreground">
                Destino
              </div>
              <DestinoPicker
                department={department}
                city={city}
                onChange={(d, c) => {
                  setDepartment(d);
                  setCity(c);
                }}
              />
            </div>
            <div>
              <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-foreground">
                Fechas
              </div>
              <Calendar
                mode="range"
                numberOfMonths={1}
                selected={range}
                onSelect={setRange}
                locale={es}
                className={cn("p-2 pointer-events-auto")}
              />
            </div>
            <div>
              <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-foreground">
                Precio (Gs.)
              </div>
              <PriceBlock
                min={priceMin}
                max={priceMax}
                onChange={(mn, mx) => {
                  setPriceMin(mn);
                  setPriceMax(mx);
                }}
              />
            </div>
            <div>
              <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-foreground">
                Huéspedes
              </div>
              <NumberField
                label="Adultos"
                hint="13 años o más"
                value={guests.adultos}
                onChange={(n) => setGuests({ ...guests, adultos: n })}
                min={1}
              />
              <div className="border-t border-border" />
              <NumberField
                label="Niños"
                hint="De 2 a 12 años"
                value={guests.ninos}
                onChange={(n) => setGuests({ ...guests, ninos: n })}
              />
              <div className="border-t border-border" />
              <NumberField
                label="Bebés"
                hint="Menores de 2 años"
                value={guests.bebes}
                onChange={(n) => setGuests({ ...guests, bebes: n })}
              />
              <div className="border-t border-border" />
              <NumberField
                label="Mascotas"
                hint="Animal de compañía"
                value={guests.mascotas}
                onChange={(n) => setGuests({ ...guests, mascotas: n })}
              />
            </div>
            <Button
              className="w-full rounded-full"
              onClick={() => {
                setMobileOpen(false);
                runSearch();
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      {/* Desktop capsule */}
      <div className="hidden md:block">
        <div className="flex items-stretch rounded-full border border-border/50 bg-card p-2 shadow-[var(--shadow-float)]">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex flex-1 items-center gap-3 rounded-full px-5 py-2 text-left transition-colors hover:bg-accent/50">
                <MapPin className="h-4 w-4 text-brand" />
                <div className="flex-1">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-foreground">
                    Destinos
                  </div>
                  <div
                    className={cn(
                      "truncate text-sm",
                      city || department
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {destinoLabel}
                  </div>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 p-3">
              <DestinoPicker
                department={department}
                city={city}
                onChange={(d, c) => {
                  setDepartment(d);
                  setCity(c);
                }}
              />
            </PopoverContent>
          </Popover>

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
                <Banknote className="h-4 w-4 text-brand" />
                <div className="flex-1">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-foreground">
                    Precio
                  </div>
                  <div
                    className={cn(
                      "truncate text-sm",
                      priceMin != null || priceMax != null
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {priceLabel}
                  </div>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="center">
              <PriceBlock
                min={priceMin}
                max={priceMax}
                onChange={(mn, mx) => {
                  setPriceMin(mn);
                  setPriceMax(mx);
                }}
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
              <NumberField
                label="Adultos"
                hint="13 años o más"
                value={guests.adultos}
                onChange={(n) => setGuests({ ...guests, adultos: n })}
                min={1}
              />
              <div className="border-t border-border" />
              <NumberField
                label="Niños"
                hint="De 2 a 12 años"
                value={guests.ninos}
                onChange={(n) => setGuests({ ...guests, ninos: n })}
              />
              <div className="border-t border-border" />
              <NumberField
                label="Bebés"
                hint="Menores de 2 años"
                value={guests.bebes}
                onChange={(n) => setGuests({ ...guests, bebes: n })}
              />
              <div className="border-t border-border" />
              <NumberField
                label="Mascotas"
                hint="Animal de compañía"
                value={guests.mascotas}
                onChange={(n) => setGuests({ ...guests, mascotas: n })}
              />
            </PopoverContent>
          </Popover>

          <Button
            size="icon"
            onClick={runSearch}
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
