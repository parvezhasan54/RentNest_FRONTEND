// app/(auth)/auth/_component/GoogleButton.tsx
"use client";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GoogleLoginAction } from "../_actions/GoogleAction";


export default function GoogleButton({ role }: { role?: "TENANT" | "LANDLORD" }) {
  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) return null;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex justify-center">
        <GoogleLogin
          width="320"
          onError={() => toast.error("Google sign-in failed")}
          onSuccess={async (r) => {
            if (!r.credential) return toast.error("Google sign-in failed");
            const res = await GoogleLoginAction(r.credential, role);
            if (res.success) {
              toast.success("Signed in with Google");
              router.push(`/dashboard/${res.role}`);
              router.refresh();
            } else toast.error(res.message ?? "Google sign-in failed");
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
}