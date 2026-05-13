import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mensajes")({
  head: () => ({ meta: [{ title: "Mensajes — Che Renda T&T" }] }),
  component: MensajesPage,
});

const CHATS = [
  { id: "c1", name: "Lucía Fernández", initial: "L", last: "¡Perfecto, te espero el viernes!", time: "10:24" },
  { id: "c2", name: "Marco Benítez", initial: "M", last: "El check-in es a partir de las 15:00.", time: "Ayer" },
  { id: "c3", name: "Sofía Aguilar", initial: "S", last: "Te paso la dirección por aquí.", time: "Lun" },
  { id: "c4", name: "Diego Ríos", initial: "D", last: "Gracias por la reserva 🙌", time: "12 may" },
];

type Msg = { id: number; text: string; mine: boolean; time: string };

const SEED: Record<string, Msg[]> = {
  c1: [
    { id: 1, text: "Hola Lucía, ¿la cabaña tiene wifi estable?", mine: true, time: "10:18" },
    { id: 2, text: "¡Hola! Sí, fibra óptica 300 megas.", mine: false, time: "10:20" },
    { id: 3, text: "Genial, confirmo la reserva entonces.", mine: true, time: "10:22" },
    { id: 4, text: "¡Perfecto, te espero el viernes!", mine: false, time: "10:24" },
  ],
  c2: [{ id: 1, text: "El check-in es a partir de las 15:00.", mine: false, time: "Ayer" }],
  c3: [{ id: 1, text: "Te paso la dirección por aquí.", mine: false, time: "Lun" }],
  c4: [{ id: 1, text: "Gracias por la reserva 🙌", mine: false, time: "12 may" }],
};

function MensajesPage() {
  const [active, setActive] = useState("c1");
  const [messages, setMessages] = useState<Record<string, Msg[]>>(SEED);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active, messages]);

  const send = () => {
    if (!draft.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((m) => ({
      ...m,
      [active]: [...(m[active] ?? []), { id: Date.now(), text: draft, mine: true, time: now }],
    }));
    setDraft("");
  };

  const activeChat = CHATS.find((c) => c.id === active)!;

  return (
    <SiteShell>
      <h1 className="mb-6 font-display text-3xl font-bold">Mensajes</h1>
      <div className="grid h-[70vh] gap-0 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm md:grid-cols-[300px_1fr]">
        <div className="border-b border-border/60 md:border-b-0 md:border-r">
          <div className="max-h-[30vh] overflow-y-auto md:max-h-full">
            {CHATS.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-border/40 px-4 py-3 text-left transition-colors hover:bg-accent",
                  active === c.id && "bg-accent",
                )}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                  {c.initial}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{c.last}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-0 flex-col">
          <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              {activeChat.initial}
            </span>
            <p className="font-semibold">{activeChat.name}</p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto bg-muted/30 p-4">
            {(messages[active] ?? []).map((m) => (
              <div key={m.id} className={cn("flex", m.mine ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                    m.mine
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-background text-foreground",
                  )}
                >
                  <p>{m.text}</p>
                  <p className={cn("mt-1 text-[10px]", m.mine ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {m.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex gap-2 border-t border-border/60 p-3"
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Escribí un mensaje…"
              className="flex-1"
            />
            <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </SiteShell>
  );
}
