"use client";

import { useActionState } from "react";
import { ProductFormState } from "@/lib/actions/product";
import { Product, ProductCategory } from "@/lib/types";

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "grocery", label: "Grocery" },
  { value: "dairy", label: "Dairy" },
  { value: "beverages", label: "Beverages" },
  { value: "snacks", label: "Snacks" },
  { value: "household", label: "Household" },
  { value: "personal_care", label: "Personal Care" },
  { value: "tobacco", label: "Tobacco" },
  { value: "frozen", label: "Frozen" },
];

const UNITS = ["piece", "kg", "g", "liter", "ml", "packet", "box", "dozen", "bag"];

type Props = {
  product?: Product;
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;
};

const inputClass =
  "w-full bg-white text-gray-900 placeholder:text-gray-400 text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all";

export default function ProductForm({ product, action }: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* Name + Barcode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Product name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={product?.name}
            placeholder="e.g. Tata Salt"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="barcode" className="text-sm font-medium text-gray-700">
            Barcode
          </label>
          <input
            id="barcode"
            name="barcode"
            defaultValue={product?.barcode}
            placeholder="Scan or type barcode"
            className={inputClass}
          />
        </div>
      </div>

      {/* Category + Unit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={product?.category ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Select category
            </option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="unit" className="text-sm font-medium text-gray-700">
            Unit <span className="text-red-500">*</span>
          </label>
          <select
            id="unit"
            name="unit"
            required
            defaultValue={product?.unit ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Select unit
            </option>
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="selling_price" className="text-sm font-medium text-gray-700">
            Selling price (Rs.) <span className="text-red-500">*</span>
          </label>
          <input
            id="selling_price"
            name="selling_price"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={product?.sellingPrice}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cost_price" className="text-sm font-medium text-gray-700">
            Cost price (Rs.) <span className="text-red-500">*</span>
          </label>
          <input
            id="cost_price"
            name="cost_price"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={product?.costPrice}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
      </div>

      {/* Initial quantity — only shown when creating a new product */}
      {!product && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="initial_quantity" className="text-sm font-medium text-gray-700">
            Opening stock quantity
          </label>
          <input
            id="initial_quantity"
            name="initial_quantity"
            type="number"
            min="0"
            step="0.01"
            defaultValue={0}
            placeholder="0"
            className={inputClass}
          />
          <p className="text-xs text-gray-400">Current stock on hand. You can restock later.</p>
        </div>
      )}

      {/* VAT + Low stock threshold */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="vat_rate" className="text-sm font-medium text-gray-700">
            VAT rate (%)
          </label>
          <input
            id="vat_rate"
            name="vat_rate"
            type="number"
            min="0"
            max="100"
            step="0.01"
            defaultValue={product?.vatRate ?? 0}
            placeholder="0"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="low_stock_threshold" className="text-sm font-medium text-gray-700">
            Low stock alert at
          </label>
          <input
            id="low_stock_threshold"
            name="low_stock_threshold"
            type="number"
            min="0"
            defaultValue={product?.lowStockThreshold ?? 5}
            placeholder="5"
            className={inputClass}
          />
        </div>
      </div>

      {state.error && (
        <div className="flex items-start gap-2.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3">
          <span className="shrink-0 mt-0.5">⚠</span>
          <span>{state.error}</span>
        </div>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {pending ? "Saving…" : product ? "Save changes" : "Add product"}
        </button>
        <a
          href="/dashboard/products"
          className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
