import type { DashboardBooking } from "../../../types/dashboard.types";
import { SOLD_STATUSES } from "../../../types/dashboard.types";
import {
  type DateRange,
  eachDayInRange,
  MS_PER_DAY,
  toEpochDay,
} from "../range";
import { perNightAmountExact } from "../money";

/** فقط شب‌های فروخته‌شده (شامل checkedOut) که داخل بازه می‌افتند. */
export function soldBookings(
  bookings: readonly DashboardBooking[],
): DashboardBooking[] {
  const sold = new Set<string>(SOLD_STATUSES);
  return bookings.filter((b) => sold.has(b.status));
}

/** یک شب فروخته‌شده در بستر پیمایش سری‌ها. */
export interface SoldNightContext {
  /** شماره‌ی روز مطلق (epoch-day) */
  night: number;
  /** تاریخ محلی همان شب */
  nightDate: Date;
  /** سهم دقیق این شب از مبلغ کل رزرو (prorated) */
  amount: number;
}

export function forEachSoldNight(
  bookings: readonly DashboardBooking[],
  range: DateRange,
  visit: (ctx: SoldNightContext) => void,
): void {
  const rangeStart = toEpochDay(range.from);
  const rangeEnd = toEpochDay(range.to);

  for (const booking of soldBookings(bookings)) {
    const bookingStart = toEpochDay(booking.startDate);
    const bookingEnd = toEpochDay(booking.endDate);
    if (bookingEnd <= bookingStart) continue;

    const lo = Math.max(bookingStart, rangeStart);
    const hi = Math.min(bookingEnd, rangeEnd + 1);
    if (hi <= lo) continue;

    const nights =
      booking.numNights > 0 ? booking.numNights : bookingEnd - bookingStart;

    for (let night = lo; night < hi; night++) {
      visit({
        night,
        nightDate: new Date(night * MS_PER_DAY),
        amount: perNightAmountExact(
          booking.totalPrice,
          nights,
          night - bookingStart,
        ),
      });
    }
  }
}

/** سطح تجمیع سری زمانی. */
export type TrendGranularity = "daily" | "weekly" | "monthly";

export function pickGranularity(range: DateRange): TrendGranularity {
  const days = inclusiveDays(range);
  if (days <= 31) return "daily";
  if (days <= 120) return "weekly";
  return "monthly";
}

function inclusiveDays(range: DateRange): number {
  return Math.max(0, toEpochDay(range.to) - toEpochDay(range.from) + 1);
}

/** برش تاریخ به ابتدای باکت مربوط به سطح تجمیع. */
export function bucketStart(
  date: Date,
  granularity: TrendGranularity,
): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (granularity === "daily") return d;

  if (granularity === "weekly") {
    // JS: 0=Sunday … 6=Saturday. شنبه = 6 ⇒ آفست تا شنبه
    const dayOfWeek = d.getDay();
    const offsetToSaturday = dayOfWeek === 6 ? 0 : dayOfWeek + 1;
    d.setDate(d.getDate() - offsetToSaturday);
    return d;
  }

  // monthly
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** کلید یکتای باکت — مبنای گروه‌بندی سری‌ها. */
export function bucketKey(
  date: Date,
  granularity: TrendGranularity,
): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  if (granularity === "monthly") return `${y}-${m}`;
  return `${y}-${m}-${d}`;
}

export function seedBuckets<T>(
  range: DateRange,
  granularity: TrendGranularity,
  create: (date: Date) => T,
  onExisting: (bucket: T) => void,
): Map<string, T> {
  const buckets = new Map<string, T>();

  for (const day of eachDayInRange(range.from, range.to)) {
    const bucketDate = bucketStart(day, granularity);
    const key = bucketKey(bucketDate, granularity);
    const bucket = buckets.get(key);
    if (bucket) {
      onExisting(bucket);
    } else {
      buckets.set(key, create(bucketDate));
    }
  }

  return buckets;
}

/** مرتب‌سازی ورودی‌های باکت بر اساس کلید (ترتیب زمانی). */
export function sortedBuckets<T>(buckets: Map<string, T>): [string, T][] {
  return [...buckets.entries()].sort(([a], [b]) =>
    a < b ? -1 : a > b ? 1 : 0,
  );
}
