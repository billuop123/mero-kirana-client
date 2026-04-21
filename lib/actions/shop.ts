"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/v1";

export type ShopFormState = {
  error?: string;
  success?: boolean;
};

export async function saveShopAction(
  _prev: ShopFormState,
  formData: FormData
): Promise<ShopFormState> {
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const panNo = (formData.get("panNo") as string)?.trim();
  const address = (formData.get("address") as string)?.trim();

  if (!name) return { error: "Shop name is required." };
  if (!address) return { error: "Address is required." };

  const token = (await cookies()).get("token")?.value;
  if (!token) return { error: "Not authenticated." };

  const payload = { name, phone, panNo, address };

  // Try update first; if 404 (no shop yet), create instead
  const putRes = await fetch(`${API}/shops/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (putRes.status === 404) {
    const postRes = await fetch(`${API}/shops`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!postRes.ok) {
      const body = await postRes.json().catch(() => ({}));
      return { error: body.error ?? "Failed to create shop." };
    }
  } else if (!putRes.ok) {
    const body = await putRes.json().catch(() => ({}));
    return { error: body.error ?? "Failed to update shop." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return { success: true };
}
