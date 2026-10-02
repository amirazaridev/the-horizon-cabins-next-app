"use server";

import { apiFetch } from "@/libs/api/apiFetch";
import { normalizeDigits, normalizeText } from "../schemas";
import type { AuthError, AuthErrorCode } from "../types/auth.types";

/**
 * Server Actions کد تایید (OTP) — لایه‌ی BFF.
 *
 * ⚠️ جریان معماری:
 *   مرورگر → Server Action (اینجا) → Express `/otp/request` و `/otp/verify`
 *
 * چرا Server Action و نه فراخوانی مستقیم از کلاینت؟
 *  - مرورگر هرگز با Express حرف نمی‌زند (BFF)، پس کلید/آدرس API لو نمی‌رود.
 *  - خروجی اکشن دقیقاً همان چیزی است که UI لازم دارد، نه پاسخ خام API.
 */

/** هدف‌های مجاز OTP — آینه‌ی enum بک‌اند. */
export type OtpPurpose = "signup" | "passwordReset" | "login";

/** خروجی اکشن ارسال کد. */
export type RequestOtpActionResult =
  | { ok: true; data: { expiresInSeconds: number; resendAfterSeconds: number } }
  | { ok: false; error: AuthError };

/** خروجی اکشن بررسی کد — `verificationToken` برای ثبت‌نام لازم است. */
export type VerifyOtpActionResult =
  | {
      ok: true;
      data: { verificationToken: string; verificationTokenExpiresInSeconds: number };
    }
  | { ok: false; error: AuthError };

/** شکل پاسخ بک‌اند. */
type ApiEnvelope<T> = {
  status: "success" | "fail" | "error";
  code?: string;
  message?: string;
  data?: T;
};

/**
 * نگاشت کد خطای بک‌اند به کد دامنه‌ی فرانت + فیلد مرتبط.
 *
 * ⚠️ چرا بر اساس `code` بک‌اند و نه فقط status؟
 * چند خطای متفاوت هم‌کد HTTP هستند (مثلاً `OTP_INVALID` و `OTP_EXPIRED`
 * هر دو 400). بدون خواندن `code` نمی‌توانیم پیام/رفتار درست را به کاربر
 * بدهیم (بازیابی تایمر، خطای فیلد کد، پیام «کد جدید بگیر»).
 */
function mapOtpError(status: number, code?: string, message?: string): AuthError {
  let domainCode: AuthErrorCode = "UNKNOWN";

  switch (code) {
    case "OTP_INVALID":
    case "OTP_MAX_ATTEMPTS":
      domainCode = code === "OTP_MAX_ATTEMPTS" ? "TOO_MANY_ATTEMPTS" : "INVALID_CODE";
      break;
    case "OTP_EXPIRED":
    case "OTP_NOT_FOUND":
      domainCode = "CODE_EXPIRED";
      break;
    case "OTP_RESEND_TOO_SOON":
    case "OTP_RATE_LIMITED":
      domainCode = "TOO_MANY_ATTEMPTS";
      break;
    case "DUPLICATE_EMAIL":
      domainCode = "EMAIL_ALREADY_EXISTS";
      break;
    case "OTP_EMAIL_SEND_FAILED":
      domainCode = "NETWORK";
      break;
    default:
      if (status === 429) domainCode = "TOO_MANY_ATTEMPTS";
      else if (status >= 500) domainCode = "NETWORK";
      break;
  }

  const field = domainCode === "EMAIL_ALREADY_EXISTS" ? "email" : "code";

  return {
    code: domainCode,
    message: message ?? "خطای غیرمنتظره رخ داد. دوباره تلاش کنید.",
    field,
  };
}

/**
 * درخواست ارسال کد تایید به ایمیل.
 *
 * @param email ایمیل مقصد (نرمال می‌شود).
 * @param purpose هدف کد — پیش‌فرض ثبت‌نام.
 */
export async function requestOtpAction(
  email: string,
  purpose: OtpPurpose = "signup",
): Promise<RequestOtpActionResult> {
  let res: Response;
  try {
    res = await apiFetch("otp/request", {
      method: "POST",
      body: JSON.stringify({
        email: normalizeText(email).toLowerCase(),
        purpose,
      }),
      cache: "no-store",
    });
  } catch {
    return { ok: false, error: { code: "NETWORK", message: "ارتباط با سرور برقرار نشد." } };
  }

  const json = (await res.json().catch(() => null)) as ApiEnvelope<{
    expiresInSeconds: number;
    resendAfterSeconds: number;
  }> | null;

  if (!res.ok || !json || json.status !== "success" || !json.data) {
    return {
      ok: false,
      error: mapOtpError(res.status, json?.code, json?.message),
    };
  }

  return { ok: true, data: json.data };
}

/**
 * بررسی کد تایید. در صورت موفقیت، توکن یک‌بارمصرف ثبت‌نام برمی‌گردد.
 *
 * @param email ایمیل مقصد.
 * @param code کد ۶ رقمی (ارقام فارسی هم پذیرفته و نرمال می‌شوند).
 * @param purpose هدف کد — پیش‌فرض ثبت‌نام.
 */
export async function verifyOtpAction(
  email: string,
  code: string,
  purpose: OtpPurpose = "signup",
): Promise<VerifyOtpActionResult> {
  let res: Response;
  try {
    res = await apiFetch("otp/verify", {
      method: "POST",
      body: JSON.stringify({
        email: normalizeText(email).toLowerCase(),
        purpose,
        code: normalizeDigits(code).trim(),
      }),
      cache: "no-store",
    });
  } catch {
    return { ok: false, error: { code: "NETWORK", message: "ارتباط با سرور برقرار نشد." } };
  }

  const json = (await res.json().catch(() => null)) as ApiEnvelope<{
    verificationToken: string;
    verificationTokenExpiresInSeconds: number;
  }> | null;

  if (!res.ok || !json || json.status !== "success" || !json.data) {
    return {
      ok: false,
      error: mapOtpError(res.status, json?.code, json?.message),
    };
  }

  return { ok: true, data: json.data };
}
