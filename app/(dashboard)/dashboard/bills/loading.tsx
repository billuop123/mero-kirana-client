export default function BillsLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-7 w-16 bg-stone-200 rounded-lg mb-1.5" />
          <div className="h-4 w-36 bg-stone-100 rounded" />
        </div>
        <div className="h-9 w-24 bg-stone-200 rounded-lg" />
      </div>

      <div className="flex gap-2 mb-5">
        <div className="h-9 w-24 bg-stone-200 rounded-lg" />
        <div className="h-9 w-24 bg-stone-100 rounded-lg" />
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-stone-50 flex gap-6">
          {[80, 120, 60, 60, 48].map((w, i) => (
            <div key={i} className={`h-3 bg-stone-100 rounded`} style={{ width: w }} />
          ))}
        </div>
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-5 py-3.5 border-b border-stone-50">
            <div className="h-4 w-20 bg-stone-100 rounded" />
            <div className="h-4 flex-1 bg-stone-100 rounded" />
            <div className="h-4 w-16 bg-stone-100 rounded" />
            <div className="h-5 w-14 bg-stone-100 rounded-full" />
            <div className="h-4 w-12 bg-stone-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
