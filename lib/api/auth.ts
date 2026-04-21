import { apiRequest } from "./client";
import { User } from "@/lib/types";

export function signup(email: string, password: string): Promise<User> {
  return apiRequest<User>("/users/signup", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}

export function signin(email: string, password: string): Promise<string> {
  return apiRequest<string>("/users/signin", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}
