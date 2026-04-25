export default function SettingsLoading() {
  return (
    <div className="animate-pulse max-w-lg">
      <div className="mb-8">
        <div className="h-7 w-20 bg-stone-200 rounded-lg mb-1.5" />
        <div className="h-4 w-40 bg-stone-100 rounded" />
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 p-6">
        <div className="h-5 w-28 bg-stone-200 rounded mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={i === 0 ? "sm:col-span-2" : ""}>
              <div className="h-3 w-20 bg-stone-100 rounded mb-2" />
              <div className="h-10 w-full bg-stone-100 rounded-lg" />
            </div>
          ))}
        </div>
        <div className="h-9 w-24 bg-stone-200 rounded-lg mt-6" />
      </div>
    </div>
  );
}
