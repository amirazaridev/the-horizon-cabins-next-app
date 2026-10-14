import type { DashboardBooking } from "../../../types/dashboard.types";
import {
  type DateRange,
  inclusiveDayCount,
  nightsInRange,
} from "../range";
import { safeRatio } from "../money";
import {
  bucketKey,
  bucketStart,
  forEachSoldNight,
  pickGranularity,
  seedBuckets,
  soldBookings,
  sortedBuckets,
  type TrendGranularity,
} from "./shared";

export function soldNights(
  bookings: readonly DashboardBooking[],
  range: DateRange,
): number {
  return soldBookings(bookings).reduce(
    (total, booking) =>
      total +
      nightsInRange(booking.startDate, booking.endDate, range.from, range.to),
    0,
  );
}

export function soldNightsByCabin(
  bookings: readonly DashboardBooking[],
  cabinId: number,
  range: DateRange,
): number {
  return soldBookings(bookings)
    .filter((b) => b.cabinId === cabinId)
    .reduce(
      (total, booking) =>
        total +
        nightsInRange(booking.startDate, booking.endDate, range.from, range.to),
      0,
    );
}

export function availableNights(
  cabinCount: number,
  range: DateRange,
): number {
  if (cabinCount <= 0) return 0;
  return cabinCount * inclusiveDayCount(range.from, range.to);
}

/** `Occupancy = SoldNights / AvailableNights` — نسبت بین ۰ و ۱، یا null. */
export function occupancy(
  bookings: readonly DashboardBooking[],
  cabinCount: number,
  range: DateRange,
): number | null {
  const sold = soldNights(bookings, range);
  const available = availableNights(cabinCount, range);
  return safeRatio(sold, available);
}

export function soldNightsSeries(
  bookings: readonly DashboardBooking[],
  range: DateRange,
  granularity: TrendGranularity = pickGranularity(range),
): number[] {
  const buckets = seedBuckets(
    range,
    granularity,
    () => 0,
    () => {},
  );

  forEachSoldNight(bookings, range, ({ nightDate }) => {
    const key = bucketKey(bucketStart(nightDate, granularity), granularity);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  });

  return sortedBuckets(buckets).map(([, value]) => value);
}

/** یک نقطه‌ی سری ترکیبی اشغال + ADR. */
export interface OccupancyAdrPoint {
  key: string;
  date: Date;
  /** نسبت ۰..۱ */
  occupancy: number | null;
  /** تومان */
  adr: number | null;
}

export function occupancyAdrSeries(
  bookings: readonly DashboardBooking[],
  cabinCount: number,
  range: DateRange,
  granularity: TrendGranularity = pickGranularity(range),
): OccupancyAdrPoint[] {
  const buckets = seedBuckets(
    range,
    granularity,
    (date) => ({ date, nights: 0, revenue: 0, days: 0 }),
    (bucket) => {
      bucket.days += 1;
    },
  );

  forEachSoldNight(bookings, range, ({ nightDate, amount }) => {
    const key = bucketKey(bucketStart(nightDate, granularity), granularity);
    const bucket = buckets.get(key);
    if (!bucket) return;
    bucket.nights += 1;
    bucket.revenue += amount;
  });

  return sortedBuckets(buckets).map(([key, value]) => ({
    key,
    date: value.date,
    occupancy: safeRatio(value.nights, cabinCount * value.days),
    adr: safeRatio(value.revenue, value.nights),
  }));
}
