import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Restablecer contraseña — Che Renda T&T" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const valid = password.length >= 6 && password === confirm;

  const submit = async () => {
    if (!valid) return;
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("¡Contraseña actualizada!");
    navigate({ to: "/" });
  };

  return (
    <SiteShell>
      <div className="mx-auto max-w-md space-y-5 rounded-3xl border border-border/60 bg-card p-8 shadow-sm">
        <div>
          <h1 className="font-display text-2xl font-bold">Nueva contraseña</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresá una nueva contraseña para tu cuenta.
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pass">Contraseña</Label>
          <Input
            id="pass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mín. 6 caracteres"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm">Repetir contraseña</Label>
          <Input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {confirm && password !== confirm && (
            <span className="text-xs text-destructive">Las contraseñas no coinciden</span>
          )}
        </div>
        <Button
          onClick={submit}
          disabled={!valid || busy}
          className="h-11 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {busy ? "Guardando…" : "Guardar contraseña"}
        </Button>
      </div>
    </SiteShell>
  );
}
