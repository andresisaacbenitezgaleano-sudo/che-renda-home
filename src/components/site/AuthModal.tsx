import { useState } from "react";
import { Plane, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "./AuthContext";

export function AuthModal() {
  const { authModalOpen, closeAuthModal, login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const canContinue =
    acceptPrivacy && acceptTerms && identifier.trim().length > 2;

  const handleContinue = () => {
    if (!canContinue) return;
    login(identifier);
    setIdentifier("");
    setAcceptPrivacy(false);
    setAcceptTerms(false);
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
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
            <Plane className="h-5 w-5 -rotate-45" />
          </span>
          <h2 className="mt-3 font-display text-xl font-bold text-foreground">
            Iniciá sesión o registrate
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Bienvenido a Che Renda Tour & Travel
          </p>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="space-y-1.5">
            <label htmlFor="auth-id" className="text-xs font-semibold text-foreground">
              Teléfono o correo electrónico
            </label>
            <Input
              id="auth-id"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="+54 11 1234 5678  ó  vos@email.com"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-3 rounded-xl bg-muted/40 p-3">
            <label className="flex items-start gap-3 text-xs leading-snug text-foreground">
              <Checkbox
                checked={acceptPrivacy}
                onCheckedChange={(v) => setAcceptPrivacy(v === true)}
                className="mt-0.5"
              />
              <span>
                Acepto de forma expresa e informada que Che Renda T&T trate mis
                datos personales según la{" "}
                <a
                  href="/privacidad"
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
                  href="/terminos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  Términos y Condiciones
                </a>{" "}
                de Uso de Che Renda T&T.
              </span>
            </label>
          </div>

          <Button
            disabled={!canContinue}
            onClick={handleContinue}
            className="h-11 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-md hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continuar
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">o</span>
            <Separator className="flex-1" />
          </div>

          <Button
            variant="outline"
            className="h-11 w-full gap-3 rounded-xl border-border/70 text-sm font-semibold"
            onClick={() => login("Google")}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.1A6.97 6.97 0 0 1 5.46 12c0-.73.13-1.44.36-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
            </svg>
            Continuar con Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
