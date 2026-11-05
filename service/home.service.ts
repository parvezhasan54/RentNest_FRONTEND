import { Property } from "@/types/property";
import { apiClient } from "./client";

export type LatestReview = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  tenant: { name: string };
  property: { id: string; title: string; city: string };
};

export async function getTrendingProperties(limit = 4): Promise<Property[]> {
  try {
    const res = await apiClient(`/properties/trending?limit=${limit}`);
    return res?.data ?? [];
  } catch {
    return [];
  }
}

export async function getLatestReviews(limit = 3): Promise<LatestReview[]> {
  try {
    const res = await apiClient(`/reviews/latest?limit=${limit}`);
    return res?.data ?? [];
  } catch {
    return [];
  }
}