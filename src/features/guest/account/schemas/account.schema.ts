import { z } from "zod";

import { nameField, normalizeDigits } from "@/features/auth/schemas";

/**
 * اسکیمای فرم «تنظیمات حساب کاربری».
 *
 * ⚠️ از سازنده‌های اعتبارسنجی مشترک احراز هویت استفاده می‌کند (`nameField`
 * و `normalizeDigits`) تا قاعده‌ی نام/ارقام فارسی دوباره نوشته نشود؛ فقط
 * فیلدهای مخصوص پروفایل (موبایل، کد ملی، تاریخ تولد) اینجا تعریف می‌شوند.
 */

const PHONE_PATTERN = /^09\d{9}$/;
const NATIONAL_ID_PATTERN = /^\d{10}$/;
/** تاریخ جلالی ورودی: `۱۳۷۰/۰۵/۱۲` — بعد از نرمال‌سازی ارقام. */
const JALALI_DATE_PATTERN = /^\d{4}\/\d{1,2}\/\d{1,2}$/;

export const ACCOUNT_MESSAGES = {
  phoneInvalid: "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود",
  nationalIdInvalid: "کد ملی باید ۱۰ رقم باشد",
  dateOfBirthInvalid: "تاریخ تولد را به‌شکل ۱۳۷۰/۰۵/۱۲ وارد کنید",
} as const;

/** رشته‌ی اختیاری که ارقام فارسی‌اش به لاتین تبدیل می‌شود. */
const optionalDigits = z.string().trim().transform(normalizeDigits);

export const accountSchema = z.object({
  fullName: nameField("نام و نام خانوادگی"),
  phoneNumber: optionalDigits.refine(
    (value) => value === "" || PHONE_PATTERN.test(value),
    ACCOUNT_MESSAGES.phoneInvalid,
  ),
  nationalId: optionalDigits.refine(
    (value) => value === "" || NATIONAL_ID_PATTERN.test(value),
    ACCOUNT_MESSAGES.nationalIdInvalid,
  ),
  dateOfBirth: optionalDigits.refine(
    (value) => value === "" || JALALI_DATE_PATTERN.test(value),
    ACCOUNT_MESSAGES.dateOfBirthInvalid,
  ),
});

export type AccountFormValues = z.infer<typeof accountSchema>;
