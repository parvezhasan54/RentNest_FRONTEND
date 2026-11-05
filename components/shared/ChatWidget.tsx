"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, Loader2, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aiService, ChatMsg } from "@/service/ai.service";

const starters = ["Find me a 2-bed under $2,500", "How do I pay my rent?", "What does ACTIVE status mean?"];

// turn "/properties/<uuid>" in replies into real links
const render = (text: string) =>
  text.split(/(\/properties\/[0-9a-f-]{36})/g).map((part, i) =>
    part.startsWith("/properties/") ? (
      <Link key={i} href={part} className="font-medium text-primary underline">View listing</Link>
    ) : <span key={i}>{part}</span>
  );

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { role: "assistant", content: "Hi! I can help you find a home or explain how requests and payments work. What do you need?" },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener("open-ai-chat", openIt);
    return () => window.removeEventListener("open-ai-chat", openIt);
  }, []);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    const next = [...msgs, { role: "user" as const, content }];
    setMsgs(next); setInput(""); setBusy(true);
    try {
      const res = await aiService.chat(next.slice(-10));
      setMsgs([...next, { role: "assistant", content: res.data.reply }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: "Sorry, I couldn't answer that right now. Please try again or use the Contact page." }]);
    } finally { setBusy(false); }
  };

  const onSubmit = (e: FormEvent) => { e.preventDefault(); send(input); };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[28rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl">
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <span className="flex items-center gap-2 font-semibold"><Bot className="h-5 w-5" /> RentNest Assistant</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat"><X className="h-5 w-5" /></button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : ""}`}>
                <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                  {m.role === "assistant" ? render(m.content) : m.content}
                </div>
              </div>
            ))}
            {busy && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Thinking...</div>}
            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {starters.map((s) => <button key={s} onClick={() => send(s)} className="rounded-full border px-3 py-1 text-xs hover:bg-accent">{s}</button>)}
              </div>
            )}
            <div ref={end} />
          </div>
          <form onSubmit={onSubmit} className="flex gap-2 border-t p-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} maxLength={500} placeholder="Ask anything..."
              className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            <Button type="submit" size="icon" disabled={busy || !input.trim()} aria-label="Send"><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)} aria-label="Open AI assistant"
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105">
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>
    </>
  );
}