import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";

/**
 * قالب‌بندی تاریخ جلالی — مشترک بین بخش‌های داشبورد.
 *
 * ⚠️ ورودی می‌تواند `Date` یا رشته‌ی ISO باشد (پاسخ JSON تاریخ را رشته
 * می‌کند) تا مصرف‌کننده لازم نباشد خودش تبدیل کند.
 */

/** تاریخ کامل جلالی — «۱۲ مهر ۱۴۰۵». */
export function formatJalaliFull(value: Date | string): string {
  return format(new Date(value), "d MMMM yyyy", { locale: faIR });
}

/** روز و ماه جلالی — «۱۲ مهر». */
export function formatJalaliDayMonth(value: Date | string): string {
  return format(new Date(value), "d MMMM", { locale: faIR });
}

/** ساعت (۲۴ساعته) — «۱۴:۳۰». */
export function formatJalaliTime(value: Date | string): string {
  return format(new Date(value), "HH:mm", { locale: faIR });
}
