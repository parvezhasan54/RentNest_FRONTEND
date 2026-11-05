"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/service/updateProfile";

export default function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, action, pending] = useActionState(updateProfile, null);

  return (
    <form action={action} className="mt-8 space-y-4 rounded-xl border p-5">
      <h3 className="text-lg font-semibold">Edit your details</h3>
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" defaultValue={name} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} disabled readOnly />
      </div>

      {state && (
        <p role={state.success ? "status" : "alert"}
          className={`flex items-center gap-2 text-sm ${state.success ? "text-primary" : "text-destructive"}`}>
          {state.success && <CheckCircle2 className="h-4 w-4" />} {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {pending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}