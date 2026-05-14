import type { ReactNode } from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, User, History, Settings, MessageSquare, Megaphone, Home as HomeIcon } from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Button } from "@/components/ui/button";

export function SiteShell({ children, hideBack = false }: { children: ReactNode; hideBack?: boolean }) {
  const navigate = useNavigate();
  const router = useRouter();
  const showBack = !hideBack && router.state.location.pathname !== "/";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {showBack && (
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  navigate({ to: ".." as any });
                  window.history.back();
                } else {
                  navigate({ to: "/" });
                }
              }}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver atrás
            </Button>
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}

const NAV = [
  { to: "/perfil", label: "Sobre mí", icon: User },
  { to: "/historial", label: "Historial", icon: History },
  { to: "/mensajes", label: "Mensajes", icon: MessageSquare },
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
