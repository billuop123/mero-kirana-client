import { apiRequest } from "./client";
import { Bill, CreateBillPayload, UdhariCustomer } from "@/lib/types";

export function createBill(shopId: string, payload: CreateBillPayload): Promise<Bill> {
  return apiRequest<Bill>(`/shops/${shopId}/bills`, { method: "POST", body: payload });
}

export function listBills(
  shopId: string,
  params?: { is_udhari?: boolean; page?: number; limit?: number }
): Promise<Bill[]> {
  const query = new URLSearchParams();
  if (params?.is_udhari !== undefined) query.set("is_udhari", String(params.is_udhari));
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString() ? `?${query.toString()}` : "";
  return apiRequest<Bill[]>(`/shops/${shopId}/bills${qs}`);
}

export function getBill(shopId: string, billId: string): Promise<Bill> {
  return apiRequest<Bill>(`/shops/${shopId}/bills/${billId}`);
}

export function reverseBill(shopId: string, billId: string): Promise<void> {
  return apiRequest<void>(`/shops/${shopId}/bills/${billId}/reverse`, { method: "POST" });
}

export function payUdhariBill(shopId: string, billId: string): Promise<void> {
  return apiRequest<void>(`/shops/${shopId}/bills/${billId}/pay`, { method: "POST" });
}

export function getUdhariSummary(shopId: string): Promise<UdhariCustomer[]> {
  return apiRequest<UdhariCustomer[]>(`/shops/${shopId}/udhari`);
}
