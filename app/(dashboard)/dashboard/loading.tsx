export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-48 bg-stone-200 rounded-lg mb-1.5" />
      <div className="h-4 w-28 bg-stone-100 rounded mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-100 p-5 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-stone-100 rounded-t-2xl" />
            <div className="flex items-center justify-between mb-4">
              <div className="h-3 w-20 bg-stone-100 rounded" />
              <div className="w-8 h-8 bg-stone-100 rounded-lg" />
            </div>
            <div className="h-8 w-28 bg-stone-200 rounded mb-2" />
            <div className="h-3 w-14 bg-stone-100 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-100 p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="h-4 w-32 bg-stone-200 rounded" />
              <div className="h-3 w-14 bg-stone-100 rounded" />
            </div>
            {[...Array(4)].map((_, j) => (
              <div key={j} className="flex items-center gap-3 mb-3.5">
                <div className="w-5 h-5 bg-stone-100 rounded-full shrink-0" />
                <div className="flex-1 h-4 bg-stone-100 rounded" />
                <div className="w-20 h-4 bg-stone-100 rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
