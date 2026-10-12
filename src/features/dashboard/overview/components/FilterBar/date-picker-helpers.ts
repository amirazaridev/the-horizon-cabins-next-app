/**
 * کمکی‌های مشترک تقویم‌های فیلتر داشبورد — تبدیل بین `Date` و `DateObject`
 * کتابخانه‌ی `react-multi-date-picker`.
 *
 * ⭐ هر دو `DayRangePicker` و `MonthRangePicker` از همین توابع استفاده
 * می‌کنند تا منطق تبدیل یک‌جا و هم‌راستا بماند.
 */

import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

/** تبدیل `Date` میلادی به `DateObject` با تقویم و locale فارسی. */
export function toDateObject(date: Date): DateObject {
  return new DateObject({
    date,
    calendar: persian,
    locale: persian_fa,
  });
}

/** استخراج امن `Date` از مقدار خروجی `DatePicker` (یا `null` اگر نامعتبر). */
export function toJsDate(value: unknown): Date | null {
  if (!value || typeof value !== "object" || !("toDate" in value)) {
    return null;
  }

  const date = (value as { toDate: () => Date }).toDate();
  return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
}
