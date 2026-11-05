"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { GoogleLoginAction } from "../_actions/GoogleAction";

type GoogleId = {
  initialize: (o: { client_id: string; callback: (r: { credential: string }) => void }) => void;
  renderButton: (el: HTMLElement, o: Record<string, unknown>) => void;
};
declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

export default function GoogleSignIn() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const btnRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready || !clientId || !btnRef.current || !window.google) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (resp) => {
        const res = await GoogleLoginAction(resp.credential);
        if (res && !res.success) toast.error(res.message);
      },
    });
    window.google.accounts.id.renderButton(btnRef.current, {
      theme: "outline", size: "large", width: 340, text: "continue_with",
    });
  }, [ready, clientId]);

  if (!clientId) {
    return (
      <Button type="button" variant="outline" className="h-11 w-full"
        onClick={() => toast.error("Google sign-in isn't configured yet.")}>
        Continue with Google
      </Button>
    );
  }

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={() => setReady(true)} />
      <div ref={btnRef} className="flex min-h-11 justify-center" />
    </>
  );
}