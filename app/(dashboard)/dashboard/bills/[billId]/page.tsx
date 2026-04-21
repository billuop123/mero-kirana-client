import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, Printer } from "lucide-react";
import { getServerToken } from "@/lib/utils/auth";
import { Bill, Shop } from "@/lib/types";
import BillActions from "@/components/bills/BillActions";
import BillQRCode from "@/components/bills/BillQRCode";
import NoShopPrompt from "@/components/NoShopPrompt";

const API = process.env.API_URL ?? "http://localhost:4000/v1";

type Props = { params: Promise<{ billId: string }> };

function formatNepaliDate(iso: string) {
  return new Date(iso).toLocaleString("en-NP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default async function BillDetailPage({ params }: Props) {
  const { billId } = await params;
  const token = await getServerToken();
  if (!token) redirect("/signin");

  const shopRes = await fetch(`${API}/shops/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!shopRes.ok) return <NoShopPrompt />;
  const shop: Shop = (await shopRes.json()).data;

  const bRes = await fetch(`${API}/shops/${shop.id}/bills/${billId}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 0 },
  });
  if (!bRes.ok) notFound();
  const bill: Bill = (await bRes.json()).data;

  const billNo = billId.slice(0, 8).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard/bills"
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft size={16} />
          Bills
        </Link>
        <div className="flex items-center gap-2 print:hidden">
          <BillQRCode billId={billId} />
          <button
            onClick={undefined}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Printer size={14} />
            Print
          </button>
        </div>
      </div>

      {/* Receipt card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Shop header */}
        <div className="px-8 pt-8 pb-6 text-center border-b border-dashed border-gray-200">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 uppercase">
            {shop.name}
          </h1>
          {shop.address && (
            <p className="text-xs text-gray-500 mt-1">{shop.address}</p>
          )}
          {shop.phone && (
            <p className="text-xs text-gray-500">Ph: {shop.phone}</p>
          )}
          {shop.panNO && (
            <p className="text-xs text-gray-500">PAN: {shop.panNO}</p>
          )}
        </div>

        {/* Bill meta */}
        <div className="px-8 py-4 border-b border-dashed border-gray-200">
          <div className="flex justify-between text-xs text-gray-500">
            <div className="flex flex-col gap-1">
              <span className="text-gray-400">Bill No.</span>
              <span className="font-mono font-semibold text-gray-900">#{billNo}</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-gray-400">Date & Time</span>
              <span className="font-medium text-gray-900">{formatNepaliDate(bill.created_at)}</span>
            </div>
          </div>

          {(bill.customer_name || bill.customer_phone) && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-gray-400">Customer</span>
                <span className="font-medium text-gray-900">{bill.customer_name || "—"}</span>
              </div>
              {bill.customer_phone && (
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-gray-400">Phone</span>
                  <span className="font-medium text-gray-900">{bill.customer_phone}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Items */}
        <div className="px-8 py-4 border-b border-dashed border-gray-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="text-left pb-2 font-semibold uppercase tracking-wide w-6">S.N.</th>
                <th className="text-left pb-2 pl-3 font-semibold uppercase tracking-wide">Particular</th>
                <th className="text-right pb-2 font-semibold uppercase tracking-wide">Qty</th>
                <th className="text-right pb-2 font-semibold uppercase tracking-wide">Rate</th>
                <th className="text-right pb-2 font-semibold uppercase tracking-wide">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bill.items?.map((item, i) => (
                <tr key={item.id}>
                  <td className="py-2 text-gray-400">{i + 1}</td>
                  <td className="py-2 pl-3 text-gray-900 font-medium">{item.product_name}</td>
                  <td className="py-2 text-right text-gray-600">{item.quantity}</td>
                  <td className="py-2 text-right text-gray-600">Rs.{item.unit_price}</td>
                  <td className="py-2 text-right font-semibold text-gray-900">
                    Rs.{(item.unit_price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-8 py-4 border-b border-dashed border-gray-200 flex flex-col gap-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>Rs. {bill.subtotal.toFixed(2)}</span>
          </div>
          {bill.discount > 0 && (
            <div className="flex justify-between text-gray-500">
              <span>Discount</span>
              <span>- Rs. {bill.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-3 border-t-2 border-gray-900">
            <span className="font-bold text-gray-900 text-base uppercase tracking-wide">Total</span>
            <span className="font-bold text-gray-900 text-xl">Rs. {bill.total_amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment & status */}
        <div className="px-8 py-4 flex items-center justify-between text-xs">
          <div className="flex flex-col gap-1">
            <span className="text-gray-400">Payment mode</span>
            <span className="font-semibold text-gray-900 capitalize">{bill.payment_mode}</span>
          </div>
          <div>
            {bill.is_reversed ? (
              <span className="px-3 py-1 bg-gray-100 text-gray-500 font-semibold rounded-full text-xs uppercase tracking-wide">
                Reversed
              </span>
            ) : bill.is_udhari ? (
              <span className="px-3 py-1 bg-amber-50 text-amber-700 font-semibold rounded-full text-xs uppercase tracking-wide">
                Udhari / उधारी
              </span>
            ) : (
              <span className="px-3 py-1 bg-green-50 text-green-700 font-semibold rounded-full text-xs uppercase tracking-wide">
                Paid / भुक्तान
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-7 pt-2 text-center border-t border-dashed border-gray-200">
          <p className="text-xs text-gray-400">धन्यवाद! कृपया फेरि आउनुहोस्।</p>
          <p className="text-xs text-gray-300 mt-0.5">Thank you, please come again.</p>
        </div>
      </div>

      {/* Actions */}
      {!bill.is_reversed && (
        <div className="mt-5 print:hidden">
          <BillActions billId={billId} isUdhari={bill.is_udhari} />
        </div>
      )}
    </div>
  );
}
