import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, SideNav } from "@/components/site/SiteShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PropertyCard, type Property } from "@/components/site/PropertyCard";
import p1 from "@/assets/prop-1.jpg";
import p2 from "@/assets/prop-2.jpg";
import p3 from "@/assets/prop-3.jpg";
import p4 from "@/assets/prop-4.jpg";
import { toast } from "sonner";

export const Route = createFileRoute("/historial")({
  head: () => ({ meta: [{ title: "Historial — Che Renda T&T" }] }),
  component: HistorialPage,
});

const TRIPS = [
  { id: "t1", title: "Villa Costa al atardecer", img: p1, dates: "12 – 16 mar 2025", status: "Confirmado" as const },
  { id: "t2", title: "Cabaña alpina con chimenea", img: p2, dates: "02 – 05 jul 2025", status: "Pendiente" as const },
  { id: "t3", title: "Loft urbano con vista panorámica", img: p3, dates: "20 – 22 ene 2024", status: "Confirmado" as const },
];

const FAVS: Property[] = [
  { id: "1", title: "Villa Costa al atardecer", location: "Punta del Este, Uruguay", pricePerNight: 320, rating: 4.92, image: p1 },
  { id: "4", title: "Casa de campo entre viñedos", location: "Mendoza, Argentina", pricePerNight: 210, rating: 4.95, image: p4 },
  { id: "3", title: "Loft urbano con vista panorámica", location: "São Paulo, Brasil", pricePerNight: 240, rating: 4.81, image: p3 },
];

function HistorialPage() {
  return (
    <SiteShell>
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <SideNav />
        <section>
          <h1 className="mb-6 font-display text-3xl font-bold">Historial</h1>
          <Tabs defaultValue="trips">
            <TabsList className="mb-6">
              <TabsTrigger value="trips">Mis Viajes</TabsTrigger>
              <TabsTrigger value="favs">Favoritos</TabsTrigger>
            </TabsList>

            <TabsContent value="trips" className="space-y-4">
              {TRIPS.map((t) => (
                <article key={t.id} className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:flex-row">
                  <img src={t.img} alt={t.title} className="h-40 w-full rounded-xl object-cover sm:h-28 sm:w-44" />
                  <div className="flex flex-1 flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-lg font-semibold">{t.title}</h3>
                        <Badge
                          variant={t.status === "Confirmado" ? "default" : "secondary"}
                          className={t.status === "Confirmado" ? "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400" : ""}
                        >
                          {t.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{t.dates}</p>
                    </div>
                    <Button variant="outline" className="self-start" onClick={() => toast("Abriendo formulario de reseña")}>
                      Dejar reseña
                    </Button>
                  </div>
                </article>
              ))}
            </TabsContent>

            <TabsContent value="favs">
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {FAVS.map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </SiteShell>
  );
}
