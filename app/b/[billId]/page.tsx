import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShoppingCart } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/v1";

type BillItem = {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
};

type PublicBill = {
  id: string;
  customer_name: string;
  customer_phone: string;
  subtotal: number;
  discount: number;
  total_amount: number;
  payment_mode: string;
  is_udhari: boolean;
  is_reversed: boolean;
  created_at: string;
  items: BillItem[];
  shop: {
    name: string;
    address: string;
    phone: string;
    pan_no: string;
  };
};

type Props = { params: Promise<{ billId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { billId } = await params;
  const res = await fetch(`${API}/bills/${billId}/view`, { next: { revalidate: 60 } });
  if (!res.ok) return { title: "Receipt" };
  const bill: PublicBill = (await res.json()).data;
  const billNo = billId.slice(0, 8).toUpperCase();
  return {
    title: `Receipt #${billNo} — ${bill.shop.name}`,
    description: `Bill from ${bill.shop.name}${bill.shop.address ? `, ${bill.shop.address}` : ""}. Total: Rs. ${bill.total_amount.toFixed(2)}.`,
    robots: { index: false, follow: false },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default async function PublicBillPage({ params }: Props) {
  const { billId } = await params;

  const res = await fetch(`${API}/bills/${billId}/view`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) notFound();

  const bill: PublicBill = (await res.json()).data;
  const billNo = billId.slice(0, 8).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      {/* Receipt */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Shop header */}
        <div className="px-6 pt-7 pb-5 text-center border-b border-dashed border-gray-200">
          <div className="flex items-center justify-center gap-2 mb-3">
            <ShoppingCart size={16} className="text-gray-400" />
            <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">Receipt</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 uppercase">
            {bill.shop.name}
          </h1>
          {bill.shop.address && (
            <p className="text-xs text-gray-500 mt-1">{bill.shop.address}</p>
          )}
          {bill.shop.phone && (
            <p className="text-xs text-gray-500">Ph: {bill.shop.phone}</p>
          )}
          {bill.shop.pan_no && (
            <p className="text-xs text-gray-500">PAN: {bill.shop.pan_no}</p>
          )}
        </div>

        {/* Bill meta */}
        <div className="px-6 py-4 border-b border-dashed border-gray-200">
          <div className="flex justify-between text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-gray-400">Bill No.</span>
              <span className="font-mono font-semibold text-gray-900">#{billNo}</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-gray-400">Date</span>
              <span className="font-medium text-gray-700">{formatDate(bill.created_at)}</span>
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
        <div className="px-6 py-4 border-b border-dashed border-gray-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100">
                <th className="text-left pb-2 font-semibold uppercase tracking-wide">Item</th>
                <th className="text-right pb-2 font-semibold uppercase tracking-wide">Qty</th>
                <th className="text-right pb-2 font-semibold uppercase tracking-wide">Rate</th>
                <th className="text-right pb-2 font-semibold uppercase tracking-wide">Amt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bill.items?.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 font-medium text-gray-900">{item.product_name}</td>
                  <td className="py-2 text-right text-gray-600">{item.quantity}</td>
                  <td className="py-2 text-right text-gray-600">Rs.{item.unit_price}</td>
                  <td className="py-2 text-right font-semibold text-gray-900">
                    Rs.{(item.unit_price * item.quantity).toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-6 py-4 border-b border-dashed border-gray-200 flex flex-col gap-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>Rs. {bill.subtotal.toFixed(2)}</span>
          </div>
          {bill.discount > 0 && (
            <div className="flex justify-between text-gray-500">
              <span>Discount</span>
              <span>− Rs. {bill.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-3 border-t-2 border-gray-900">
            <span className="font-bold text-gray-900 uppercase tracking-wide">Total</span>
            <span className="font-bold text-gray-900 text-xl">Rs. {bill.total_amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment & status */}
        <div className="px-6 py-4 flex items-center justify-between text-xs">
          <div className="flex flex-col gap-1">
            <span className="text-gray-400">Payment</span>
            <span className="font-semibold text-gray-900 capitalize">{bill.payment_mode}</span>
          </div>
          {bill.is_reversed ? (
            <span className="px-3 py-1 bg-gray-100 text-gray-500 font-semibold rounded-full uppercase tracking-wide">
              Reversed
            </span>
          ) : bill.is_udhari ? (
            <span className="px-3 py-1 bg-amber-50 text-amber-700 font-semibold rounded-full uppercase tracking-wide">
              Udhari / उधारी
            </span>
          ) : (
            <span className="px-3 py-1 bg-green-50 text-green-700 font-semibold rounded-full uppercase tracking-wide">
              Paid / भुक्तान
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2 text-center border-t border-dashed border-gray-200">
          <p className="text-xs text-gray-400">धन्यवाद! कृपया फेरि आउनुहोस्।</p>
          <p className="text-xs text-gray-300 mt-0.5">Thank you, please come again.</p>
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-400">Powered by आफ्नो Kirana</p>
    </div>
  );
}
