import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { User, History, Settings, MessageSquare, Megaphone, Home as HomeIcon } from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AuthProvider } from "./AuthContext";
import { AuthModal } from "./AuthModal";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <AuthModal />
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

const NAV = [
  { to: "/perfil", label: "Sobre mí", icon: User },
  { to: "/historial", label: "Historial", icon: History },
  { to: "/mensajes", label: "Mensajes", icon: MessageSquare },
  { to: "/configuracion", label: "Configuración", icon: Settings },
  { to: "/te-escuchamos", label: "Te escuchamos", icon: Megaphone },
  { to: "/", label: "Inicio", icon: HomeIcon },
] as const;

export function SideNav() {
  return (
    <aside className="md:sticky md:top-24 md:self-start">
      <nav className="flex flex-col gap-1 rounded-2xl border border-border/60 bg-card p-3 shadow-sm">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-accent text-foreground font-semibold" }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
