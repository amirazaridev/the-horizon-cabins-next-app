import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";

import { formatCurrency } from "@/libs/utils/format";

/**
 * قالب‌بندی تاریخ و مبلغ ناحیه‌ی مهمان — تنها نقطه‌ی تبدیل داده‌ی خام به
 * متن فارسی برای صفحات «رزروهای من» و «تنظیمات حساب کاربری».
 *
 * ⚠️ چرا تاریخ فقط‌تاریخی را دستی پارس می‌کنیم؟
 * بک‌اند برای فیلدهای `@db.Date` رشته‌ی ISO با زمان `00:00:00Z` می‌فرستد.
 * `new Date(iso)` آن را UTC می‌خواند و در تایم‌زون‌های منفی یک روز عقب
 * می‌افتد؛ با افزودن `T00:00:00` (بدون Z) به وقت محلی پارس می‌شود و
 * این خطای «یک روز عقب» از بین می‌رود.
 */
export function parseDateOnly(value: string): Date {
  return new Date(`${value.slice(0, 10)}T00:00:00`);
}

/** تاریخ جلالی خوانا: «۱۵ مهر ۱۴۰۵». */
export function formatJalaliDate(value: string): string {
  return format(parseDateOnly(value), "d MMMM yyyy", { locale: faIR });
}

/** تاریخ جلالی کوتاه بدون سال: «۱۵ مهر» — برای ردیف‌های صورت‌حساب. */
export function formatJalaliDayMonth(value: string): string {
  return format(parseDateOnly(value), "d MMMM", { locale: faIR });
}

/** بازه‌ی اقامت: «۱۵ تا ۱۸ مهر ۱۴۰۵». */
export function formatStayRange(start: string, end: string): string {
  const from = format(parseDateOnly(start), "d", { locale: faIR });
  const to = format(parseDateOnly(end), "d MMMM yyyy", { locale: faIR });
  return `${from} تا ${to}`;
}

/** تاریخ و ساعت جلالی: «۱۵ مهر ۱۴۰۵، ساعت ۱۴:۳۰». */
export function formatJalaliDateTime(value: string): string {
  return `${format(new Date(value), "d MMMM yyyy", { locale: faIR })}، ساعت ${format(
    new Date(value),
    "HH:mm",
    { locale: faIR },
  )}`;
}

/** مبلغ فارسی با واحد تومان. */
export function formatToman(value: number): string {
  return `${formatCurrency(value)} تومان`;
}

/** عدد فارسی ساده (شب‌ها، نفرات، شمارنده‌ها). */
export function toFaNumber(value: number): string {
  return value.toLocaleString("fa-IR");
}

/**
 * شمارش معکوس `mm:ss` با ارقام فارسی و صفر پیشوند — برای مهلت پرداخت.
 * ورودی میلی‌ثانیه‌ی باقی‌مانده؛ مقدار منفی به `۰۰:۰۰` تبدیل می‌شود.
 */
export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const pad = (value: number) =>
    value.toLocaleString("fa-IR", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

  return `${pad(Math.floor(totalSeconds / 60))}:${pad(totalSeconds % 60)}`;
}

/**
 * تاریخ ISO را به شکل ورودی جلالی (`۱۳۷۰/۰۵/۱۲`) درمی‌آورد — برای
 * پیش‌پرکردن فیلدهای تاریخ در فرم‌ها. ورودی خالی ⇒ رشته‌ی خالی.
 */
export function toJalaliDateInput(value: string): string {
  if (!value) return "";
  return format(parseDateOnly(value), "yyyy/MM/dd", { locale: faIR });
}
