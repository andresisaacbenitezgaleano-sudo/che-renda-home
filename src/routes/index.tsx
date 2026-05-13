import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { SearchBar } from "@/components/site/SearchBar";
import { PropertyCard, type Property } from "@/components/site/PropertyCard";
import { Footer } from "@/components/site/Footer";
import { AuthProvider } from "@/components/site/AuthContext";
import { AuthModal } from "@/components/site/AuthModal";
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

const PROPERTIES: Property[] = [
  {
    id: "1",
    title: "Villa Costa al atardecer",
    location: "Punta del Este, Uruguay",
    pricePerNight: 320,
    rating: 4.92,
    image: p1,
  },
  {
    id: "2",
    title: "Cabaña alpina con chimenea",
    location: "Bariloche, Argentina",
    pricePerNight: 185,
    rating: 4.87,
    image: p2,
  },
  {
    id: "3",
    title: "Loft urbano con vista panorámica",
    location: "São Paulo, Brasil",
    pricePerNight: 240,
    rating: 4.81,
    image: p3,
  },
  {
    id: "4",
    title: "Casa de campo entre viñedos",
    location: "Mendoza, Argentina",
    pricePerNight: 210,
    rating: 4.95,
    image: p4,
  },
  {
    id: "5",
    title: "Bungalow tropical sobre el agua",
    location: "Cartagena, Colombia",
    pricePerNight: 410,
    rating: 4.98,
    image: p5,
  },
  {
    id: "6",
    title: "Cottage escandinavo junto al lago",
    location: "Villarrica, Chile",
    pricePerNight: 175,
    rating: 4.78,
    image: p6,
  },
];

function Index() {
  const [resetKey, setResetKey] = useState(0);

  return (
    <AuthProvider>
    <div className="min-h-screen bg-background">
      <Navbar onReset={() => setResetKey((k) => k + 1)} />
      <AuthModal />

      <section className="relative">
        <div className="relative h-[420px] w-full overflow-hidden md:h-[520px]">
          <img
            src={hero}
            alt="Villa frente al mar al atardecer"
            width={1920}
            height={1280}
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "var(--gradient-hero)" }}
          />
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
          <SearchBar key={resetKey} />
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
          <button className="hidden text-sm font-semibold text-primary hover:underline md:inline">
            Ver todos →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {PROPERTIES.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
    </AuthProvider>
  );
}
