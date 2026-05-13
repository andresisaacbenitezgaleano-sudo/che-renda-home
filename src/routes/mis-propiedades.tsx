import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import prop1 from "@/assets/prop-1.jpg";
import prop2 from "@/assets/prop-2.jpg";
import prop3 from "@/assets/prop-3.jpg";

export const Route = createFileRoute("/mis-propiedades")({
  head: () => ({ meta: [{ title: "Mis publicaciones — Che Renda T&T" }] }),
  component: MisPropiedadesPage,
});

interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  active: boolean;
}

const INITIAL: Listing[] = [
  { id: "1", title: "Quinta Vacacional San Ber", location: "San Bernardino, Cordillera", price: 180, image: prop1, active: true },
  { id: "2", title: "Cabaña frente al lago", location: "Areguá, Central", price: 95, image: prop2, active: true },
  { id: "3", title: "Departamento céntrico", location: "Asunción, Central", price: 65, image: prop3, active: false },
];

function MisPropiedadesPage() {
  const [items, setItems] = useState<Listing[]>(INITIAL);

  const toggle = (id: string) =>
    setItems((arr) => arr.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Mis publicaciones</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestioná el estado y los detalles de tus alojamientos.
            </p>
          </div>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/publicar">
              <Plus className="mr-2 h-4 w-4" />
              Nueva publicación
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <article
              key={p.id}
              className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-muted">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover"
                />
                <Badge
                  className={
                    p.active
                      ? "absolute left-3 top-3 bg-emerald-500 text-white hover:bg-emerald-500"
                      : "absolute left-3 top-3 bg-muted text-foreground hover:bg-muted"
                  }
                >
                  {p.active ? "Activo" : "Pausado"}
                </Badge>
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <h3 className="font-display text-base font-semibold">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.location}</p>
                  <p className="mt-1 text-sm">
                    <span className="font-semibold">${p.price}</span>{" "}
                    <span className="text-muted-foreground">/ noche</span>
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-3">
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <Switch
                      checked={p.active}
                      onCheckedChange={() => toggle(p.id)}
                    />
                    <span className="text-muted-foreground">
                      {p.active ? "Activo" : "Pausado"}
                    </span>
                  </label>
                  <Button variant="outline" size="sm">
                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                    Editar anuncio
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
