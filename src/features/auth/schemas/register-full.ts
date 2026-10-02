import { z } from "zod";

import { registerPasswordSchema, registerStepOneSchema, registerVerificationSchema } from "./register";
import { emailField } from "./fields";
import { AUTH_LIMITS } from "../constants/auth-limits";
import { AUTH_MESSAGES, FIELD_LABELS } from "./messages";

/**
 * اسکیمای کامل ثبت‌نام — برای اعتبارسنجی نهایی قبل از ارسال.
 *
 * ⚠️ رمز و تکرار رمز عمداً در این‌جا فقط «رشته» تعریف می‌شوند و سخت‌گیری
 * واقعی از `registerPasswordSchema` قرض گرفته می‌شود. دلیلش این است که
 * `merge` کردن یک اسکیمای `refine`-دار، خطاها را بی‌مسیر می‌کند؛ اینجا
 * در یک `superRefine` نتیجه‌ی اسکیمای رمز را کپی می‌کنیم تا پیام‌ها و
 * مسیر خطاها دقیقاً مثل خودش بمانند.
 */
export const registerSchema = registerStepOneSchema
  .merge(registerVerificationSchema)
  .merge(
    z.object({
      password: z.string(),
      confirmPassword: z.string(),
    }),
  )
  .superRefine((values, ctx) => {
    const passwordResult = registerPasswordSchema.safeParse({
      password: values.password,
      confirmPassword: values.confirmPassword,
      acceptedTerms: true,
    });

    if (passwordResult.success) return;
    for (const issue of passwordResult.error.issues) {
      ctx.addIssue({ ...issue, path: issue.path });
    }
  });

/**
 * اعتبارسنجی سبک برای سرور (route handler) — بدون وابستگی به کامپوننت.
 * خروجی: پیام خطای فارسی یا `null` در صورت معتبر بودن.
 */
export function validateEmail(value: string): string | null {
  const result = emailField.safeParse(value);
  return result.success ? null : (result.error.issues[0]?.message ?? null);
}

export function validatePassword(value: string): string | null {
  const result = z
    .string()
    .min(1, AUTH_MESSAGES.required(FIELD_LABELS.password))
    .min(
      AUTH_LIMITS.passwordMin,
      AUTH_MESSAGES.passwordWeak(AUTH_LIMITS.passwordMin),
    )
    .safeParse(value);
  return result.success ? null : (result.error.issues[0]?.message ?? null);
}
