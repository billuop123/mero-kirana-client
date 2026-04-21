import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/utils/auth";
import { Product, Shop, InventoryItem } from "@/lib/types";
import POSInterface from "@/components/bills/POSInterface";
import NoShopPrompt from "@/components/NoShopPrompt";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/v1";

export default async function NewBillPage() {
  const token = await getServerToken();
  if (!token) redirect("/signin");

  const shopRes = await fetch(`${API}/shops/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!shopRes.ok) return <NoShopPrompt />;
  const shop: Shop = (await shopRes.json()).data;

  const [productsRes, inventoryRes] = await Promise.all([
    fetch(`${API}/shops/${shop.id}/products?limit=200`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    }),
    fetch(`${API}/shops/${shop.id}/inventory?limit=200`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    }),
  ]);

  const products: Product[] = productsRes.ok
    ? ((await productsRes.json()).data ?? [])
    : [];

  const inventory: InventoryItem[] = inventoryRes.ok
    ? ((await inventoryRes.json()).data ?? [])
    : [];

  const stockMap: Record<string, number> = {};
  for (const item of inventory) {
    stockMap[item.product_id] = item.quantity;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/bills" className="text-gray-400 hover:text-gray-700 text-sm">
          ← Bills
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Bill</h1>
        <p className="text-sm text-gray-400 mt-1">{products.length} products available</p>
      </div>
      <POSInterface products={products} stockMap={stockMap} />
    </div>
  );
}
