import "server-only";
import { getRawToken } from "@/features/auth/services/session.service";

const API_URL = process.env.API_URL;

/**
 * fetch احراز هویت‌شده به بک‌اند.
 *
 * توکن از کوکی سرور (که خودِ BFF ست کرده) خوانده و به‌شکل هدر
 * `Cookie: jwt=<token>` به Express فرستاده می‌شود — دقیقاً همان چیزی که
 * `protect` در بک‌اند انتظار دارد.
 */
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
