import { z } from "zod";

import { AUTH_LIMITS } from "../constants/auth-limits";
import { AUTH_MESSAGES, FIELD_LABELS } from "./messages";
import { nameField, emailField, otpField } from "./fields";
import { ruleOf } from "./password-rules";

/** مرحله‌ی ۱ ثبت‌نام — نام، نام خانوادگی، ایمیل. */
export const registerStepOneSchema = z.object({
  firstName: nameField(FIELD_LABELS.firstName),
  lastName: nameField(FIELD_LABELS.lastName),
  email: emailField,
});

/** مرحله‌ی ۲ — کد تایید ایمیل. */
export const registerVerificationSchema = z.object({
  code: otpField,
});

/**
 * مرحله‌ی ۳ — رمز عبور.
 *
 * ⚠️ سخت‌گیری عمداً روی «قدرت» است نه فقط طول: هر چهار قاعده باید برقرار
 * شوند. قواعد از `ruleOf(...)` می‌آیند نه `PASSWORD_RULES[1]` — پس
 * جابه‌جایی ترتیب آرایه هیچ‌وقت اعتبارسنجی را بی‌سروصدا عوض نمی‌کند.
 */
export const registerPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, AUTH_MESSAGES.required(FIELD_LABELS.password))
      .max(
        AUTH_LIMITS.passwordMax,
        AUTH_MESSAGES.maxLength(FIELD_LABELS.password, AUTH_LIMITS.passwordMax),
      )
      .refine(
        (value) => ruleOf("length").test(value),
        AUTH_MESSAGES.passwordWeak(AUTH_LIMITS.passwordMin),
      )
      .refine(
        (value) => ruleOf("case").test(value),
        AUTH_MESSAGES.passwordNeedsUpperAndLower,
      )
      .refine(
        (value) => ruleOf("digit").test(value),
        AUTH_MESSAGES.passwordNeedsNumber,
      )
      .refine(
        (value) => ruleOf("special").test(value),
        AUTH_MESSAGES.passwordNeedsSpecial,
      ),
    confirmPassword: z
      .string()
      .min(1, AUTH_MESSAGES.required(FIELD_LABELS.confirmPassword)),
    acceptedTerms: z.boolean().refine((value) => value, AUTH_MESSAGES.termsRequired),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: AUTH_MESSAGES.passwordMismatch,
    path: ["confirmPassword"],
  });
