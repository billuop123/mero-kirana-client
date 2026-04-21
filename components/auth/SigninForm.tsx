"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signinAction, AuthState } from "@/lib/actions/auth";

const initial: AuthState = {};

export default function SigninForm() {
  const [state, action, pending] = useActionState(signinAction, initial);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full bg-white text-gray-900 placeholder:text-gray-400 text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Your password"
          className="w-full bg-white text-gray-900 placeholder:text-gray-400 text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all"
        />
      </div>

      {state.error && (
        <div className="flex items-start gap-2.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3">
          <span className="shrink-0 mt-0.5">⚠</span>
          <span>{state.error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-gray-900 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
