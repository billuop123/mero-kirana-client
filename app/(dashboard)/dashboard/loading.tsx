export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Page title */}
      <div className="h-7 w-40 bg-gray-200 rounded-lg mb-8" />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-2xl p-5 flex flex-col gap-3">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-8 w-32 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Table rows */}
      <div className="bg-gray-100 rounded-2xl p-5 flex flex-col gap-4">
        <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 flex-1 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
