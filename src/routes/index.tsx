import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/site/Navbar";
import { SearchBar, type SearchFilters } from "@/components/site/SearchBar";
import { PropertyCard, type Property } from "@/components/site/PropertyCard";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import hero from "@/assets/hero-villa.jpg";
import p1 from "@/assets/prop-1.jpg";
import p2 from "@/assets/prop-2.jpg";
import p3 from "@/assets/prop-3.jpg";
import p4 from "@/assets/prop-4.jpg";
import p5 from "@/assets/prop-5.jpg";
import p6 from "@/assets/prop-6.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Che Renda T&T — Alquiler vacacional y turismo" },
      {
        name: "description",
        content:
          "Encuentra alquileres vacacionales únicos y experiencias de viaje con Che Renda Tour and Travel. Villas, cabañas, lofts y más.",
      },
      { property: "og:title", content: "Che Renda T&T — Alquiler vacacional" },
      {
        property: "og:description",
        content: "Reserva tu próxima escapada con Che Renda Tour and Travel.",
      },
    ],
  }),
});

const FALLBACKS = [p1, p2, p3, p4, p5, p6];

function Index() {
  const [resetKey, setResetKey] = useState(0);
  const [filters, setFilters] = useState<SearchFilters>({ guests: 0 });

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties", "active", filters],
    queryFn: async (): Promise<Property[]> => {
      let q = supabase
        .from("properties")
        .select("id, title, city, department, price, images, guests")
        .eq("status", "active");

      if (filters.department) q = q.eq("department", filters.department);
      if (filters.city) q = q.eq("city", filters.city);
      if (filters.guests > 0) q = q.gte("guests", filters.guests);
      if (filters.priceMin != null) q = q.gte("price", filters.priceMin);
      if (filters.priceMax != null) q = q.lte("price", filters.priceMax);

      if (filters.dateFrom && filters.dateTo) {
        const { data: conflicting } = await supabase
          .from("bookings")
          .select("property_id")
          .lt("check_in", filters.dateTo.toISOString().slice(0, 10))
          .gt("check_out", filters.dateFrom.toISOString().slice(0, 10))
          .in("status", ["pending", "confirmed"]);
        const blocked = (conflicting ?? []).map((b) => b.property_id);
        if (blocked.length > 0) q = q.not("id", "in", `(${blocked.join(",")})`);
      }

      const { data, error } = await q
        .order("created_at", { ascending: false })
        .limit(24);
      if (error) throw error;
      return (data ?? []).map((p, i) => ({
        id: p.id,
        title: p.title,
        location: [p.city, p.department].filter(Boolean).join(", ") || "Paraguay",
        pricePerNight: Number(p.price ?? 0),
        rating: 4.9,
        image: p.images?.[0] || FALLBACKS[i % FALLBACKS.length],
      }));
    },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onReset={() => { setResetKey((k) => k + 1); setFilters({ guests: 0 }); }} />

      <section className="relative">
        <div className="relative h-[420px] w-full overflow-hidden md:h-[520px]">
          <img
            src={hero}
            alt="Villa frente al mar al atardecer"
            width={1920}
            height={1280}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="max-w-3xl text-center text-primary-foreground">
              <h1 className="font-display text-4xl font-bold leading-tight drop-shadow-lg sm:text-5xl md:text-6xl">
                Tu próxima escapada,
                <br />
                <span className="italic">empieza acá</span>
              </h1>
              <p className="mt-4 text-base text-primary-foreground/90 sm:text-lg">
                Alquileres vacacionales y experiencias seleccionadas alrededor del mundo.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 -mt-12 px-4 md:-mt-10">
          <SearchBar key={resetKey} onSearch={setFilters} />
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Alojamientos destacados
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Una selección curada por viajeros como vos.
            </p>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando alojamientos…</p>
        ) : properties.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center">
            <p className="font-display text-lg font-semibold">Aún no hay publicaciones activas.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sé el primer anfitrión: publicá tu propiedad desde el menú.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
