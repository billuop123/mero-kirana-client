import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/utils/auth";
import { DailySummary, TopProduct, LowStockProduct, Shop } from "@/lib/types";
import { Receipt, TrendingUp, IndianRupee, ArrowRight } from "lucide-react";

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
        <p className="text-stone-500">You don&apos;t have a shop yet.</p>
        <a
          href="/dashboard/settings"
          className="text-sm font-semibold text-orange-600 underline underline-offset-2"
        >
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

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">{shop.name}</h1>
        <p className="text-sm text-stone-400 mt-0.5">Today&apos;s overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Bills */}
        <div className="bg-white rounded-2xl border border-stone-100 p-5 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-orange-400 rounded-t-2xl" />
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">
              Today&apos;s Bills
            </p>
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <Receipt size={14} className="text-orange-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-stone-900">{summary?.total_bills ?? 0}</p>
          <p className="text-xs text-stone-400 mt-1">transactions</p>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-2xl border border-stone-100 p-5 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-emerald-400 rounded-t-2xl" />
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">Revenue</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <TrendingUp size={14} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-stone-900">
            {formatNPR(summary?.total_revenue ?? 0)}
          </p>
          <p className="text-xs text-stone-400 mt-1">today</p>
        </div>

        {/* Profit */}
        <div className="bg-white rounded-2xl border border-stone-100 p-5 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-blue-400 rounded-t-2xl" />
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">Profit</p>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <IndianRupee size={14} className="text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-stone-900">
            {formatNPR(summary?.total_profit ?? 0)}
          </p>
          <p className="text-xs text-stone-400 mt-1">today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top selling */}
        <div className="bg-white rounded-2xl border border-stone-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-stone-900">Top Selling Today</h2>
            <a
              href="/dashboard/reports"
              className="flex items-center gap-1 text-xs text-stone-400 hover:text-orange-500 transition-colors"
            >
              View all <ArrowRight size={11} />
            </a>
          </div>
          {topProducts.length === 0 ? (
            <p className="text-sm text-stone-400 py-6 text-center">No sales yet today.</p>
          ) : (
            <div className="flex flex-col gap-3.5">
              {(topProducts as TopProduct[]).map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-500 shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm text-stone-700 font-medium truncate">
                    {p.name}
                  </span>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-stone-900">{formatNPR(p.revenue)}</p>
                    <p className="text-xs text-stone-400">{p.total_sold} sold</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-2xl border border-stone-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-stone-900">Low Stock Alerts</h2>
            <a
              href="/dashboard/inventory"
              className="flex items-center gap-1 text-xs text-stone-400 hover:text-orange-500 transition-colors"
            >
              View inventory <ArrowRight size={11} />
            </a>
          </div>
          {(lowStock as LowStockProduct[]).length === 0 ? (
            <p className="text-sm text-stone-400 py-6 text-center">
              All stock levels look good. ✓
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {(lowStock as LowStockProduct[]).map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <span className="text-sm text-stone-700 font-medium">{p.name}</span>
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
