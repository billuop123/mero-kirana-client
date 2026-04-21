const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://afno-kirana-6mlf3.ondigitalocean.app/v1";

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  token?: string; // pass explicitly from server components / actions
};

export async function apiRequest<T>(
  path: string,
  { method = "GET", body, auth = true, token }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error ?? "Something went wrong");
  }

  return json.data as T;
}
