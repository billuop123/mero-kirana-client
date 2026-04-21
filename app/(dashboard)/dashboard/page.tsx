import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/utils/auth";
import { DailySummary, TopProduct, LowStockProduct, Shop } from "@/lib/types";

const API = process.env.API_URL ?? "http://localhost:4000/v1";

async function apiFetch<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`${path} failed`);
  const json = await res.json();
  return json.data as T;
}

function formatNPR(n: number) {
  return "Rs. " + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export default async function DashboardPage() {
  const token = await getServerToken();
  if (!token) redirect("/signin");

  const shop = await apiFetch<Shop>("/shops/me", token).catch(() => null);
  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-gray-500">You don&apos;t have a shop yet.</p>
        <a href="/dashboard/settings" className="text-sm font-semibold text-gray-900 underline">
          Create your shop →
        </a>
      </div>
    );
  }

  const [summary, topProducts, lowStock] = await Promise.all([
    apiFetch<DailySummary>(`/shops/${shop.id}/reports/daily?period=daily`, token).catch(
      () => null
    ),
    apiFetch<TopProduct[]>(`/shops/${shop.id}/reports/top-selling?limit=5`, token)
      .then((d) => d ?? [])
      .catch(() => []),
    apiFetch<LowStockProduct[]>(`/shops/${shop.id}/reports/low-stock`, token)
      .then((d) => d ?? [])
      .catch(() => []),
  ]);

  const stats = [
    {
      label: "Today's Bills",
      value: summary?.total_bills ?? 0,
      sub: "transactions",
    },
    {
      label: "Revenue",
      value: formatNPR(summary?.total_revenue ?? 0),
      sub: "today",
    },
    {
      label: "Profit",
      value: formatNPR(summary?.total_profit ?? 0),
      sub: "today",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
        <p className="text-sm text-gray-400 mt-0.5">Today&apos;s overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
              {s.label}
            </p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top selling */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Top Selling Today</h2>
            <a href="/dashboard/reports" className="text-xs text-gray-400 hover:text-gray-700">
              View all →
            </a>
          </div>
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No sales yet today.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {(topProducts as TopProduct[]).map((p, i) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-xs font-medium text-gray-400">{i + 1}</span>
                    <span className="text-sm text-gray-700 font-medium">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatNPR(p.revenue)}</p>
                    <p className="text-xs text-gray-400">{p.total_sold} sold</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock alerts */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Low Stock Alerts</h2>
            <a href="/dashboard/inventory" className="text-xs text-gray-400 hover:text-gray-700">
              View inventory →
            </a>
          </div>
          {(lowStock as LowStockProduct[]).length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">All stock levels look good.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {(lowStock as LowStockProduct[]).map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-medium">{p.name}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        p.quantity === 0
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {p.quantity === 0 ? "Out of stock" : `${p.quantity} left`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
