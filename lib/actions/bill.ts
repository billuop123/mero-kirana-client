"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/v1";

export type BillFormState = { error?: string };

async function getCtx() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  const res = await fetch(`${API}/shops/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const { data: shop } = await res.json();
  return { token, shopId: shop.id as string };
}

export async function createBillAction(
  _prev: BillFormState,
  formData: FormData
): Promise<BillFormState> {
  const ctx = await getCtx();
  if (!ctx) return { error: "Not authenticated." };

  let items: { product_id: string; quantity: number }[];
  try {
    items = JSON.parse(formData.get("cart") as string);
  } catch {
    return { error: "Invalid cart data." };
  }
  if (!items.length) return { error: "Cart is empty." };

  const discount = parseFloat((formData.get("discount") as string) || "0");
  const payload = {
    customer_name: (formData.get("customer_name") as string) || undefined,
    customer_phone: (formData.get("customer_phone") as string) || undefined,
    discount: isNaN(discount) ? 0 : discount,
    payment_mode: formData.get("payment_mode") as string,
    is_udhari: formData.get("is_udhari") === "true",
    items,
  };

  const res = await fetch(`${API}/shops/${ctx.shopId}/bills`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ctx.token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return { error: body.error ?? "Failed to create bill." };
  }

  const { data: bill } = await res.json();
  revalidatePath("/dashboard/bills");
  revalidatePath("/dashboard");
  redirect(`/dashboard/bills/${bill.id}`);
}

export async function reverseBillAction(billId: string): Promise<void> {
  const ctx = await getCtx();
  if (!ctx) return;
  await fetch(`${API}/shops/${ctx.shopId}/bills/${billId}/reverse`, {
    method: "POST",
    headers: { Authorization: `Bearer ${ctx.token}` },
  });
  revalidatePath(`/dashboard/bills/${billId}`);
  revalidatePath("/dashboard/bills");
}

export async function payBillAction(billId: string): Promise<void> {
  const ctx = await getCtx();
  if (!ctx) return;
  await fetch(`${API}/shops/${ctx.shopId}/bills/${billId}/pay`, {
    method: "POST",
    headers: { Authorization: `Bearer ${ctx.token}` },
  });
  revalidatePath(`/dashboard/bills/${billId}`);
  revalidatePath("/dashboard/bills");
}
