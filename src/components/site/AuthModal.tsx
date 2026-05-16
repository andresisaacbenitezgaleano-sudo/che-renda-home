import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { Logo } from "./Logo";

type Mode = "signin" | "signup" | "forgot";

export function AuthModal() {
  const { authModalOpen, closeAuthModal } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [busy, setBusy] = useState(false);

  const validEmail = /^\S+@\S+\.\S+$/.test(email.trim());
  const canSignIn = validEmail && password.length >= 6;
  const canSignUp =
    canSignIn && acceptPrivacy && acceptTerms && fullName.trim().length > 1;

  const reset = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setAcceptPrivacy(false);
    setAcceptTerms(false);
  };

  const handleSignIn = async () => {
    if (!canSignIn) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("¡Bienvenido!");
    reset();
    closeAuthModal();
  };

  const handleSignUp = async () => {
    if (!canSignUp) return;
    setBusy(true);
    const redirect =
      typeof window !== "undefined" ? `${window.location.origin}/` : undefined;
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirect,
        data: {
          full_name: fullName.trim(),
          accepted_privacy: true,
          accepted_terms: true,
        },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Cuenta creada. ¡Bienvenido a Che Renda!");
    reset();
    closeAuthModal();
  };

  const handleForgot = async () => {
    if (!validEmail) {
      toast.error("Ingresá un email válido");
      return;
    }
    setBusy(true);
    const redirect =
      typeof window !== "undefined"
        ? `${window.location.origin}/reset-password`
        : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirect,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Te enviamos un enlace para restablecer tu contraseña.");
    setMode("signin");
  };

  return (
    <Dialog open={authModalOpen} onOpenChange={(o) => !o && closeAuthModal()}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0 [&>button]:hidden">
        <button
          onClick={closeAuthModal}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-muted/60 text-foreground transition-colors hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center border-b border-border/60 px-6 pb-5 pt-7 text-center">
          <Logo size={56} className="shadow-md" />
          <h2 className="mt-3 font-display text-xl font-bold text-foreground">
            {mode === "forgot" ? "Restablecer contraseña" : "Iniciá sesión o registrate"}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Bienvenido a Che Renda Tour & Travel
          </p>
        </div>

        <div className="px-6 py-5">
          {mode === "forgot" ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ingresá tu correo y te enviaremos un enlace para crear una nueva
                contraseña.
              </p>
              <Input
                type="email"
                placeholder="vos@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl"
              />
              <Button
                disabled={!validEmail || busy}
                onClick={handleForgot}
                className="h-11 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50"
              >
                Enviar enlace
              </Button>
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="block w-full text-center text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Volver a iniciar sesión
              </button>
            </div>
          ) : (
            <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Iniciar sesión</TabsTrigger>
                <TabsTrigger value="signup">Crear cuenta</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-4 space-y-4">
                <Input
                  type="email"
                  placeholder="vos@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl"
                />
                <Input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="block text-left text-xs font-semibold text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
                <Button
                  disabled={!canSignIn || busy}
                  onClick={handleSignIn}
                  className="h-11 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50"
                >
                  Continuar
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="mt-4 space-y-4">
                <Input
                  placeholder="Nombre completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 rounded-xl"
                />
                <Input
                  type="email"
                  placeholder="vos@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl"
                />
                <Input
                  type="password"
                  placeholder="Contraseña (mín. 6 caracteres)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl"
                />

                <div className="space-y-3 rounded-xl bg-muted/40 p-3">
                  <label className="flex items-start gap-3 text-xs leading-snug text-foreground">
                    <Checkbox
                      checked={acceptPrivacy}
                      onCheckedChange={(v) => setAcceptPrivacy(v === true)}
                      className="mt-0.5"
                    />
                    <span>
                      Acepto que Che Renda T&T trate mis datos según la{" "}
                      <a
                        href="/politica-de-privacidad"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary underline-offset-2 hover:underline"
                      >
                        Política de Privacidad
                      </a>
                      .
                    </span>
                  </label>
                  <label className="flex items-start gap-3 text-xs leading-snug text-foreground">
                    <Checkbox
                      checked={acceptTerms}
                      onCheckedChange={(v) => setAcceptTerms(v === true)}
                      className="mt-0.5"
                    />
                    <span>
                      He leído y acepto los{" "}
                      <a
                        href="/terminos-y-condiciones"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary underline-offset-2 hover:underline"
                      >
                        Términos y Condiciones
                      </a>{" "}
                      de Che Renda T&T.
                    </span>
                  </label>
                </div>

                <Button
                  disabled={!canSignUp || busy}
                  onClick={handleSignUp}
                  className="h-11 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50"
                >
                  Crear cuenta
                </Button>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
