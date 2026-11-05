"use server";

import { revalidatePath } from "next/cache";
import { serverApiClient } from "./server-client";

export async function updateProfile(_prev: unknown, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2 || name.length > 60) {
    return { success: false, message: "Name must be between 2 and 60 characters." };
  }
  try {
    await serverApiClient("/auth/me", { method: "PATCH", body: JSON.stringify({ name }) });
    revalidatePath("/", "layout");
    return { success: true, message: "Profile updated." };
  } catch {
    return { success: false, message: "Could not update your profile. Please try again." };
  }
}