/**
 * نقطه‌ی ورود ماژول اعتبارسنجی احراز هویت.
 *
 * ماژول به بخش‌های تک‌مسئولیتی شکسته شده و این فایل API عمومی را یک‌جا
 * جمع می‌کند؛ پس مصرف‌کننده‌ها فقط با `../schemas` حرف می‌زنند و به نام
 * فایل‌های داخلی وابسته نمی‌شوند.
 *
 * چیدمان:
 *   normalize.ts      → پاک‌سازی ورودی (ارقام فارسی، «ی/ك» عربی)
 *   messages.ts       → پیام‌های فارسی + برچسب فیلدها
 *   patterns.ts       → regexها
 *   password-rules.ts → قواعد قدرت رمز + قدرت‌سنج
 *   fields.ts         → سازنده‌های فیلد (name/email/otp)
 *   register.ts       → اسکیماهای مرحله‌ای ثبت‌نام
 *   register-full.ts  → اسکیمای کامل + اعتبارسنجی سرور
 *   login.ts          → ورود و فراموشی رمز
 *   types.ts          → تایپ‌های مشتق zod
 */

export { normalizeDigits, normalizeText, digitsOnly } from "./normalize";
export { AUTH_MESSAGES, FIELD_LABELS, faNumber } from "./messages";
/**
 * `AUTH_LIMITS` واقعاً در `constants/auth-limits.ts` زندگی می‌کند (چون هم
 * اسکیما و هم UI از آن می‌خوانند)، اما این‌جا هم صادر می‌شود تا مصرف‌کننده
 * فقط یک نقطه‌ی ورود داشته باشد.
 */
export {
  AUTH_LIMITS,
  PASSWORD_STRENGTH_SEGMENTS,
  faCount,
} from "../constants/auth-limits";
export {
  NAME_PATTERN,
  EMAIL_PATTERN,
  ASCII_PRINTABLE_PATTERN,
  DIGITS_ONLY_PATTERN,
} from "./patterns";
export {
  PASSWORD_RULES,
  STRENGTH_SEGMENTS,
  getPasswordStrength,
  ruleOf,
  type PasswordRuleId,
  type PasswordStrength,
} from "./password-rules";
export { nameField, emailField, otpField } from "./fields";
export {
  registerStepOneSchema,
  registerVerificationSchema,
  registerPasswordSchema,
} from "./register";
export {
  registerSchema,
  validateEmail,
  validatePassword,
} from "./register-full";
export { loginSchema, forgotPasswordSchema } from "./login";
export type {
  ForgotPasswordValues,
  LoginFormValues,
  RegisterFormValues,
  RegisterPasswordValues,
  RegisterStepOneValues,
  RegisterVerificationValues,
} from "./types";
