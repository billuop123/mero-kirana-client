import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API = process.env.API_URL ?? "http://localhost:4000/v1";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const cookieStore = await cookies();
  const storedState = cookieStore.get("oauth_state")?.value;
  cookieStore.delete("oauth_state");

  if (errorParam || !code || !state || state !== storedState) {
    return NextResponse.redirect(new URL("/signin?error=1", appUrl));
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${appUrl}/api/auth/callback/google`,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/signin?error=1", appUrl));
  }

  const { access_token } = await tokenRes.json();

  // Get user info from Google
  const userRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!userRes.ok) {
    return NextResponse.redirect(new URL("/signin?error=1", appUrl));
  }

  const { email, name } = await userRes.json();

  if (!email) {
    return NextResponse.redirect(new URL("/signin?error=1", appUrl));
  }

  // Find or create user in Go backend, receive JWT
  const authRes = await fetch(`${API}/users/google-auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Secret": process.env.INTERNAL_API_SECRET!,
    },
    body: JSON.stringify({ email, name: name ?? "" }),
  });

  if (!authRes.ok) {
    return NextResponse.redirect(new URL("/signin?error=1", appUrl));
  }

  const { data: token } = await authRes.json();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.redirect(new URL("/dashboard", appUrl));
}
