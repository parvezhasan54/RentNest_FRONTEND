"use server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { setAuthCookies } from "@/lib/authCookies";

export async function GoogleLoginAction(credential: string, role?: "TENANT" | "LANDLORD") {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential, role }),
    cache: "no-store",
  });
  const result = await res.json();
  if (!result.success) return { success: false as const, message: result.message as string };

  await setAuthCookies(result.data.accessToken, result.data.refreshToken);
  const decoded = jwt.decode(result.data.accessToken) as JwtPayload;
  return { success: true as const, role: String(decoded?.role ?? "tenant").toLowerCase() };
}