import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell, SideNav } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/site/AuthContext";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Perfil — Che Renda T&T" }] }),
  component: PerfilPage,
});

function PerfilPage() {
  const { user, openAuthModal } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, phone, bio")
        .eq("id", user.id)
        .maybeSingle();
      setFullName(data?.full_name ?? "");
      setEmail(data?.email ?? user.email ?? "");
      setPhone(data?.phone ?? "");
      setBio(data?.bio ?? "");
      setLoaded(true);
    })();
  }, [user]);

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, email, phone, bio })
      .eq("id", user.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Cambios guardados");
  };

  if (!user) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-md rounded-2xl border border-border/60 bg-card p-8 text-center">
          <h1 className="font-display text-xl font-bold">Iniciá sesión</h1>
          <Button onClick={openAuthModal} className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
            Iniciar sesión
          </Button>
        </div>
      </SiteShell>
    );
  }

  const initial = (fullName || email || "A").trim()[0]?.toUpperCase() || "A";

  return (
    <SiteShell>
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <SideNav />
        <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-brand text-4xl font-bold text-primary-foreground shadow-lg">
              {initial}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-display text-2xl font-bold text-foreground">{fullName || "Tu perfil"}</h1>
              <p className="text-sm text-muted-foreground">{email}</p>
              <Badge className="mt-2 bg-primary/10 text-primary hover:bg-primary/15">Huésped</Badge>
            </div>
          </div>

          <div className="mt-8 grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={!loaded} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!loaded} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!loaded} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Sobre mí</Label>
              <Textarea id="bio" rows={5} value={bio} onChange={(e) => setBio(e.target.value)} disabled={!loaded} />
            </div>
            <Button
              onClick={save}
              disabled={busy || !loaded}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto sm:self-end"
            >
              {busy ? "Guardando…" : "Guardar cambios"}
            </Button>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
