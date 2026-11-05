import { apiClient } from "./client";

export interface PublicStats {
  totalProperties: number; totalTenants: number; totalLandlords: number; rentedCount: number;
  totalReviews: number; avgRating: number;
  cities: { city: string; state: string; count: number }[];
  categories: { id: string; name: string; count: number }[];
  reviews: { id: string; rating: number; comment: string | null;
             tenant: { name: string }; property: { id: string; title: string; city: string } }[];
}

export interface DashboardStats {
  statusBreakdown: { name: string; value: number }[];
  requestsByMonth: { month: string; value: number }[];
  moneyByMonth: { month: string; value: number }[];
  moneyLabel: string; totalMoney: number;
  extra: { title: string; data: { name: string; value: number }[] } | null;
  insights: string[];
}

const empty: PublicStats = { totalProperties: 0, totalTenants: 0, totalLandlords: 0, rentedCount: 0,
  totalReviews: 0, avgRating: 0, cities: [], categories: [], reviews: [] };

export async function getPublicStats(): Promise<PublicStats> {
  try { return (await apiClient("/stats/public")).data ?? empty; } catch { return empty; }
}
export const statsService = {
  dashboard: (): Promise<{ data: DashboardStats }> => apiClient("/stats/dashboard"),
};