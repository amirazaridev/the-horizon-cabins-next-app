import { formatJalaliDate } from "@/components/ui/RangeDatePicker";
import { todayInTehran } from "@/libs/utils/tehran-date";

/** مقدار تاریخ سفر در URL (قالب yyyy-MM-dd، مثل سرچ لندینگ) */
export type CabinDateValue = {
  checkIn: string | null;
  checkOut: string | null;
};

/** محدودیت‌های اقامت که بک‌اند اعمال می‌کند (از `GET /settings/public`). */
export type StayLimits = {
  minBookingLength: number;
  maxBookingLength: number;
  maxAdvanceBookingDays: number;
};

const DAY_MS = 86_400_000;

/**
 * آیا این بازه‌ی اقامت با قواعد بک‌اند هم‌خوان است؟
 *
 * بک‌اند هر کدام از این‌ها را با ۴۰۰ رد می‌کند (`cabin.validation.ts`)؛ چون
 * `queryCabins` در غیر این صورت استثنا پرتاب می‌کند و صفحه را می‌ترکاند،
 * قبل از ارسال همین‌جا بررسی می‌کنیم تا در صورت نامعتبر بودن، تاریخ‌ها
 * نادیده گرفته شوند (تصمیم پروژه: بازه‌ی ناقص/نامعتبر = بدون تاریخ).
 */
export function isValidStayRange(
  checkIn: string | null | undefined,
  checkOut: string | null | undefined,
  limits: StayLimits,
  today: Date = todayInTehran(),
): boolean {
  const from = parseDateParam(checkIn ?? null);
  const to = parseDateParam(checkOut ?? null);
  if (!from || !to) return false;

  const nights = Math.round((to.getTime() - from.getTime()) / DAY_MS);
  if (nights < limits.minBookingLength) return false;
  if (nights > limits.maxBookingLength) return false;
  if (from.getTime() < today.getTime()) return false;

  const horizonEnd = new Date(today);
  horizonEnd.setDate(horizonEnd.getDate() + limits.maxAdvanceBookingDays);
  if (to.getTime() > horizonEnd.getTime()) return false;

  return true;
}

const PARAM_RE = /^\d{4}-\d{2}-\d{2}$/;

/** پارس امن پارامتر تاریخ؛ نامعتبر یعنی null */
export function parseDateParam(value: string | null): Date | null {
  if (!value || !PARAM_RE.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const valid =
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d;
  return valid ? date : null;
}

/** تبدیل Date به قالب URL (بدون شیفت تایم‌زون) */
export function formatDateParam(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** لیبل فارسی بازه تاریخ برای روی دکمه فیلتر؛ خالی یعنی undefined */
export function formatDateRangeLabel(
  checkIn: string | null,
  checkOut: string | null,
): string | undefined {
  const from = parseDateParam(checkIn);
  const to = parseDateParam(checkOut);
  const fromLabel = from ? (formatJalaliDate(from) ?? undefined) : undefined;
  const toLabel = to ? (formatJalaliDate(to) ?? undefined) : undefined;
  if (fromLabel && toLabel) return `${fromLabel} تا ${toLabel}`;
  return fromLabel ?? toLabel;
}
