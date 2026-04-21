import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API = process.env.API_URL ?? "http://localhost:4000/v1";

export async function POST() {
  const store = await cookies();
  const token = store.get("token")?.value;

  if (token) {
    // best-effort: revoke the JWT on the backend so it can't be reused
    // even if this fails, the cookie is still deleted below
    await fetch(`${API}/auth/revoke`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }

  store.delete("token");
  redirect("/signin");
}
