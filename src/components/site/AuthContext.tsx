import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Lang = "es" | "en" | "pt" | "de" | "nds" | "it" | "fr";

interface AuthCtx {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  userInitial: string;
  loading: boolean;
  signOut: () => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("es");
  const [darkMode, setDark] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDark((d) => {
      const next = !d;
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next);
      }
      return next;
    });
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const isAuthenticated = !!user;
  const userInitial = (
    (user?.user_metadata?.full_name as string | undefined)?.trim()[0] ||
    user?.email?.trim()[0] ||
    "A"
  ).toUpperCase();

  return (
    <Ctx.Provider
      value={{
        session,
        user,
        isAuthenticated,
        userInitial,
        loading,
        signOut,
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
