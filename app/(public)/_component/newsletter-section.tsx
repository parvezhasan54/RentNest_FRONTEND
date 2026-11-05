"use client";
import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/service/client";

const schema = z.string().min(1, "Email is required").email("Enter a valid email");

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(email.trim());
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    setError(""); setLoading(true);
    try {
      await apiClient("/newsletter", { method: "POST", body: JSON.stringify({ email: parsed.data }) });
      setDone(true); toast.success("You're subscribed!");
    } catch { toast.error("Could not subscribe. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-3xl font-bold">Get new listings in your inbox</h2>
        <p className="mt-2 text-muted-foreground">One short email with fresh homes and renting tips. Unsubscribe anytime.</p>
        {done ? (
          <p className="mt-8 inline-flex items-center gap-2 font-medium text-primary"><CheckCircle2 className="h-5 w-5" /> Thanks, you&apos;re on the list.</p>
        ) : (
          <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row" noValidate>
            <div className="flex-1 text-left">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-invalid={!!error} className="h-11" />
              {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
            </div>
            <Button type="submit" disabled={loading} className="h-11">{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Subscribe</Button>
          </form>
        )}
      </div>
    </section>
  );
}