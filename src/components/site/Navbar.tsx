import { Menu, Plane, User, Globe, Heart, LogIn, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavbarProps {
  onReset?: () => void;
}

export function Navbar({ onReset }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={onReset}
          className="group flex items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="Inicio Che Renda T&T"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
            <Plane className="h-4 w-4 -rotate-45" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold text-foreground">
              Che Renda
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
              Tour & Travel
            </span>
          </span>
        </button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="h-11 gap-2 rounded-full border-border/60 px-3 shadow-sm hover:shadow-md"
            >
              <Menu className="h-4 w-4" />
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background">
                <User className="h-4 w-4" />
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="font-display text-2xl">Menú</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1">
              {[
                { icon: LogIn, label: "Iniciar sesión" },
                { icon: User, label: "Registrarse" },
                { icon: Heart, label: "Mis favoritos" },
                { icon: Home, label: "Publica tu propiedad" },
                { icon: Globe, label: "Ayuda y soporte" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  {item.label}
                </button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
