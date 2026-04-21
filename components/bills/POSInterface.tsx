"use client";

import { useActionState, useState, useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import { createBillAction, BillFormState } from "@/lib/actions/bill";
import { Product } from "@/lib/types";

type CartItem = { product: Product; quantity: number };

const PAYMENT_MODES = ["cash", "card", "esewa", "khalti"];

type Props = {
  products: Product[];
  stockMap: Record<string, number>;
};

export default function POSInterface({ products, stockMap }: Props) {
  const [state, formAction, pending] = useActionState(createBillAction, {} as BillFormState);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [isUdhari, setIsUdhari] = useState(false);
  const [discount, setDiscount] = useState<number | "">("");

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [products, search]
  );

  function stockOf(productId: string) {
    return stockMap[productId] ?? 0;
  }

  function cartQtyOf(productId: string) {
    return cart.find((i) => i.product.id === productId)?.quantity ?? 0;
  }

  function addToCart(product: Product) {
    const stock = stockOf(product.id);
    const inCart = cartQtyOf(product.id);
    if (inCart >= stock) return; // already at stock limit
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function updateQty(productId: string, qty: number) {
    const stock = stockOf(productId);
    const clamped = Math.min(qty, stock);
    if (clamped <= 0) {
      setCart((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.product.id === productId ? { ...i, quantity: clamped } : i))
      );
    }
  }

  const subtotal = cart.reduce((sum, i) => sum + i.product.sellingPrice * i.quantity, 0);
  const discountVal = discount === "" ? 0 : discount;
  const total = Math.max(0, subtotal - discountVal);
  const cartJson = JSON.stringify(
    cart.map((i) => ({ product_id: i.product.id, quantity: i.quantity }))
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left — product picker */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full bg-white text-gray-900 placeholder:text-gray-400 text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all"
        />

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-gray-100">
              {filtered.map((p) => {
                const stock = stockOf(p.id);
                const inCart = cartQtyOf(p.id);
                const outOfStock = stock === 0;
                const atLimit = inCart >= stock && stock > 0;
                const lowStock = stock > 0 && stock <= 5;

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => addToCart(p)}
                    disabled={outOfStock}
                    className={`bg-white p-4 text-left transition-colors relative ${
                      outOfStock
                        ? "opacity-50 cursor-not-allowed"
                        : atLimit
                        ? "bg-amber-50 cursor-not-allowed"
                        : "hover:bg-gray-50 active:bg-gray-100"
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-900 leading-tight pr-6">{p.name}</p>
                    <p className="text-xs text-gray-400 mt-1 capitalize">{p.category}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-2">Rs. {p.sellingPrice}</p>

                    {/* Stock badge */}
                    <span
                      className={`absolute top-3 right-3 text-xs font-semibold px-1.5 py-0.5 rounded-md ${
                        outOfStock
                          ? "bg-red-100 text-red-600"
                          : lowStock
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {stock}
                    </span>

                    {atLimit && !outOfStock && (
                      <p className="text-xs text-amber-600 mt-1 font-medium">Max in cart</p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right — cart + checkout */}
      <form action={formAction} className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
        <input type="hidden" name="cart" value={cartJson} />

        {/* Cart items */}
        <div className="bg-white rounded-2xl border border-gray-100 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Cart</h2>
          </div>

          {cart.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">Tap a product to add it.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {cart.map((item) => {
                const stock = stockOf(item.product.id);
                const atLimit = item.quantity >= stock;
                return (
                  <div key={item.product.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-400">
                        Rs. {item.product.sellingPrice} · {stock} in stock
                      </p>
                      {atLimit && (
                        <p className="text-xs text-amber-600 font-medium flex items-center gap-1 mt-0.5">
                          <AlertTriangle size={10} />
                          Stock limit reached
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQty(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-md bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 transition-colors flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-sm font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.product.id, item.quantity + 1)}
                        disabled={atLimit}
                        className="w-6 h-6 rounded-md bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <p className="w-16 text-right text-sm font-medium text-gray-900 shrink-0">
                      Rs. {(item.product.sellingPrice * item.quantity).toFixed(0)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {cart.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-3 flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              {discountVal > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Discount</span>
                  <span>− Rs. {discountVal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Customer */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-900">Customer</h2>
          <input
            name="customer_name"
            placeholder="Name (optional)"
            className="w-full bg-white text-gray-900 placeholder:text-gray-400 text-sm px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
          />
          <input
            name="customer_phone"
            placeholder="Phone (optional)"
            className="w-full bg-white text-gray-900 placeholder:text-gray-400 text-sm px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
          />
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-900">Payment</h2>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_MODES.map((mode) => (
              <label key={mode} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="payment_mode"
                  value={mode}
                  defaultChecked={mode === "cash"}
                  className="accent-gray-900"
                />
                <span className="capitalize text-gray-700">{mode}</span>
              </label>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-1 border-t border-gray-100">
            <label className="text-sm font-medium text-gray-700 shrink-0">Discount (Rs.)</label>
            <input
              name="discount"
              type="number"
              min="0"
              step="0.01"
              value={discount}
              onChange={(e) => {
                const v = e.target.value;
                setDiscount(v === "" ? "" : parseFloat(v) || 0);
              }}
              className="w-full text-sm bg-white text-gray-900 px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer pt-1 border-t border-gray-100">
            <input
              type="checkbox"
              checked={isUdhari}
              onChange={(e) => setIsUdhari(e.target.checked)}
              className="w-4 h-4 accent-gray-900"
            />
            <input type="hidden" name="is_udhari" value={String(isUdhari)} />
            <span className="text-sm font-medium text-gray-700">Udhari (credit)</span>
          </label>
        </div>

        {state.error && (
          <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={pending || cart.length === 0}
          className="w-full py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {pending ? "Creating bill…" : `Charge Rs. ${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}
