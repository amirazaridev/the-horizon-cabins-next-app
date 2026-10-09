/**
 * «امروز» به وقت تهران — هم‌تراز با اعتبارسنجی بک‌اند.
 *
 * بک‌اند در `cabin.validation.ts` شرط `startDate >= today(Asia/Tehran)` را
 * اعمال می‌کند. اگر ساعت مرورگر از تهران عقب‌تر باشد (مثلاً کاربر در
 * آمریکا)، «امروزِ» لوکال می‌تواند «دیروزِ» تهران باشد و انتخابش با ۴۰۰ رد
 * شود. با دادن این مقدار به‌عنوان کمینه‌ی تقویم، هیچ‌وقت تاریخی که بک‌اند
 * قبول نمی‌کند قابل انتخاب نیست.
 *
 * خروجی یک `Date` در **نیمه‌شب محلی** است که همان «تاریخ تقویمی تهران» را
 * نشان می‌دهد؛ چون `RangeDatePicker` تاریخ‌ها را با اجزای محلی مقایسه می‌کند.
 */

export const HORIZON_TIMEZONE = "Asia/Tehran";

export function todayInTehran(now: Date = new Date()): Date {
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: HORIZON_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now); // خروجی: 2026-10-10

  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(year, month - 1, day);
}
