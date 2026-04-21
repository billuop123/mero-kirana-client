"use client";

import { useRouter, useSearchParams } from "next/navigation";

const PERIODS = [
  { value: "daily", label: "Today" },
  { value: "weekly", label: "This week" },
  { value: "monthly", label: "This month" },
];

export default function PeriodSelector({ current }: { current: string }) {
  const router = useRouter();
  const params = useSearchParams();

  function select(period: string) {
    const next = new URLSearchParams(params.toString());
    next.set("period", period);
    router.push(`/dashboard/reports?${next.toString()}`);
  }

  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          type="button"
          onClick={() => select(p.value)}
          className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
            current === p.value
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
