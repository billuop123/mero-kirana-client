"use client";

import { useActionState } from "react";
import { restockProductAction, ProductFormState } from "@/lib/actions/product";

type Props = { productId: string };

export default function RestockForm({ productId }: Props) {
  const action = restockProductAction.bind(null, productId);
  const [state, formAction, pending] = useActionState(action, {} as ProductFormState);

  return (
    <form action={formAction} className="flex items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
          Add stock quantity
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min="0.01"
          step="0.01"
          required
          placeholder="e.g. 50"
          className="w-36 bg-white text-gray-900 placeholder:text-gray-400 text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {pending ? "Adding…" : "Add stock"}
      </button>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
