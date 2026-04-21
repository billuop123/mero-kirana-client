import { apiRequest } from "./client";
import { DailySummary, TopProduct, LowStockProduct } from "@/lib/types";

export function getDailySummary(
  shopId: string,
  period: "daily" | "weekly" | "monthly" = "daily"
): Promise<DailySummary> {
  return apiRequest<DailySummary>(`/shops/${shopId}/reports/daily?period=${period}`);
}

export function getTopSellingProducts(shopId: string, limit = 10): Promise<TopProduct[]> {
  return apiRequest<TopProduct[]>(`/shops/${shopId}/reports/top-selling?limit=${limit}`);
}

export function getLowStockProducts(shopId: string): Promise<LowStockProduct[]> {
  return apiRequest<LowStockProduct[]>(`/shops/${shopId}/reports/low-stock`);
}
