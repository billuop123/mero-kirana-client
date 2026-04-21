import { apiRequest } from "./client";
import { InventoryItem } from "@/lib/types";

export function getInventory(shopId: string): Promise<InventoryItem[]> {
  return apiRequest<InventoryItem[]>(`/shops/${shopId}/inventory`);
}
