import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell, SideNav } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Perfil — Che Renda T&T" }] }),
  component: PerfilPage,
});

function PerfilPage() {
  const [email, setEmail] = useState("andres.isaac@example.com");
  const [phone, setPhone] = useState("+595 981 000 000");
  const [bio, setBio] = useState("Viajero curioso, amante de los atardeceres y la buena gastronomía.");
  const name = "Andres Isaac";

  return (
    <SiteShell>
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <SideNav />
        <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-brand text-4xl font-bold text-primary-foreground shadow-lg">
              {name[0]}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-display text-2xl font-bold text-foreground">{name}</h1>
              <p className="text-sm text-muted-foreground">Miembro desde mayo de 2024</p>
              <Badge className="mt-2 bg-primary/10 text-primary hover:bg-primary/15">Huésped</Badge>
            </div>
          </div>

          <div className="mt-8 grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Sobre mí</Label>
              <Textarea id="bio" rows={5} value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto sm:self-end"
              onClick={() => toast.success("Cambios guardados")}
            >
              Guardar cambios
            </Button>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
