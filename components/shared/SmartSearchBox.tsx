"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Loader2, MapPin, Search, Sparkles } from "lucide-react";
import { aiService } from "@/service/ai.service";

type Suggestion = { type: "city" | "property"; label: string; value: string };

export default function SmartSearchBox({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (q.trim().length < 2) { setItems([]); return; }
    const t = setTimeout(async () => {
      try { setItems((await aiService.suggest(q.trim())).data ?? []); setOpen(true); }
      catch { setItems([]); }
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const go = (params: Record<string, string>) => {
    const p = new URLSearchParams(params);
    setOpen(false);
    router.push(`/properties${p.toString() ? `?${p}` : ""}`);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const text = q.trim();
    if (!text) return go({});
    setBusy(true);
    try { go((await aiService.parseSearch(text)).data ?? { q: text }); }
    catch { go({ q: text }); }
    finally { setBusy(false); }
  };

  return (
    <div ref={box} className="relative w-full">
      <form onSubmit={submit} className={`flex items-center gap-2 rounded-xl border bg-card p-1.5 shadow-sm ${compact ? "" : "p-2 shadow-xl"}`}>
        <Search className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => items.length && setOpen(true)}
          placeholder={compact ? "Search homes..." : "Try “2 bed apartment in Austin under $2,500”"}
          className={`min-w-0 flex-1 bg-transparent px-1 text-foreground outline-none placeholder:text-muted-foreground ${compact ? "h-8 text-sm" : "h-12"}`}
        />
        <button
          type="submit" disabled={busy}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 font-medium text-primary-foreground disabled:opacity-60 ${compact ? "h-8 text-xs" : "h-12 px-5 text-sm"}`}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {compact ? "" : "Smart search"}
        </button>
      </form>

      {open && items.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg">
          {items.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => { setOpen(false); s.type === "property" ? router.push(`/properties/${s.value}`) : go({ city: s.value }); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-accent"
              >
                {s.type === "city" ? <MapPin className="h-4 w-4 text-primary" /> : <Building2 className="h-4 w-4 text-primary" />}
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}