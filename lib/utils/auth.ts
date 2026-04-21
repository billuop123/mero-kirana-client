import { cookies } from "next/headers";

/** Read JWT from httpOnly cookie — server components, actions, route handlers only. */
export async function getServerToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get("token")?.value;
}
