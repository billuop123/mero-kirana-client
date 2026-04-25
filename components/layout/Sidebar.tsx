"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  Receipt,
  Package,
  Warehouse,
  HandCoins,
  BarChart2,
  Settings,
  LogOut,
  ShoppingBag,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/dashboard/bills", label: "Bills", Icon: Receipt },
  { href: "/dashboard/products", label: "Products", Icon: Package },
  { href: "/dashboard/inventory", label: "Inventory", Icon: Warehouse },
  { href: "/dashboard/udhari", label: "Udhari", Icon: HandCoins },
  { href: "/dashboard/reports", label: "Reports", Icon: BarChart2 },
  { href: "/dashboard/settings", label: "Settings", Icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 flex flex-col bg-[#1c1917] min-h-screen">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-[#292524]">
        <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
          <ShoppingBag size={14} className="text-white" />
        </div>
        <span className="font-bold text-sm tracking-tight text-white">
          आफ्नो Kirana
        </span>
      </div>

      {/* New Bill — primary action */}
      <div className="px-3 pt-4 pb-1">
        <Link
          href="/dashboard/bills/new"
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.97] transition-all"
        >
          <Plus size={15} />
          New Bill
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5">
        {nav.map(({ href, label, Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[#292524] text-orange-400"
                  : "text-stone-400 hover:bg-[#292524] hover:text-stone-200"
              }`}
            >
              <Icon size={15} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-[#292524]">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-stone-500 hover:bg-[#292524] hover:text-stone-300 transition-colors"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
