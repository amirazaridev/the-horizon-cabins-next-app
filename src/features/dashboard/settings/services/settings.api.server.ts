import "server-only";

import { authFetch } from "@/libs/api/authFetch";
import type { AppSettings } from "../types/settings.types";

export async function fetchSettings(): Promise<AppSettings> {
  const res = await authFetch("settings", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`دریافت تنظیمات ناموفق بود (HTTP ${res.status}).`);
  }

  const json = (await res.json()) as { data?: { settings?: AppSettings } };
  if (!json.data?.settings) {
    throw new Error("پاسخ تنظیمات نامعتبر بود.");
  }

  return json.data.settings;
}
