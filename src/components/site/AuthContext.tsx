import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type Lang = "es" | "en" | "pt" | "de" | "nds" | "it" | "fr";

interface AuthCtx {
  isAuthenticated: boolean;
  userInitial: string;
  login: (id: string) => void;
  logout: () => void;
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuth] = useState(false);
  const [userInitial, setInitial] = useState("A");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("es");
  const [darkMode, setDark] = useState(false);

  const toggleDarkMode = useCallback(() => {
    setDark((d) => {
      const next = !d;
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next);
      }
      return next;
    });
  }, []);

  const login = useCallback((id: string) => {
    setInitial((id.trim()[0] || "A").toUpperCase());
    setAuth(true);
    setAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => setAuth(false), []);

  return (
    <Ctx.Provider
      value={{
        isAuthenticated,
        userInitial,
        login,
        logout,
        authModalOpen,
        openAuthModal: () => setAuthModalOpen(true),
        closeAuthModal: () => setAuthModalOpen(false),
        lang,
        setLang,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "de", label: "Deutsch (Hochdeutsch)", flag: "🇩🇪" },
  { code: "nds", label: "Plattdeutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];
