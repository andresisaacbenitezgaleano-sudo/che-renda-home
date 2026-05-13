import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Paperclip } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/site/AuthContext";

type PqrsType = "peticion" | "queja" | "reclamo" | "sugerencia";

export const Route = createFileRoute("/te-escuchamos")({
  head: () => ({ meta: [{ title: "Te escuchamos — Che Renda T&T" }] }),
  component: PqrsPage,
});

function PqrsPage() {
  const { user, openAuthModal } = useAuth();
  const [tipo, setTipo] = useState<PqrsType | "">("");
  const [asunto, setAsunto] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal();
      return;
    }
    if (!tipo || !asunto.trim() || !desc.trim()) {
      toast.error("Completá los campos obligatorios");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("pqrs_claims").insert({
      user_id: user.id,
      type: tipo,
      subject: asunto.trim(),
      description: desc.trim(),
      attachments: files.map((f) => f.name),
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Reporte enviado. Te contactaremos pronto.");
    setTipo("");
    setAsunto("");
    setDesc("");
    setFiles([]);
  };

  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold">Te escuchamos</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Canal de Peticiones, Quejas, Reclamos y Sugerencias.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="space-y-5 rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-2">
            <Label>Tipo de solicitud *</Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v as PqrsType)}>
              <SelectTrigger><SelectValue placeholder="Seleccioná una opción" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="peticion">Petición</SelectItem>
                <SelectItem value="queja">Queja</SelectItem>
                <SelectItem value="reclamo">Reclamo</SelectItem>
                <SelectItem value="sugerencia">Sugerencia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="asunto">Asunto *</Label>
            <Input id="asunto" maxLength={120} value={asunto} onChange={(e) => setAsunto(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="desc">Descripción detallada *</Label>
            <Textarea id="desc" rows={6} maxLength={2000} value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>

          <div>
            <input
              id="evidencias"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            />
            <label htmlFor="evidencias">
              <Button type="button" variant="outline" asChild>
                <span className="cursor-pointer">
                  <Paperclip className="mr-2 h-4 w-4" />
                  Adjuntar evidencias
                </span>
              </Button>
            </label>
            {files.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                {files.length} archivo(s): {files.map((f) => f.name).join(", ")}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {busy ? "Enviando…" : "Enviar reporte"}
          </Button>
          {!user && (
            <p className="text-center text-xs text-muted-foreground">
              Necesitás iniciar sesión para enviar tu reporte.
            </p>
          )}
        </form>
      </div>
    </SiteShell>
  );
}
