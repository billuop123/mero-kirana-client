export default function UdhariLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8">
        <div className="h-7 w-20 bg-stone-200 rounded-lg mb-1.5" />
        <div className="h-4 w-48 bg-stone-100 rounded" />
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-stone-50 flex gap-6">
          {[100, 80, 60, 80].map((w, i) => (
            <div key={i} className="h-3 bg-stone-100 rounded" style={{ width: w }} />
          ))}
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-5 py-4 border-b border-stone-50">
            <div className="h-4 flex-1 bg-stone-100 rounded" />
            <div className="h-4 w-24 bg-stone-100 rounded" />
            <div className="h-4 w-16 bg-stone-100 rounded" />
            <div className="h-4 w-20 bg-stone-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
