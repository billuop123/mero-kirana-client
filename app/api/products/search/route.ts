import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/v1";

// Cache shop lookup per token for 5 minutes — prevents a /shops/me hit on every keystroke
function getCachedShop(token: string) {
  return unstable_cache(
    async () => {
      const res = await fetch(`${API}/shops/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const { data } = await res.json();
      return data as { id: string } | null;
    },
    [`shop-me-${token}`],
    { revalidate: 300 }
  )();
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").slice(0, 100);
  if (!q) return NextResponse.json([]);

  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json([], { status: 401 });

  const shop = await getCachedShop(token);
  if (!shop) return NextResponse.json([], { status: 400 });

  const res = await fetch(
    `${API}/shops/${shop.id}/products?search=${encodeURIComponent(q)}&limit=8`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return NextResponse.json([]);

  const { data } = await res.json();
  return NextResponse.json(data ?? []);
}
