import { apiFetch } from "@/libs/api/apiFetch";
import type { ApiResponse } from "@/types/api-response";
import {
  FALLBACK_PUBLIC_SETTINGS,
  type PublicSettings,
} from "../types/public-settings.types";

export async function getPublicSettings(): Promise<PublicSettings> {
  try {
    const res = await apiFetch("settings/public", {
      cache: "force-cache",
      next: { revalidate: 300, tags: ["public-settings"] },
    });

    if (!res.ok) return FALLBACK_PUBLIC_SETTINGS;

    const json = (await res.json()) as ApiResponse<"settings", PublicSettings>;
    if (json.status !== "success") return FALLBACK_PUBLIC_SETTINGS;

    // ادغام با پیش‌فرض‌ها: اگر سرور فیلدی را نداشت، مقدار امن می‌ماند.
    return { ...FALLBACK_PUBLIC_SETTINGS, ...json.data.settings };
  } catch {
    return FALLBACK_PUBLIC_SETTINGS;
  }
}
