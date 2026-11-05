"use client";
import { Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AiPromo() {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-8 rounded-2xl border bg-card p-8 md:grid-cols-2 md:p-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"><Sparkles className="h-4 w-4" /> AI powered</span>
            <h2 className="mt-4 text-3xl font-bold">Describe your ideal home. We&apos;ll find it.</h2>
            <p className="mt-3 text-muted-foreground">Type something like “pet-friendly 2 bed in Seattle under $3,000” in the search bar, or ask our assistant how renting and payments work.</p>
            <Button className="mt-6" onClick={() => window.dispatchEvent(new Event("open-ai-chat"))}><Bot className="mr-2 h-4 w-4" /> Ask the assistant</Button>
          </div>
          <ul className="space-y-3 text-sm">
            {["Natural-language smart search", "Live search suggestions as you type", "Assistant that recommends real listings", "Instant answers about requests and payments"].map((t) => (
              <li key={t} className="flex items-center gap-3 rounded-lg border bg-background p-4"><Sparkles className="h-4 w-4 text-primary" />{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}