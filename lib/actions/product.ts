"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/v1";

export type ProductFormState = {
  error?: string;
};

async function getTokenAndShop() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  const res = await fetch(`${API}/shops/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;

  const { data: shop } = await res.json();
  return { token, shopId: shop.id as string };
}

export async function createProductAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const ctx = await getTokenAndShop();
  if (!ctx) return { error: "Not authenticated or no shop found." };

  const payload = {
    name: formData.get("name"),
    barcode: formData.get("barcode") || undefined,
    unit: formData.get("unit"),
    selling_price: parseFloat(formData.get("selling_price") as string),
    cost_price: parseFloat(formData.get("cost_price") as string),
    vat_rate: parseFloat((formData.get("vat_rate") as string) || "0"),
    low_stock_threshold: parseInt((formData.get("low_stock_threshold") as string) || "5"),
    category: formData.get("category"),
    initial_quantity: parseFloat((formData.get("initial_quantity") as string) || "0"),
  };

  const res = await fetch(`${API}/shops/${ctx.shopId}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ctx.token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return { error: body.error ?? "Failed to create product." };
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function updateProductAction(
  productId: string,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const ctx = await getTokenAndShop();
  if (!ctx) return { error: "Not authenticated or no shop found." };

  const payload = {
    name: formData.get("name"),
    barcode: formData.get("barcode") || undefined,
    unit: formData.get("unit"),
    selling_price: parseFloat(formData.get("selling_price") as string),
    cost_price: parseFloat(formData.get("cost_price") as string),
    vat_rate: parseFloat((formData.get("vat_rate") as string) || "0"),
    low_stock_threshold: parseInt((formData.get("low_stock_threshold") as string) || "5"),
    category: formData.get("category"),
  };

  const res = await fetch(`${API}/shops/${ctx.shopId}/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ctx.token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return { error: body.error ?? "Failed to update product." };
  }

  revalidatePath("/dashboard/products");
  revalidatePath(`/dashboard/products/${productId}`);
  redirect("/dashboard/products");
}

export async function deleteProductAction(productId: string): Promise<void> {
  const ctx = await getTokenAndShop();
  if (!ctx) return;

  await fetch(`${API}/shops/${ctx.shopId}/products/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${ctx.token}` },
  });

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function restockProductAction(
  productId: string,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const ctx = await getTokenAndShop();
  if (!ctx) return { error: "Not authenticated or no shop found." };

  const quantity = parseFloat(formData.get("quantity") as string);
  if (!quantity || quantity <= 0) return { error: "Enter a valid quantity." };

  const res = await fetch(`${API}/shops/${ctx.shopId}/products/${productId}/restock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ctx.token}`,
    },
    body: JSON.stringify({ quantity }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return { error: body.error ?? "Failed to restock." };
  }

  revalidatePath(`/dashboard/products/${productId}`);
  revalidatePath("/dashboard/inventory");
  return {};
}
