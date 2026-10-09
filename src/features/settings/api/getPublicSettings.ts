import { apiFetch } from "@/libs/api/apiFetch";
import type { ApiResponse } from "@/types/api-response";
import {
  FALLBACK_PUBLIC_SETTINGS,
  type PublicSettings,
} from "../types/public-settings.types";

/**
 * تنظیمات عمومی را از بک‌اند می‌خواند (`GET /settings/public`، بدون احراز هویت).
 *
 * ⚠️ نتیجه کش می‌شود (۵ دقیقه + تگ) چون این مقادیر فقط با `PATCH /settings`
 * توسط owner عوض می‌شوند و در هر رندر دوباره خواندنشان بی‌دلیل است.
 *
 * ⚠️ در خطای شبکه یا پاسخ نامعتبر به `FALLBACK_PUBLIC_SETTINGS` برمی‌گردیم
 * تا صفحه‌ی جزئیات کابین همچنان رندر شود؛ در آن حالت تقویم با افق پیش‌فرض
 * کار می‌کند و مسیر رزرو در سرور هم دوباره اعتبارسنجی می‌شود.
 */
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
