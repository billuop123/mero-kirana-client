import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { getServerToken } from "@/lib/utils/auth";
import { Bill, Shop } from "@/lib/types";
import DateFilter from "@/components/bills/DateFilter";
import NoShopPrompt from "@/components/NoShopPrompt";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/v1";

function todayISO() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kathmandu" }).format(new Date());
}

type Props = { searchParams: Promise<{ filter?: string; page?: string; date?: string }> };

export default async function BillsPage({ searchParams }: Props) {
  const token = await getServerToken();
  if (!token) redirect("/signin");

  const { filter = "all", page = "1", date: rawDate } = await searchParams;
  const today = todayISO();
  // default to today only for "all" tab; udhari tab shows all dates by default
  const date = rawDate ?? (filter === "udhari" ? "" : today);
  const isFutureDate = date !== "" && date > today;

  const shopRes = await fetch(`${API}/shops/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!shopRes.ok) return <NoShopPrompt />;
  const shop: Shop = (await shopRes.json()).data;

  const bills: Bill[] = isFutureDate ? [] : await (async () => {
    const params = new URLSearchParams({ page, limit: "20" });
    if (date) params.set("date", date);
    if (filter === "udhari") params.set("is_udhari", "true");
    const res = await fetch(`${API}/shops/${shop.id}/bills?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    });
    return res.ok ? ((await res.json()).data ?? []) : [];
  })();

  const tabs = [
    { key: "all", label: "All" },
    { key: "udhari", label: "Udhari" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bills</h1>
          <p className="text-sm text-gray-400 mt-0.5">{bills.length} records</p>
        </div>
        <div className="flex items-center gap-3">
          <Suspense>
            <DateFilter current={date} />
          </Suspense>
          <Link
            href="/dashboard/bills/new"
            className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
          >
            + New Bill
          </Link>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/dashboard/bills?filter=${t.key}${date ? `&date=${date}` : ""}`}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === t.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {isFutureDate ? (
        <div className="bg-white rounded-2xl border border-red-100 flex flex-col items-center justify-center py-20 gap-3">
          <AlertTriangle size={28} className="text-red-400" />
          <p className="text-red-600 text-sm font-medium">Invalid date — cannot view bills for a future date.</p>
        </div>
      ) : bills.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-gray-400 text-sm">No bills on this date.</p>
          <Link
            href="/dashboard/bills/new"
            className="text-sm font-semibold text-gray-900 underline"
          >
            Create a bill →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Customer
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Date
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Payment
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Total
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bills.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">
                      {b.customer_name || "Walk-in"}
                    </p>
                    {b.customer_phone && (
                      <p className="text-xs text-gray-400">{b.customer_phone}</p>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {new Date(b.created_at).toLocaleDateString("en-NP", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 capitalize">{b.payment_mode}</td>
                  <td className="px-5 py-3.5">
                    {b.is_reversed ? (
                      <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                        Reversed
                      </span>
                    ) : b.is_udhari ? (
                      <span className="text-xs font-medium px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">
                        Udhari
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-0.5 bg-green-50 text-green-700 rounded-full">
                        Paid
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-gray-900">
                    Rs. {b.total_amount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/dashboard/bills/${b.id}`}
                      className="text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">Page {page}</p>
            <div className="flex gap-2">
              {parseInt(page) > 1 && (
                <Link
                  href={`/dashboard/bills?filter=${filter}${date ? `&date=${date}` : ""}&page=${parseInt(page) - 1}`}
                  className="text-xs font-medium text-gray-500 hover:text-gray-900"
                >
                  ← Prev
                </Link>
              )}
              {bills.length === 20 && (
                <Link
                  href={`/dashboard/bills?filter=${filter}${date ? `&date=${date}` : ""}&page=${parseInt(page) + 1}`}
                  className="text-xs font-medium text-gray-500 hover:text-gray-900"
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
