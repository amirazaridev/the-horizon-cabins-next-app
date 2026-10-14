import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

/** ابتدای روز به‌شکل `Date` (بدون ساعت) — برای نرمال‌سازی مقادیر بازه. */
export function atStartOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** ابتدای روز به‌شکل timestamp — برای مقایسه‌ی تاریخ‌ها بدون ساعت. */
export function startOfDay(date: Date): number {
  return atStartOfDay(date).getTime();
}

export function normalizeRange(
  from: Date | null,
  to: Date | null,
): [Date | null, Date | null] {
  const start = from ? atStartOfDay(from) : null;
  const end = to ? atStartOfDay(to) : null;

  if (start && end) {
    if (end.getTime() < start.getTime()) return [end, start];
    if (end.getTime() === start.getTime()) return [start, null];
  }

  return [start, end];
}

export function toDateObject(date: Date): DateObject {
  return new DateObject({ date, calendar: persian, locale: persian_fa });
}

export function toJsDate(value: unknown): Date | null {
  if (!value || typeof value !== "object" || !("toDate" in value)) return null;

  const date = (value as { toDate: () => Date }).toDate();

  return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
}

/** یک تاریخ را به متن جلالی تبدیل می‌کند؛ `null` یعنی جای‌خالی. */
export function formatJalaliDate(
  date: Date | null,
  pattern = "DD MMMM",
): string | null {
  if (!date) return null;
  return toDateObject(date).format(pattern);
}
