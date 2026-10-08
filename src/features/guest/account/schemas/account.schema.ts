import { z } from "zod";

import { nameField, normalizeDigits } from "@/features/auth/schemas";

/**
 * اسکیمای فرم «تنظیمات حساب کاربری».
 *
 * ⚠️ از سازنده‌های اعتبارسنجی مشترک احراز هویت استفاده می‌کند (`nameField`
 * و `normalizeDigits`) تا قاعده‌ی نام/ارقام فارسی دوباره نوشته نشود؛ فقط
 * فیلدهای مخصوص پروفایل (موبایل، کد ملی، تاریخ تولد، جنسیت) اینجا تعریف
 * می‌شوند.
 */

const PHONE_PATTERN = /^09\d{9}$/;
const NATIONAL_ID_PATTERN = /^\d{10}$/;
/** تاریخ جلالی ورودی: `۱۳۷۰/۰۵/۱۲` — بعد از نرمال‌سازی ارقام. */
const JALALI_DATE_PATTERN = /^\d{4}\/\d{1,2}\/\d{1,2}$/;

/**
 * مقادیر مجاز جنسیت — **تک‌منبع** برای اعتبارسنجی و UI.
 *
 * ⚠️ `""` یک گزینه‌ی قابل‌انتخاب نیست؛ فقط نگهدارنده‌ی حالت «ثبت‌نشده» است
 * (کاربر هنوز جنسیتی انتخاب نکرده). در Action به `null` نگاشت می‌شود تا
 * قرارداد PATCH بک‌اند رعایت شود.
 */
export const GENDER_VALUES = ["male", "female", ""] as const;

export type AccountGender = (typeof GENDER_VALUES)[number];

/**
 * گزینه‌های جنسیت برای کنترل انتخاب — برچسب‌های فارسی کنار خود مقدار.
 *
 * ⚠️ عمداً فقط دو گزینه دارد؛ حالت «ثبت‌نشده» (`""`) گزینه‌ای در UI ندارد،
 * پس وقتی جنسیتی ذخیره نشده باشد هیچ‌کدام از دکمه‌ها فعال نیست.
 */
export const GENDER_OPTIONS: readonly { value: AccountGender; label: string }[] = [
  { value: "male", label: "مرد" },
  { value: "female", label: "زن" },
];

export const ACCOUNT_MESSAGES = {
  phoneInvalid: "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود",
  nationalIdInvalid: "کد ملی باید ۱۰ رقم باشد",
  dateOfBirthInvalid: "تاریخ تولد را به‌شکل ۱۳۷۰/۰۵/۱۲ وارد کنید",
  genderInvalid: "جنسیت انتخاب‌شده معتبر نیست",
} as const;

/** رشته‌ی اختیاری که ارقام فارسی‌اش به لاتین تبدیل می‌شود. */
const optionalDigits = z.string().trim().transform(normalizeDigits);

export const accountSchema = z.object({
  fullName: nameField("نام و نام خانوادگی"),
  gender: z.enum(GENDER_VALUES, { message: ACCOUNT_MESSAGES.genderInvalid }),
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
