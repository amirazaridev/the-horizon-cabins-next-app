/**
 * KPIهای مهمان/رزرو — نرخ لغو، میانگین اقامت، شمارش‌ها و Δ% نسبت به
 * دوره‌ی مقایسه. همه pure؛ تعریف دقیق در `docs/dashboard-metrics.md`.
 */

import type { DashboardBooking } from "../../../types/dashboard.types";
import { CANCELLED_STATUSES } from "../../../types/dashboard.types";
import { type DateRange, createdAtInRange, nightsInRange } from "../range";
import { soldBookings } from "./shared";

/**
 * `CancellationRate = رزروهای لغوشده / کل رزروهای ثبت‌شده در بازه`
 *
 * ⚠️ مخرج **ثبت‌شده در بازه** است، نه شروع‌شده در بازه. یعنی معیار
 * `createdAt` داخل بازه است. لغو هرگز مخرج را عوض نمی‌کند.
 */
export function cancellationRate(
  bookings: readonly DashboardBooking[],
  range: DateRange,
): number | null {
  const created = bookings.filter((b) =>
    createdAtInRange(b.createdAt, range.from, range.to),
  );
  if (created.length === 0) return null;

  const cancelled = created.filter((b) =>
    (CANCELLED_STATUSES as readonly string[]).includes(b.status),
  ).length;

  return cancelled / created.length;
}

/**
 * میانگین شب‌های رزروهای فروخته‌شده در بازه.
 * ⚠️ `null` وقتی هیچ رزرو فروخته‌شده‌ای نیست (نه صفر).
 */
export function averageStay(
  bookings: readonly DashboardBooking[],
  range: DateRange,
): number | null {
  const sold = soldBookings(bookings).filter(
    (b) => nightsInRange(b.startDate, b.endDate, range.from, range.to) > 0,
  );
  if (sold.length === 0) return null;

  const totalNights = sold.reduce(
    (sum, b) =>
      sum + nightsInRange(b.startDate, b.endDate, range.from, range.to),
    0,
  );
  return totalNights / sold.length;
}

/** تعداد رزروهایی که شب‌شان داخل بازه می‌افتد (فقط فروخته‌شده). */
export function bookingCount(
  bookings: readonly DashboardBooking[],
  range: DateRange,
): number {
  return soldBookings(bookings).filter(
    (b) => nightsInRange(b.startDate, b.endDate, range.from, range.to) > 0,
  ).length;
}

/** تعداد رزروهای ثبت‌شده در بازه (هر وضعیتی) — مبنای نرخ لغو. */
export function createdBookingCount(
  bookings: readonly DashboardBooking[],
  range: DateRange,
): number {
  return bookings.filter((b) =>
    createdAtInRange(b.createdAt, range.from, range.to),
  ).length;
}

/**
 * `Δ% = (current - previous) / previous`
 *
 * ⚠️ اگر مقدار مبنا `0` یا `null` باشد، `null` برمی‌گردد (نه 0 و نه
 * Infinity). این تصمیم عمدی است: «رشد نسبت به صفر» بی‌معناست و UI باید
 * به‌جای `+∞٪` متن «بدون مقایسه» نشان دهد.
 */
export function deltaPercent(
  current: number | null,
  previous: number | null,
): number | null {
  if (current === null || previous === null) return null;
  if (previous === 0) return null;
  return (current - previous) / previous;
}
