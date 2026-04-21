"use client";

import { useActionState } from "react";
import { saveShopAction, ShopFormState } from "@/lib/actions/shop";
import { Shop } from "@/lib/types";

const initial: ShopFormState = {};

type Props = { shop: Shop | null };

export default function ShopForm({ shop }: Props) {
  const [state, action, pending] = useActionState(saveShopAction, initial);

  return (
    <form action={action} className="flex flex-col gap-5 max-w-lg">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Shop name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={shop?.name ?? ""}
          placeholder="e.g. Sharma Kirana Pasal"
          className="w-full bg-white text-gray-900 placeholder:text-gray-400 text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="address" className="text-sm font-medium text-gray-700">
          Address <span className="text-red-500">*</span>
        </label>
        <input
          id="address"
          name="address"
          type="text"
          required
          defaultValue={shop?.address ?? ""}
          placeholder="e.g. Lakeside, Pokhara"
          className="w-full bg-white text-gray-900 placeholder:text-gray-400 text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={shop?.phone ?? ""}
          placeholder="10-digit number"
          className="w-full bg-white text-gray-900 placeholder:text-gray-400 text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="panNo" className="text-sm font-medium text-gray-700">
          PAN number
        </label>
        <input
          id="panNo"
          name="panNo"
          type="text"
          defaultValue={shop?.panNO ?? ""}
          placeholder="e.g. 123456789"
          className="w-full bg-white text-gray-900 placeholder:text-gray-400 text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all"
        />
      </div>

      {state.error && (
        <div className="flex items-start gap-2.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3">
          <span className="shrink-0 mt-0.5">⚠</span>
          <span>{state.error}</span>
        </div>
      )}

      {state.success && (
        <div className="flex items-center gap-2.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3.5 py-3">
          <span>✓</span>
          <span>Shop details saved.</span>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {pending ? "Saving…" : shop ? "Save changes" : "Create shop"}
      </button>
    </form>
  );
}
