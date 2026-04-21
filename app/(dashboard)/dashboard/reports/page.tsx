import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getServerToken } from "@/lib/utils/auth";
import {
  Shop, DailySummary, TopProduct, CategoryStat,
  PaymentStat, InventoryValue, LowStockProduct,
} from "@/lib/types";
import { TrendingUp, Receipt, Wallet, AlertTriangle, Package, ArrowUpRight } from "lucide-react";
import PeriodSelector from "@/components/reports/PeriodSelector";
import NoShopPrompt from "@/components/NoShopPrompt";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/v1";
const VALID_PERIODS = ["daily", "weekly", "monthly"];

const CATEGORY_LABELS: Record<string, string> = {
  grocery: "Grocery", dairy: "Dairy", beverages: "Beverages",
  snacks: "Snacks", household: "Household", personal_care: "Personal Care",
  tobacco: "Tobacco", frozen: "Frozen",
};

const PAYMENT_ICONS: Record<string, string> = {
  cash: "Cash", card: "Card", esewa: "eSewa", khalti: "Khalti",
};

type Props = { searchParams: Promise<{ period?: string }> };

function fmt(n: number) {
  return n.toLocaleString("en-NP", { maximumFractionDigits: 0 });
}

function MarginBadge({ margin }: { margin: number }) {
  const color =
    margin >= 30 ? "bg-green-50 text-green-700"
    : margin >= 15 ? "bg-blue-50 text-blue-700"
    : "bg-amber-50 text-amber-700";
  return (
    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${color}`}>
      {margin.toFixed(1)}%
    </span>
  );
}

export default async function ReportsPage({ searchParams }: Props) {
  const token = await getServerToken();
  if (!token) redirect("/signin");

  const { period: rawPeriod = "daily" } = await searchParams;
  const period = VALID_PERIODS.includes(rawPeriod) ? rawPeriod : "daily";

  const shopRes = await fetch(`${API}/shops/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!shopRes.ok) return <NoShopPrompt />;
  const shop: Shop = (await shopRes.json()).data;

  const headers = { Authorization: `Bearer ${token}` };
  const opts = { headers, next: { revalidate: 0 } };

  const [summaryRes, topRes, categoryRes, paymentRes, inventoryRes, lowRes] =
    await Promise.all([
      fetch(`${API}/shops/${shop.id}/reports/daily?period=${period}`, opts),
      fetch(`${API}/shops/${shop.id}/reports/top-selling?limit=10`, opts),
      fetch(`${API}/shops/${shop.id}/reports/category-breakdown?period=${period}`, opts),
      fetch(`${API}/shops/${shop.id}/reports/payment-breakdown?period=${period}`, opts),
      fetch(`${API}/shops/${shop.id}/reports/inventory-value`, opts),
      fetch(`${API}/shops/${shop.id}/reports/low-stock`, opts),
    ]);

  const summary: DailySummary = summaryRes.ok
    ? ((await summaryRes.json()).data ?? { total_bills: 0, total_revenue: 0, total_profit: 0, avg_bill_value: 0 })
    : { total_bills: 0, total_revenue: 0, total_profit: 0, avg_bill_value: 0 };

  const topProducts: TopProduct[] = topRes.ok ? ((await topRes.json()).data ?? []) : [];
  const categories: CategoryStat[] = categoryRes.ok ? ((await categoryRes.json()).data ?? []) : [];
  const payments: PaymentStat[] = paymentRes.ok ? ((await paymentRes.json()).data ?? []) : [];
  const inventory: InventoryValue = inventoryRes.ok
    ? ((await inventoryRes.json()).data ?? { cost_value: 0, selling_value: 0, product_count: 0 })
    : { cost_value: 0, selling_value: 0, product_count: 0 };
  const lowStock: LowStockProduct[] = lowRes.ok ? ((await lowRes.json()).data ?? []) : [];

  const periodLabel = period === "weekly" ? "This week" : period === "monthly" ? "This month" : "Today";
  const profitMargin = summary.total_revenue > 0
    ? (summary.total_profit / summary.total_revenue * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-400 mt-0.5">{periodLabel}</p>
        </div>
        <Suspense>
          <PeriodSelector current={period} />
        </Suspense>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <Receipt size={15} className="text-gray-600" />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Bills</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{summary.total_bills}</p>
          <p className="text-xs text-gray-400 mt-1">Avg Rs. {fmt(summary.avg_bill_value)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Wallet size={15} className="text-blue-600" />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Revenue</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">Rs. {fmt(summary.total_revenue)}</p>
          <p className="text-xs text-gray-400 mt-1">{periodLabel}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <TrendingUp size={15} className="text-green-600" />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Profit</p>
          </div>
          <p className="text-3xl font-bold text-green-600">Rs. {fmt(summary.total_profit)}</p>
          <p className="text-xs text-gray-400 mt-1">Margin {profitMargin}%</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <Package size={15} className="text-purple-600" />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Stock value</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">Rs. {fmt(inventory.selling_value)}</p>
          <p className="text-xs text-gray-400 mt-1">Cost Rs. {fmt(inventory.cost_value)} · {inventory.product_count} products</p>
        </div>
      </div>

      {/* Category breakdown + Payment breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Revenue by category</h2>
            <p className="text-xs text-gray-400 mt-0.5">{periodLabel}</p>
          </div>
          {categories.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">No sales data.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Category</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Sold</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Revenue</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Profit</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((c) => (
                  <tr key={c.category} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900 capitalize">
                      {CATEGORY_LABELS[c.category] ?? c.category}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-500">{c.total_sold}</td>
                    <td className="px-5 py-3 text-right font-medium text-gray-900">Rs. {fmt(c.revenue)}</td>
                    <td className="px-5 py-3 text-right text-green-600 font-medium">Rs. {fmt(c.profit)}</td>
                    <td className="px-5 py-3 text-right"><MarginBadge margin={c.margin} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Payment breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Payment methods</h2>
            <p className="text-xs text-gray-400 mt-0.5">{periodLabel}</p>
          </div>
          {payments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">No data.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {payments.map((p) => {
                const pct = summary.total_revenue > 0
                  ? (p.revenue / summary.total_revenue * 100).toFixed(0)
                  : "0";
                return (
                  <div key={p.mode} className="px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {PAYMENT_ICONS[p.mode] ?? p.mode}
                      </span>
                      <span className="text-xs text-gray-400">{p.bill_count} bills</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-900 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-10 text-right">{pct}%</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mt-1">Rs. {fmt(p.revenue)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top products + Low stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Top selling products</h2>
              <p className="text-xs text-gray-400 mt-0.5">All time · sorted by units sold</p>
            </div>
            <ArrowUpRight size={14} className="text-gray-300" />
          </div>
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">No sales data yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Product</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Sold</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Revenue</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topProducts.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="px-5 py-3 text-right text-gray-600">{p.total_sold}</td>
                    <td className="px-5 py-3 text-right font-medium text-gray-900">Rs. {fmt(p.revenue)}</td>
                    <td className="px-5 py-3 text-right"><MarginBadge margin={p.margin} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Low stock alerts</h2>
              <p className="text-xs text-gray-400 mt-0.5">At or below threshold · sorted by qty</p>
            </div>
            {lowStock.length > 0 && (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-600">
                {lowStock.length}
              </span>
            )}
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">All products are well-stocked.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Product</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Stock</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Threshold</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Gap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lowStock.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={12} className="text-amber-500 shrink-0" />
                        <span className="font-medium text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-red-600">{p.quantity}</td>
                    <td className="px-5 py-3 text-right text-gray-400">{p.threshold}</td>
                    <td className="px-5 py-3 text-right text-xs font-semibold text-amber-600">
                      -{Math.max(0, p.threshold - p.quantity)} units
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
