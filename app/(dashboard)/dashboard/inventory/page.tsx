import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/utils/auth";
import { InventoryItem, Shop } from "@/lib/types";
import NoShopPrompt from "@/components/NoShopPrompt";

const API = process.env.API_URL ?? "http://localhost:4000/v1";

const CATEGORY_LABELS: Record<string, string> = {
  grocery: "Grocery",
  dairy: "Dairy",
  beverages: "Beverages",
  snacks: "Snacks",
  household: "Household",
  personal_care: "Personal Care",
  tobacco: "Tobacco",
  frozen: "Frozen",
};

const LIMIT = 20;

type Props = { searchParams: Promise<{ page?: string }> };

export default async function InventoryPage({ searchParams }: Props) {
  const token = await getServerToken();
  if (!token) redirect("/signin");

  const { page = "1" } = await searchParams;
  const pageNum = Math.max(1, parseInt(page));

  const shopRes = await fetch(`${API}/shops/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!shopRes.ok) return <NoShopPrompt />;
  const shop: Shop = (await shopRes.json()).data;

  const res = await fetch(
    `${API}/shops/${shop.id}/inventory?page=${pageNum}&limit=${LIMIT}`,
    { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 0 } }
  );
  const items: InventoryItem[] = res.ok ? ((await res.json()).data ?? []) : [];

  const outOfStock = items.filter((i) => i.quantity === 0);
  const lowStock = items.filter((i) => i.quantity > 0 && i.quantity <= i.low_stock_threshold);
  const healthy = items.filter((i) => i.quantity > i.low_stock_threshold);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {items.length < LIMIT && pageNum === 1
              ? `${items.length} products`
              : `Page ${pageNum}`}
          </p>
        </div>
        <Link
          href="/dashboard/products"
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Manage products →
        </Link>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Healthy", count: healthy.length, color: "bg-green-50 text-green-700 border-green-100" },
          { label: "Low stock", count: lowStock.length, color: "bg-amber-50 text-amber-700 border-amber-100" },
          { label: "Out of stock", count: outOfStock.length, color: "bg-red-50 text-red-700 border-red-100" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border px-5 py-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-gray-400 text-sm">No inventory yet.</p>
          <Link
            href="/dashboard/products/new"
            className="text-sm font-semibold text-gray-900 underline"
          >
            Add products to get started →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Product
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Category
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Unit
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  In stock
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Threshold
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Updated
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item) => {
                const isOut = item.quantity === 0;
                const isLow = !isOut && item.quantity <= item.low_stock_threshold;

                return (
                  <tr
                    key={item.product_id}
                    className={`transition-colors ${
                      isOut
                        ? "bg-red-50/40 hover:bg-red-50"
                        : isLow
                        ? "bg-amber-50/40 hover:bg-amber-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-5 py-3.5 font-medium text-gray-900">{item.name}</td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {CATEGORY_LABELS[item.category] ?? item.category}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{item.unit}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-5 py-3.5 text-right text-gray-400">{item.low_stock_threshold}</td>
                    <td className="px-5 py-3.5">
                      {isOut ? (
                        <span className="text-xs font-semibold px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                          Out of stock
                        </span>
                      ) : isLow ? (
                        <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                          Low stock
                        </span>
                      ) : (
                        <span className="text-xs font-semibold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                          OK
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right text-gray-400 text-xs">
                      {new Date(item.updated_at).toLocaleDateString("en-NP", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/dashboard/products/${item.product_id}`}
                        className="text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        Restock →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">Page {pageNum}</p>
            <div className="flex gap-2">
              {pageNum > 1 && (
                <Link href={`/dashboard/inventory?page=${pageNum - 1}`} className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  ← Prev
                </Link>
              )}
              {items.length === LIMIT && (
                <Link href={`/dashboard/inventory?page=${pageNum + 1}`} className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  Next →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
