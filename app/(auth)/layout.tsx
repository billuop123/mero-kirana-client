export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — branding panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gray-900 text-white p-12">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛒</span>
          <span className="font-bold text-lg tracking-tight">आफ्नो Kirana</span>
        </div>

        <div>
          <blockquote className="text-2xl font-semibold leading-snug mb-4">
            "Finally a POS that doesn't need a training manual."
          </blockquote>
          <p className="text-gray-400 text-sm">— Ramesh, kirana owner, Pokhara</p>
        </div>

        <ul className="flex flex-col gap-3 text-sm text-gray-300">
          {[
            "Bill customers in under 30 seconds",
            "Track inventory & low-stock alerts",
            "Manage udhari with ease",
            "Daily, weekly & monthly reports",
          ].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
