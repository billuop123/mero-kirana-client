"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/v1";

export type AuthState = {
  error?: string;
};

export async function signupAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  // Create account
  const signupRes = await fetch(`${API}/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!signupRes.ok) {
    const body = await signupRes.json().catch(() => ({}));
    return { error: body.error ?? "Signup failed. Try a different email." };
  }

  redirect("/signin");
}

export async function signinAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const res = await fetch(`${API}/users/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return { error: "Invalid email or password." };
  }

  const { data: token } = await res.json();

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24h — matches server JWT expiry
  });

  redirect("/dashboard");
}
