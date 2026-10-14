import "server-only";
import { getRawToken } from "@/features/auth/services/session.service";

const API_URL = process.env.API_URL;

export async function authFetch(endpoint: string, options?: RequestInit) {
  const token = await getRawToken();

  const headers = new Headers(options?.headers);
  if (token) {
    headers.set("Cookie", `jwt=${token}`);
  }

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
}
