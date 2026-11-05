
import { cookies } from "next/headers";

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const store = await cookies();
  const prod = process.env.NODE_ENV === "production";
  const base = { httpOnly: true, secure: prod, sameSite: (prod ? "none" : "lax") as "none" | "lax", path: "/" };
  store.set("accessToken", accessToken, { ...base, maxAge: 60 * 60 * 24 });
  store.set("refreshToken", refreshToken, { ...base, maxAge: 60 * 60 * 24 * 7 });
}