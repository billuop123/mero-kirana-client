import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/utils/auth";
import ShopForm from "@/components/settings/ShopForm";
import { Shop } from "@/lib/types";

const API = process.env.API_URL ?? "http://localhost:4000/v1";

export default async function SettingsPage() {
  const token = await getServerToken();
  if (!token) redirect("/signin");

  const res = await fetch(`${API}/shops/me`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 0 },
  });

  const shop: Shop | null = res.ok ? (await res.json()).data : null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Shop Settings</h1>
        <p className="text-sm text-gray-400 mt-1">
          {shop ? "Update your shop details." : "Set up your shop to get started."}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <ShopForm shop={shop} />
      </div>
    </div>
  );
}
