import { apiRequest } from "./client";
import { Shop, CreateShopPayload } from "@/lib/types";

export function createShop(payload: CreateShopPayload): Promise<Shop> {
  return apiRequest<Shop>("/shops", { method: "POST", body: payload });
}

export function getMyShop(): Promise<Shop> {
  return apiRequest<Shop>("/shops/me");
}

export function updateMyShop(payload: Partial<CreateShopPayload>): Promise<Shop> {
  return apiRequest<Shop>("/shops/me", { method: "PUT", body: payload });
}
