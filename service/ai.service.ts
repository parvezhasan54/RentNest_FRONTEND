import { apiClient } from "./client";
export type ChatMsg = { role: "user" | "assistant"; content: string };

export const aiService = {
  chat: (messages: ChatMsg[]): Promise<{ data: { reply: string } }> =>
    apiClient("/ai/chat", { method: "POST", body: JSON.stringify({ messages }) }),
  parseSearch: (query: string): Promise<{ data: Record<string, string> }> =>
    apiClient("/ai/search", { method: "POST", body: JSON.stringify({ query }) }),
  suggest: (q: string) =>
  apiClient(`/properties/suggestions?q=${encodeURIComponent(q)}`),
};