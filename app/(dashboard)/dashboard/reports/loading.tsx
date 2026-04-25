export default function ReportsLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-7 w-20 bg-stone-200 rounded-lg mb-1.5" />
          <div className="h-4 w-36 bg-stone-100 rounded" />
        </div>
        <div className="h-9 w-32 bg-stone-100 rounded-lg" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="h-3 w-16 bg-stone-100 rounded" />
              <div className="w-8 h-8 bg-stone-100 rounded-lg" />
            </div>
            <div className="h-7 w-24 bg-stone-200 rounded mb-1.5" />
            <div className="h-3 w-12 bg-stone-100 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-100 p-5">
            <div className="h-4 w-36 bg-stone-200 rounded mb-5" />
            {[...Array(5)].map((_, j) => (
              <div key={j} className="flex gap-4 mb-3.5">
                <div className="flex-1 h-4 bg-stone-100 rounded" />
                <div className="w-16 h-4 bg-stone-100 rounded" />
                <div className="w-12 h-4 bg-stone-100 rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
