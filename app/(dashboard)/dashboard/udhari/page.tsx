import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/utils/auth";
import { Shop, UdhariCustomer } from "@/lib/types";
import { Phone, User, Receipt, HandCoins } from "lucide-react";
import NoShopPrompt from "@/components/NoShopPrompt";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/v1";

export default async function UdhariPage() {
  const token = await getServerToken();
  if (!token) redirect("/signin");

  const shopRes = await fetch(`${API}/shops/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!shopRes.ok) return <NoShopPrompt />;
  const shop: Shop = (await shopRes.json()).data;

  const udhariRes = await fetch(`${API}/shops/${shop.id}/udhari`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 0 },
  });

  const customers: UdhariCustomer[] = udhariRes.ok
    ? ((await udhariRes.json()).data ?? [])
    : [];

  const totalOutstanding = customers.reduce((sum, c) => sum + c.total_amount, 0);
  const totalBills = customers.reduce((sum, c) => sum + c.bill_count, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Udhari</h1>
          <p className="text-sm text-gray-400 mt-0.5">Outstanding credit by customer</p>
        </div>
        <Link
          href="/dashboard/bills?filter=udhari"
          className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors"
        >
          View all udhari bills →
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Customers with credit
          </p>
          <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Unpaid bills
          </p>
          <p className="text-3xl font-bold text-gray-900">{totalBills}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Total outstanding
          </p>
          <p className="text-3xl font-bold text-red-600">Rs. {totalOutstanding.toFixed(2)}</p>
        </div>
      </div>

      {/* Customer list */}
      {customers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center py-20 gap-3">
          <HandCoins size={36} className="text-gray-200" />
          <p className="text-gray-400 text-sm">No outstanding udhari.</p>
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
                  Phone
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Bills
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Outstanding
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <User size={14} className="text-gray-500" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {c.customer_name || <span className="text-gray-400 italic">Anonymous</span>}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {c.customer_phone ? (
                      <div className="flex items-center gap-1.5">
                        <Phone size={12} className="text-gray-400" />
                        {c.customer_phone}
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="inline-flex items-center gap-1 text-gray-600">
                      <Receipt size={12} className="text-gray-400" />
                      {c.bill_count}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-red-600">
                    Rs. {c.total_amount.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href="/dashboard/bills?filter=udhari"
                      className="text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      View bills →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
