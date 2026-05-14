import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Globe, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

type ModalKey =
  | "cancelacion"
  | "normas"
  | "seguridad"
  | "ayuda"
  | "comunidad"
  | "sobre"
  | "crecer"
  | null;

const MODAL_CONTENT: Record<Exclude<ModalKey, null>, { title: string; body: string }> = {
  cancelacion: {
    title: "Política de cancelación",
    body: "Las reservas en Che Renda T&T pueden cancelarse sin costo dentro de las 48 horas posteriores a la confirmación, siempre que la fecha de check-in sea posterior a 7 días. Pasado ese plazo, se aplicarán las condiciones específicas del anfitrión publicadas en cada anuncio. En caso de fuerza mayor (clima extremo, emergencias sanitarias) acompañamos al huésped con reembolso total o reprogramación.",
  },
  normas: {
    title: "Normas de la casa",
    body: "Se espera que cada huésped respete las normas básicas de convivencia: cuidar las instalaciones, evitar ruidos molestos en horarios de descanso, no exceder la cantidad de personas declaradas en la reserva y dejar la propiedad en condiciones razonables al check-out. Cada anfitrión puede agregar normas particulares (mascotas, fumar, eventos) que se muestran en el anuncio.",
  },
  seguridad: {
    title: "Seguridad y propiedad",
    body: "Verificamos la identidad de huéspedes y anfitriones, monitoreamos transacciones sospechosas y ofrecemos un canal directo de soporte 24/7. Recomendamos siempre comunicarse y pagar dentro de la plataforma para acceder a nuestra protección y al respaldo de Che Renda T&T en caso de inconvenientes.",
  },
  ayuda: {
    title: "Centro de ayuda",
    body: "Encontrá respuestas a las dudas más frecuentes sobre reservas, pagos, modificaciones y contacto con anfitriones. Si necesitás soporte personalizado, escribinos desde la sección 'Te escuchamos' y te responderemos a la brevedad.",
  },
  comunidad: {
    title: "Comunidad Che Renda",
    body: "Somos una comunidad de viajeros y anfitriones paraguayos que comparten experiencias auténticas. Sumate a nuestros encuentros, capacitaciones y newsletters para conocer destinos, novedades y consejos para aprovechar al máximo cada estadía.",
  },
  sobre: {
    title: "Sobre Che Renda T&T",
    body: "Che Renda Tour and Travel es una plataforma paraguaya de alquileres vacacionales y experiencias turísticas. Conectamos anfitriones locales con viajeros que buscan vivir el Paraguay desde una perspectiva genuina, segura y cómoda.",
  },
  crecer: {
    title: "Ayúdanos a crecer",
    body: "Tu opinión nos hace mejores. Compartí Che Renda con tu familia y amigos, dejá reseñas honestas a los anfitriones y enviá sugerencias desde 'Te escuchamos'. Cada aporte ayuda a fortalecer el turismo paraguayo.",
  },
};

const knowledge: { title: string; desc: string; key: Exclude<ModalKey, null> }[] = [
  { title: "Política de cancelación", desc: "Conoce las opciones flexibles para modificar o cancelar tu reserva.", key: "cancelacion" },
  { title: "Normas de la casa", desc: "Reglas básicas que ayudan a una estadía respetuosa y segura.", key: "normas" },
  { title: "Seguridad y propiedad", desc: "Cómo protegemos a viajeros y anfitriones en cada reserva.", key: "seguridad" },
];

export function Footer() {
  const [lang, setLang] = useState(languages[0]);
  const [modal, setModal] = useState<ModalKey>(null);

  const open = (k: Exclude<ModalKey, null>) => setModal(k);
  const close = () => setModal(null);

  return (
    <footer className="mt-auto border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Para Su Conocimiento */}
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Para su conocimiento
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {knowledge.map((k) => (
              <button
                key={k.key}
                onClick={() => open(k.key)}
                className="group rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
              >
                <div className="font-semibold text-foreground group-hover:text-primary">
                  {k.title}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{k.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 grid gap-8 border-t border-border pt-10 md:grid-cols-2">
          <div>
            <h3 className="font-display text-base font-bold text-foreground">Ayuda</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <button
                  onClick={() => open("ayuda")}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Centro de ayuda
                </button>
              </li>
              <li>
                <Link
                  to="/te-escuchamos"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Te escuchamos
                </Link>
              </li>
              <li>
                <button
                  onClick={() => open("cancelacion")}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Cancelación
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-bold text-foreground">
              Che Renda T&T
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <button
                  onClick={() => open("sobre")}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Sobre nosotros
                </button>
              </li>
              <li>
                <button
                  onClick={() => open("crecer")}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Ayúdanos a crecer
                </button>
              </li>
              <li>
                <button
                  onClick={() => open("comunidad")}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Comunidad
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span>© 2026 Che Renda Tour and Travel</span>
            <span className="hidden md:inline">·</span>
            <a
              href="/politica-de-privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              Política de Privacidad
            </a>
            <span>·</span>
            <a
              href="/terminos-y-condiciones"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              Términos y Condiciones
            </a>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent">
                <Globe className="h-3.5 w-3.5" />
                <span>
                  {lang.flag} {lang.label}
                </span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((l) => (
                  <DropdownMenuItem key={l.code} onClick={() => setLang(l)} className="gap-2">
                    <span className="text-base">{l.flag}</span>
                    {l.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-1">
              {[
                { Icon: Twitter, label: "X" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Instagram, label: "Instagram" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={modal !== null} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-w-lg">
          {modal && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">
                  {MODAL_CONTENT[modal].title}
                </DialogTitle>
                <DialogDescription className="pt-2 text-sm leading-relaxed text-foreground/80">
                  {MODAL_CONTENT[modal].body}
                </DialogDescription>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </footer>
  );
}
