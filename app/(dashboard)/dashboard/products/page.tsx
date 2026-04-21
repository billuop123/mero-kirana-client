import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/utils/auth";
import { Product, Shop } from "@/lib/types";
import ProductSearchInput from "@/components/products/ProductSearchInput";
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

type Props = { searchParams: Promise<{ search?: string; page?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const token = await getServerToken();
  if (!token) redirect("/signin");

  const { search = "", page = "1" } = await searchParams;
  const pageNum = Math.max(1, parseInt(page));

  const shopRes = await fetch(`${API}/shops/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!shopRes.ok) return <NoShopPrompt />;
  const shop: Shop = (await shopRes.json()).data;

  const qs = new URLSearchParams({ page: String(pageNum), limit: String(LIMIT) });
  if (search) qs.set("search", search);
  const productsRes = await fetch(`${API}/shops/${shop.id}/products?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 0 },
  });
  const products: Product[] = productsRes.ok
    ? ((await productsRes.json()).data ?? [])
    : [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {products.length < LIMIT && pageNum === 1
              ? `${products.length} items`
              : `Page ${pageNum}`}
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors"
        >
          + Add product
        </Link>
      </div>

      {/* Search */}
      <div className="mb-5">
        <ProductSearchInput defaultValue={search} />
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-gray-400 text-sm">
            {search ? `No products matching "${search}".` : "No products yet."}
          </p>
          {!search && (
            <Link
              href="/dashboard/products/new"
              className="text-sm font-semibold text-gray-900 underline"
            >
              Add your first product →
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Name
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Category
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Unit
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Selling
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Cost
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  VAT
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900">{p.name}</td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {CATEGORY_LABELS[p.category] ?? p.category}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{p.unit}</td>
                  <td className="px-5 py-3.5 text-right text-gray-900 font-medium">
                    Rs. {p.sellingPrice}
                  </td>
                  <td className="px-5 py-3.5 text-right text-gray-500">Rs. {p.costPrice}</td>
                  <td className="px-5 py-3.5 text-right text-gray-500">{p.vatRate}%</td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/dashboard/products/${p.id}`}
                      className="text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">Page {pageNum}</p>
            <div className="flex gap-2">
              {pageNum > 1 && (
                <Link
                  href={`/dashboard/products?page=${pageNum - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  ← Prev
                </Link>
              )}
              {products.length === LIMIT && (
                <Link
                  href={`/dashboard/products?page=${pageNum + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
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
