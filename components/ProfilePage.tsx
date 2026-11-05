"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileService } from "@/service/profile.service";
import { User } from "@/types/user";

const schema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirm: z.string().optional(),
  })
  .superRefine((d, ctx) => {
    if (!d.newPassword) return;
    if (d.newPassword.length < 6) ctx.addIssue({ code: "custom", path: ["newPassword"], message: "At least 6 characters" });
    if (!d.currentPassword) ctx.addIssue({ code: "custom", path: ["currentPassword"], message: "Enter your current password" });
    if (d.newPassword !== d.confirm) ctx.addIssue({ code: "custom", path: ["confirm"], message: "Passwords do not match" });
  });

const initials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

export default function ProfilePage({ user }: { user: User }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: user.name, currentPassword: "", newPassword: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => { setSaved(false); setForm((f) => ({ ...f, [k]: e.target.value })); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { const k = String(i.path[0]); if (!fe[k]) fe[k] = i.message; });
      return setErrors(fe);
    }
    setSaving(true);
    try {
      await profileService.update({
        name: parsed.data.name,
        ...(parsed.data.newPassword ? { currentPassword: parsed.data.currentPassword, newPassword: parsed.data.newPassword } : {}),
      });
      toast.success("Profile updated");
      setSaved(true);
      setForm((f) => ({ ...f, currentPassword: "", newPassword: "", confirm: "" }));
      router.refresh();
    } catch (err) {
      const raw = err instanceof Error ? err.message : "";
      let msg = "Could not update profile";
      try { msg = JSON.parse(raw.slice(raw.indexOf("{"))).message ?? msg; } catch {}
      toast.error(msg);
    } finally { setSaving(false); }
  };

  const field = (id: keyof typeof form, label: string, type = "text") => (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={form[id]} onChange={set(id)} aria-invalid={!!errors[id]} />
      {errors[id] && <p className="text-sm text-destructive">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="container mx-auto max-w-3xl space-y-6 py-10">
      <Card>
        <CardContent className="flex flex-col items-center gap-5 sm:flex-row">
          <Avatar className="h-20 w-20"><AvatarFallback className="text-2xl font-bold">{initials(user.name)}</AvatarFallback></Avatar>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="mt-3 flex justify-center gap-2 sm:justify-start">
              <Badge>{user.role}</Badge>
              <Badge variant={user.isBanned ? "destructive" : "secondary"}>{user.isBanned ? "Banned" : "Active"}</Badge>
              {user.createdAt && <Badge variant="outline">Member since {new Date(user.createdAt).toLocaleDateString()}</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Edit profile</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-5" noValidate>
            {field("name", "Full name")}
            <div className="space-y-1.5"><Label>Email</Label><Input value={user.email} disabled /></div>
            <p className="pt-2 text-sm font-medium">Change password (optional)</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {field("currentPassword", "Current password", "password")}
              {field("newPassword", "New password", "password")}
              {field("confirm", "Confirm new password", "password")}
            </div>
            <div className="flex items-center justify-end gap-3">
              {saved && <span className="flex items-center gap-1 text-sm text-primary"><CheckCircle2 className="h-4 w-4" /> Saved</span>}
              <Button type="submit" disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}