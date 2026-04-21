"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays } from "lucide-react";

function todayLocal() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kathmandu" }).format(new Date());
}

export default function DateFilter({ current }: { current: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const today = todayLocal();

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = new URLSearchParams(params.toString());
    if (e.target.value) {
      next.set("date", e.target.value);
    } else {
      next.delete("date");
    }
    next.delete("page");
    router.push(`/dashboard/bills?${next.toString()}`);
  }

  return (
    <div className="relative flex items-center">
      <CalendarDays size={15} className="absolute left-3 text-gray-400 pointer-events-none" />
      <input
        type="date"
        value={current}
        max={today}
        onChange={onChange}
        className="pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
      />
    </div>
  );
}
