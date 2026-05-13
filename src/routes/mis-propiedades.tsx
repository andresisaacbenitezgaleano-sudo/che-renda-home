import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Plus } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/site/AuthContext";
import { toast } from "sonner";
import prop1 from "@/assets/prop-1.jpg";

export const Route = createFileRoute("/mis-propiedades")({
  head: () => ({ meta: [{ title: "Mis publicaciones — Che Renda T&T" }] }),
  component: MisPropiedadesPage,
});

interface Listing {
  id: string;
  title: string;
  city: string | null;
  department: string | null;
  price: number;
  images: string[];
  status: "active" | "paused" | "draft";
}

function MisPropiedadesPage() {
  const { user, openAuthModal } = useAuth();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { data: items = [], refetch, isLoading } = useQuery({
    queryKey: ["my-properties", user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<Listing[]> => {
      const { data, error } = await supabase
        .from("properties")
        .select("id, title, city, department, price, images, status")
        .eq("host_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Listing[];
    },
  });

  const toggle = async (p: Listing) => {
    setPendingId(p.id);
    const next = p.status === "active" ? "paused" : "active";
    const { error } = await supabase
      .from("properties")
      .update({ status: next })
      .eq("id", p.id);
    setPendingId(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(next === "active" ? "Anuncio activado" : "Anuncio pausado");
    refetch();
  };

  if (!user) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-md rounded-2xl border border-border/60 bg-card p-8 text-center">
          <h1 className="font-display text-xl font-bold">Iniciá sesión</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Necesitás estar autenticado para ver tus publicaciones.
          </p>
          <Button onClick={openAuthModal} className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
            Iniciar sesión
          </Button>
        </div>
      </SiteShell>
    );
  }

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

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center">
            <p className="font-display text-lg font-semibold">Aún no tenés publicaciones.</p>
            <p className="mt-1 text-sm text-muted-foreground">Empezá creando tu primer anuncio.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => {
              const active = p.status === "active";
              return (
                <article key={p.id} className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
                  <div className="relative aspect-[4/3] bg-muted">
                    <img src={p.images?.[0] || prop1} alt={p.title} className="h-full w-full object-cover" />
                    <Badge
                      className={
                        active
                          ? "absolute left-3 top-3 bg-emerald-500 text-white hover:bg-emerald-500"
                          : "absolute left-3 top-3 bg-muted text-foreground hover:bg-muted"
                      }
                    >
                      {active ? "Activo" : p.status === "paused" ? "Pausado" : "Borrador"}
                    </Badge>
                  </div>
                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="font-display text-base font-semibold">{p.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {[p.city, p.department].filter(Boolean).join(", ") || "Paraguay"}
                      </p>
                      <p className="mt-1 text-sm">
                        <span className="font-semibold">${Number(p.price)}</span>{" "}
                        <span className="text-muted-foreground">/ noche</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/60 pt-3">
                      <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <Switch
                          checked={active}
                          disabled={pendingId === p.id}
                          onCheckedChange={() => toggle(p)}
                        />
                        <span className="text-muted-foreground">{active ? "Activo" : "Pausado"}</span>
                      </label>
                      <Button variant="outline" size="sm">
                        <Pencil className="mr-1.5 h-3.5 w-3.5" />
                        Editar anuncio
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
