import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatGs } from "@/lib/format";

export interface Property {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  image: string;
}

export function PropertyCard({ property }: { property: Property }) {
  const [fav, setFav] = useState(false);
  return (
    <Link to="/propiedad/$id" params={{ id: property.id }} className="group block cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl bg-muted shadow-[var(--shadow-card)]">
        <img
          src={property.image}
          alt={property.title}
          loading="lazy"
          width={1024}
          height={768}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setFav(!fav);
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/40 backdrop-blur-md transition hover:bg-background/60"
          aria-label="Guardar como favorito"
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              fav ? "fill-primary text-primary" : "fill-foreground/30 text-background",
            )}
          />
        </button>
      </div>
      <div className="mt-3 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold text-foreground">
            {property.title}
          </h3>
          <div className="flex shrink-0 items-center gap-1 text-sm text-foreground">
            <Star className="h-3.5 w-3.5 fill-current" />
            {property.rating.toFixed(1)}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{property.location}</p>
        <p className="pt-1 text-sm text-foreground">
          <span className="font-semibold">{formatGs(property.pricePerNight)}</span>{" "}
          <span className="text-muted-foreground">/ noche</span>
        </p>
      </div>
    </Link>
  );
}
