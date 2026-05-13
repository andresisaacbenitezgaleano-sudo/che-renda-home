import { Facebook, Instagram, Twitter, Globe, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const languages = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "de", label: "Deutsch (Hochdeutsch)", flag: "🇩🇪" },
  { code: "nds", label: "Plattdeutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

const knowledge = [
  {
    title: "Política de cancelación",
    desc: "Conoce las opciones flexibles para modificar o cancelar tu reserva.",
  },
  {
    title: "Normas de la casa",
    desc: "Reglas básicas que ayudan a una estadía respetuosa y segura.",
  },
  {
    title: "Seguridad y propiedad",
    desc: "Cómo protegemos a viajeros y anfitriones en cada reserva.",
  },
];

const navColumns = [
  {
    title: "Ayuda",
    items: ["Centro de ayuda", "Te escuchamos", "Cancelación"],
  },
  {
    title: "Cómo ser anfitrión",
    items: ["Publicar anuncios", "Recursos del anfitrión", "Comunidad"],
  },
  {
    title: "Marca / Che Renda T&T",
    items: ["Sobre nosotros", "Ayúdanos a crecer", "Prensa"],
  },
];

export function Footer() {
  const [lang, setLang] = useState(languages[0]);

  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Top: Para Su Conocimiento */}
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Para su conocimiento
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {knowledge.map((k) => (
              <button
                key={k.title}
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

        {/* Middle: navigation */}
        <div className="mt-12 grid gap-8 border-t border-border pt-10 md:grid-cols-3">
          {navColumns.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-base font-bold text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {col.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom: legal */}
        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span>© 2024 Che Renda Tour and Travel</span>
            <span className="hidden md:inline">·</span>
            <a
              href="/privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              Privacidad
            </a>
            <span>·</span>
            <a
              href="/terminos"
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
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => setLang(l)}
                    className="gap-2"
                  >
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
    </footer>
  );
}
