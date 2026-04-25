export default function ProductsLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-7 w-24 bg-stone-200 rounded-lg mb-1.5" />
          <div className="h-4 w-40 bg-stone-100 rounded" />
        </div>
        <div className="h-9 w-28 bg-stone-200 rounded-lg" />
      </div>

      <div className="mb-4">
        <div className="h-9 w-72 bg-stone-100 rounded-lg" />
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-stone-50 flex gap-6">
          {[100, 80, 60, 60, 50, 40].map((w, i) => (
            <div key={i} className="h-3 bg-stone-100 rounded" style={{ width: w }} />
          ))}
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-5 py-3.5 border-b border-stone-50">
            <div className="h-4 flex-1 bg-stone-100 rounded" />
            <div className="h-4 w-16 bg-stone-100 rounded" />
            <div className="h-4 w-16 bg-stone-100 rounded" />
            <div className="h-4 w-20 bg-stone-100 rounded" />
            <div className="h-4 w-12 bg-stone-100 rounded" />
            <div className="h-4 w-10 bg-stone-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
