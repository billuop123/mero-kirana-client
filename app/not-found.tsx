import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <Link href="/" className="flex items-center gap-2.5 mb-12">
        <ShoppingCart size={20} className="text-gray-900" />
        <span className="font-bold text-lg tracking-tight">आफ्नो Kirana</span>
      </Link>

      <p className="text-8xl font-extrabold text-gray-100 select-none leading-none mb-6">404</p>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-sm text-gray-400 mb-8 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>

      <div className="flex gap-3">
        <Link
          href="/dashboard"
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors"
        >
          Go to dashboard
        </Link>
        <Link
          href="/"
          className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
