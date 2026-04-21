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
  ShoppingCart,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/dashboard/bills/new", label: "New Bill", Icon: Plus, highlight: true },
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
    <aside className="w-60 shrink-0 flex flex-col bg-white border-r border-gray-100 min-h-screen">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-gray-100">
        <ShoppingCart size={18} className="text-gray-900" />
        <span className="font-bold text-sm tracking-tight text-gray-900">आफ्नो Kirana</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {nav.map(({ href, label, Icon, highlight }) => {
          const active =
            href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

          if (highlight) {
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700 transition-colors mt-1 mb-1"
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={15} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-gray-100">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
