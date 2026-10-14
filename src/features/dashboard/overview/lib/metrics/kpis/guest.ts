import type { DashboardBooking } from "../../../types/dashboard.types";
import { CANCELLED_STATUSES } from "../../../types/dashboard.types";
import { type DateRange, createdAtInRange, nightsInRange } from "../range";
import { soldBookings } from "./shared";

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

export function deltaPercent(
  current: number | null,
  previous: number | null,
): number | null {
  if (current === null || previous === null) return null;
  if (previous === 0) return null;
  return (current - previous) / previous;
}
