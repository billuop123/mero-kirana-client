import Link from "next/link";
import { Store } from "lucide-react";

export default function NoShopPrompt() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
        <Store size={24} className="text-gray-400" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-gray-900">No shop set up yet</h2>
        <p className="text-sm text-gray-400 mt-1 max-w-xs">
          Create your shop in Settings before you can manage bills, products, and inventory.
        </p>
      </div>
      <Link
        href="/dashboard/settings"
        className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors"
      >
        Set up your shop →
      </Link>
    </div>
  );
}
