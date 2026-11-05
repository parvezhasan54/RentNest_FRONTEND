
import { apiClient } from "./client";
export const profileService = {
  update: (data: { name?: string; currentPassword?: string; newPassword?: string }) =>
    apiClient("/auth/me", { method: "PATCH", body: JSON.stringify(data) }),
};