"use client";
import { useActionState, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginAction } from "../_actions/LoginActions";
import GoogleButton from "./GoogleButton";

const DEMO_PASSWORD = "Demo@1234"; // matches prisma/seed.ts
const demos = [
  { label: "Tenant", email: "tenant@rentnest.com" },
  { label: "Landlord", email: "landlord@rentnest.com" },
  { label: "Admin", email: "admin@rentnest.com" },
];

const LoginForm = () => {
  const [state, action, pending] = useActionState(LoginAction, false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.message || "User Logged in Successfully");
    if (!state.success && !state.errors) toast.error(state.message || "Login failed");
  }, [state]);

  return (
    <form action={action}>
      <Card className="w-full max-w-md space-y-3 p-6">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Try a demo account</p>
          <div className="grid grid-cols-3 gap-2">
            {demos.map((d) => (
              <Button key={d.label} type="button" variant="outline" size="sm"
                onClick={() => { setEmail(d.email); setPassword(DEMO_PASSWORD); }}>
                {d.label}
              </Button>
            ))}
          </div>
        </div>

        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" value={email}
          onChange={(e) => setEmail(e.target.value)} aria-invalid={!!state?.errors?.email} />
        {state?.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}

        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" placeholder="••••••••" value={password}
          onChange={(e) => setPassword(e.target.value)} aria-invalid={!!state?.errors?.password} />
        {state?.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}

        <Button type="submit" disabled={pending} className="w-full">
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {pending ? "Signing in..." : "Sign in"}
        </Button>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" />
        </div>
        <GoogleButton />
      </Card>
    </form>
  );
};

export default LoginForm;