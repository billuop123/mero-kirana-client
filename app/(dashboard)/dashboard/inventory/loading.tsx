export default function InventoryLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-7 w-24 bg-stone-200 rounded-lg mb-1.5" />
          <div className="h-4 w-44 bg-stone-100 rounded" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-stone-50 flex gap-6">
          {[120, 80, 80, 60, 60].map((w, i) => (
            <div key={i} className="h-3 bg-stone-100 rounded" style={{ width: w }} />
          ))}
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-5 py-3.5 border-b border-stone-50">
            <div className="h-4 flex-1 bg-stone-100 rounded" />
            <div className="h-4 w-20 bg-stone-100 rounded" />
            <div className="h-4 w-20 bg-stone-100 rounded" />
            <div className="h-5 w-16 bg-stone-100 rounded-full" />
            <div className="h-4 w-16 bg-stone-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
