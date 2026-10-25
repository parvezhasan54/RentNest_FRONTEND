"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/service/client";
import { contactSchema } from "@/validations/contact";


const empty = { name: "", email: "", subject: "", message: "" };

function readMessage(err: unknown) {
  const text = err instanceof Error ? err.message : "";
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (parsed?.message) return String(parsed.message);
    } catch {}
  }
  return "Could not send your message. Please try again.";
}

export default function ContactForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      await apiClient("/contact", { method: "POST", body: JSON.stringify(parsed.data) });
      toast.success("Message sent. We'll reply by email.");
      setValues(empty);
      setSent(true);
    } catch (err) {
      toast.error(readMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-primary" />
        <h3 className="text-xl font-semibold">Thanks, your message is in</h3>
        <p>We'll get back to you at the email you provided.</p>
        <Button variant="outline" onClick={() => setSent(false)}>Send another message</Button>
      </div>
    );
  }

  const fields: Array<{ key: keyof typeof empty; label: string; type?: string }> = [
    { key: "name", label: "Your name" },
    { key: "email", label: "Email", type: "email" },
    { key: "subject", label: "Subject" },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {fields.map(({ key, label, type }) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{label}</Label>
          <Input id={key} type={type} value={values[key]} onChange={set(key)} aria-invalid={Boolean(errors[key])} className="h-11" />
          {errors[key] && <p className="text-sm text-destructive">{errors[key]}</p>}
        </div>
      ))}
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={6} value={values.message} onChange={set("message")} aria-invalid={Boolean(errors.message)} />
        {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
      </div>
      <Button type="submit" disabled={submitting} className="h-11 w-full">
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitting ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}