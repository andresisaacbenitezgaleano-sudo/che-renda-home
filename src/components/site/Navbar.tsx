import { useState } from "react";
import {
  Menu,
  Plane,
  User,
  Globe,
  HelpCircle,
  Home,
  LogOut,
  FileText,
  History,
  MessageSquare,
  UserCircle,
  Settings,
  Megaphone,
  Moon,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useAuth, LANGUAGES } from "./AuthContext";

interface NavbarProps {
  onReset?: () => void;
}

export function Navbar({ onReset }: NavbarProps) {
  const {
    isAuthenticated,
    userInitial,
    openAuthModal,
    signOut,
    lang,
    setLang,
    darkMode,
    toggleDarkMode,
  } = useAuth();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"main" | "lang">("main");
  const [confirmLogout, setConfirmLogout] = useState(false);

  const close = () => {
    setOpen(false);
    setView("main");
  };

  const triggerAuth = () => {
    close();
    openAuthModal();
  };

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

        <Popover
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) setView("main");
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-11 gap-2 rounded-full border-border/60 px-3 shadow-sm hover:shadow-md"
            >
              <Menu className="h-4 w-4" />
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background">
                {isAuthenticated ? (
                  <span className="text-xs font-bold">{userInitial}</span>
                ) : (
                  <User className="h-4 w-4" />
                )}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={10}
            className="w-72 overflow-hidden rounded-2xl p-0 shadow-xl"
          >
            {view === "lang" ? (
              <LangPanel
                lang={lang}
                setLang={setLang}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                onBack={() => setView("main")}
              />
            ) : isAuthenticated ? (
              <AuthedMenu
                onNavigate={close}
                onLangs={() => setView("lang")}
                onLogout={() => {
                  setOpen(false);
                  setConfirmLogout(true);
                }}
              />
            ) : (
              <GuestMenu
                onLangs={() => setView("lang")}
                onAuth={triggerAuth}
                onClose={close}
              />
            )}
          </PopoverContent>
        </Popover>
      </div>

      <AlertDialog open={confirmLogout} onOpenChange={setConfirmLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas cerrar sesión?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                signOut();
                setConfirmLogout(false);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Sí, cerrar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  to,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  to?: string;
  highlight?: boolean;
}) {
  const cls = `flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-accent ${
    highlight ? "text-destructive" : "text-foreground"
  }`;
  if (to) {
    return (
      <a href={to} className={cls} onClick={onClick}>
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cls}>
      <Icon className="h-4 w-4 text-muted-foreground" />
      {label}
    </button>
  );
}

function GuestMenu({
  onLangs,
  onAuth,
  onClose,
}: {
  onLangs: () => void;
  onAuth: () => void;
  onClose: () => void;
}) {
  return (
    <div className="py-2">
      <MenuItem icon={Globe} label="Idioma y modo oscuro" onClick={onLangs} />
      <MenuItem
        icon={HelpCircle}
        label="Centro de ayuda"
        onClick={onClose}
      />
      <MenuItem
        icon={Home}
        label="Publicá en Che Renda"
        onClick={onAuth}
      />
      <div className="mt-2 border-t border-border/60 px-3 pb-3 pt-3">
        <Button
          onClick={onAuth}
          className="h-10 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          Iniciá sesión o registrate
        </Button>
      </div>
    </div>
  );
}

function AuthedMenu({
  onNavigate,
  onLangs,
  onLogout,
}: {
  onNavigate: () => void;
  onLangs: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="py-2">
      <MenuItem icon={Home} label="Publicar Che Renda" to="/publicar" onClick={onNavigate} />
      <MenuItem icon={FileText} label="Mis Publicaciones" to="/mis-propiedades" onClick={onNavigate} />
      <MenuItem icon={History} label="Historial" to="/historial" onClick={onNavigate} />
      <MenuItem icon={MessageSquare} label="Mensajes internos" to="/mensajes" onClick={onNavigate} />
      <MenuItem icon={UserCircle} label="Perfil" to="/perfil" onClick={onNavigate} />
      <MenuItem icon={Settings} label="Configuración de la cuenta" to="/configuracion" onClick={onNavigate} />
      <div className="my-1 border-t border-border/60" />
      <MenuItem icon={Globe} label="Idioma y modo oscuro" onClick={onLangs} />
      <MenuItem icon={Megaphone} label="Te escuchamos" to="/te-escuchamos" onClick={onNavigate} />
      <div className="my-1 border-t border-border/60" />
      <MenuItem icon={LogOut} label="Cerrar sesión" onClick={onLogout} highlight />
    </div>
  );
}

function LangPanel({
  lang,
  setLang,
  darkMode,
  toggleDarkMode,
  onBack,
}: {
  lang: string;
  setLang: (l: any) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onBack: () => void;
}) {
  return (
    <div className="py-2">
      <button
        onClick={onBack}
        className="mb-1 flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> Volver
      </button>

      <div className="flex items-center justify-between gap-3 border-y border-border/60 bg-muted/30 px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Moon className="h-4 w-4 text-muted-foreground" />
          Modo oscuro
        </span>
        <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
      </div>

      <div className="px-2 py-2">
        <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Idioma
        </p>
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent ${
              lang === l.code ? "font-semibold text-primary" : "text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden>{l.flag}</span>
              {l.label}
            </span>
            {lang === l.code && <span className="text-xs">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
