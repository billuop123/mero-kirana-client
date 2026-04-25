export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — branding panel */}
      <div className="hidden lg:flex flex-col justify-between bg-[#0f0a05] text-white p-12 relative overflow-hidden">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />

        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 opacity-[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2.5 relative">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <span className="text-sm">🛒</span>
          </div>
          <span className="font-bold text-lg tracking-tight">आफ्नो Kirana</span>
        </div>

        <div className="relative">
          <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Nepal&apos;s kirana tool
          </p>
          <blockquote className="text-2xl font-semibold leading-snug mb-4 text-stone-100">
            &ldquo;Finally a POS that doesn&apos;t need a training manual.&rdquo;
          </blockquote>
          <p className="text-stone-500 text-sm">— Ramesh, kirana owner, Pokhara</p>
        </div>

        <ul className="flex flex-col gap-3.5 text-sm relative">
          {[
            "Bill customers in under 30 seconds",
            "Track inventory & low-stock alerts",
            "Manage udhari with ease",
            "Daily, weekly & monthly reports",
          ].map((f) => (
            <li key={f} className="flex items-center gap-3 text-stone-300">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center bg-stone-50 px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
