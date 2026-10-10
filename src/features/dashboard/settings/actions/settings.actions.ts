"use server";

import { revalidatePath } from "next/cache";

import { authFetch } from "@/libs/api/authFetch";
import type { AppSettings, SettingsColumns } from "../types/settings.types";

/**
 * Server Action ذخیره‌ی تنظیمات — `PATCH /settings` (فقط owner).
 *
 * ⚠️ اعتبارسنجی سمت کلاینت (`lib/settings-validation.ts`) فقط برای بازخورد
 * سریع است؛ اعتبارسنجی نهایی و الزام‌آور سمت بک‌اند انجام می‌شود. اینجا
 * خطاهای بک‌اند به پیام فارسی قابل‌فهم نگاشت می‌شوند.
 */

export interface SettingsActionResult {
  success: boolean;
  message: string;
  /** خطاهای فیلدی برگشتی از بک‌اند (اگر Zod سمت سرور رد کند). */
  fieldErrors?: Record<string, string>;
  /** تنظیمات تازه — برای هم‌گام‌کردن فرم پس از ذخیره. */
  settings?: AppSettings;
}

interface ApiErrorBody {
  code?: string;
  message?: string;
  errors?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** خطاهای Zod بک‌اند (`errors: [{field, code, message}]`) → نگاشت فیلد. */
function extractFieldErrors(errors: unknown): Record<string, string> | undefined {
  if (!Array.isArray(errors)) return undefined;

  const map: Record<string, string> = {};
  for (const item of errors) {
    if (!isRecord(item)) continue;
    const field = typeof item.field === "string" ? item.field : "";
    if (field) map[field] = "مقدار وارد‌شده برای این فیلد مجاز نیست.";
  }

  return Object.keys(map).length > 0 ? map : undefined;
}

/** آیا پاسخ، «داده‌ی موجود متخلف» را گزارش کرده؟ (`errors.offenders`) */
function hasOffenders(errors: unknown): boolean {
  return isRecord(errors) && "offenders" in errors;
}

/** پیام فارسی برای خطاهای شناخته‌شده‌ی تنظیمات. */
function failureMessage(body: ApiErrorBody | null): string {
  if (hasOffenders(body?.errors)) {
    return "این تنظیمات، داده‌های موجود را نامعتبر می‌کند؛ ابتدا موارد متخلف را اصلاح کنید.";
  }

  switch (body?.code) {
    case "VALIDATION_ERROR":
      return "مقادیر ارسالی نامعتبر است.";
    case "SETTINGS_INVALID":
      return "مقادیر تنظیمات با قواعد سازگاری مطابقت ندارند.";
    default:
      return "ذخیره‌ی تنظیمات ناموفق بود.";
  }
}

/** ذخیره‌ی تغییرات تنظیمات (فقط فیلدهای تغییرکرده). */
export async function updateSettingsAction(
  payload: Partial<SettingsColumns>,
): Promise<SettingsActionResult> {
  if (Object.keys(payload).length === 0) {
    return { success: false, message: "تغییری برای ذخیره وجود ندارد." };
  }

  try {
    const res = await authFetch("settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const body = (await res.json().catch(() => null)) as
      | (ApiErrorBody & { data?: { settings?: AppSettings } })
      | null;

    if (!res.ok) {
      return {
        success: false,
        message: failureMessage(body),
        fieldErrors: extractFieldErrors(body?.errors),
      };
    }

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "تنظیمات با موفقیت ذخیره شد.",
      settings: body?.data?.settings,
    };
  } catch {
    return { success: false, message: "ارتباط با سرور برقرار نشد." };
  }
}
