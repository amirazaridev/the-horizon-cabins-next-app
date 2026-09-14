import "server-only";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL;

export async function authFetch(endpoint: string, options?: RequestInit) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")!.value;

  return fetch(API_URL + endpoint, {
    ...options,
    headers: { ...options?.headers, Cookie: `jwt=${accessToken}` },
  });
}
