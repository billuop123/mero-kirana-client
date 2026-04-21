import { apiRequest } from "./client";
import { Product, CreateProductPayload } from "@/lib/types";

export function createProduct(shopId: string, payload: CreateProductPayload): Promise<Product> {
  return apiRequest<Product>(`/shops/${shopId}/products`, { method: "POST", body: payload });
}

export function listProducts(shopId: string, search?: string): Promise<Product[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiRequest<Product[]>(`/shops/${shopId}/products${query}`);
}

export function getProduct(shopId: string, productId: string): Promise<Product> {
  return apiRequest<Product>(`/shops/${shopId}/products/${productId}`);
}

export function updateProduct(
  shopId: string,
  productId: string,
  payload: Partial<CreateProductPayload>
): Promise<Product> {
  return apiRequest<Product>(`/shops/${shopId}/products/${productId}`, {
    method: "PUT",
    body: payload,
  });
}

export function deleteProduct(shopId: string, productId: string): Promise<void> {
  return apiRequest<void>(`/shops/${shopId}/products/${productId}`, { method: "DELETE" });
}

export function restockProduct(shopId: string, productId: string, quantity: number): Promise<void> {
  return apiRequest<void>(`/shops/${shopId}/products/${productId}/restock`, {
    method: "POST",
    body: { quantity },
  });
}
