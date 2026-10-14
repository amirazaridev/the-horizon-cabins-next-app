import { formatCurrency } from "@/libs/utils/format";

export const AUTH_LIMITS = {
  nameMin: 3,
  nameMax: 30,
  emailMax: 254,
  /** کوتاه‌ترین رمز مجاز؛ سخت‌گیری واقعی با قدرت‌سنج سنجیده می‌شود. */
  passwordMin: 8,
  passwordMax: 64,
  otpLength: 6,
  /** حداقل امتیاز قدرت رمز (۰..۴) برای اجازه‌ی عبور از مرحله‌ی آخر. */
  passwordMinScore: 3,
  /** فاصله‌ی ارسال مجدد کد (ثانیه) — باید با سیاست سرور یکی بماند. */
  resendSeconds: 60,
  /** مدت اعتبار کد تایید (ثانیه). */
  codeTtlSeconds: 120,
} as const;

/** تعداد بخش‌های نوار قدرت رمز — = تعداد قواعد قدرت. */
export const PASSWORD_STRENGTH_SEGMENTS = 4;

export const faCount = (value: number): string => formatCurrency(value);
