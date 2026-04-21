import type { Metadata } from "next";
import Link from "next/link";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your आफ्नो Kirana shop dashboard.",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ error?: string }> };

export default async function SignInPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div>
      {/* Mobile logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
        <span className="text-xl">🛒</span>
        <span className="font-bold text-sm tracking-tight text-gray-900">आफ्नो Kirana</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-1.5">Sign in to your shop dashboard.</p>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-2.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3">
          <span className="shrink-0 mt-0.5">⚠</span>
          <span>Sign-in failed. Please try again.</span>
        </div>
      )}

      <GoogleSignInButton />
    </div>
  );
}
