import type { DashboardBooking } from "../../../types/dashboard.types";
import { type DateRange } from "../range";
import { safeRatio } from "../money";
import {
  bucketKey,
  bucketStart,
  forEachSoldNight,
  pickGranularity,
  seedBuckets,
  sortedBuckets,
  type TrendGranularity,
} from "./shared";
import { soldNights } from "./occupancy";

export function roomRevenue(
  bookings: readonly DashboardBooking[],
  range: DateRange,
): number {
  let total = 0;
  forEachSoldNight(bookings, range, ({ amount }) => {
    total += amount;
  });
  return total;
}

/** `ADR = RoomRevenue / SoldNights` — خروجی به تومان (number)، یا null. */
export function adr(
  bookings: readonly DashboardBooking[],
  range: DateRange,
): number | null {
  const revenue = roomRevenue(bookings, range);
  const nights = soldNights(bookings, range);
  return safeRatio(revenue, nights);
}

/** یک نقطه‌ی سری زمانی درآمد. */
export interface RevenuePoint {
  key: string;
  date: Date;
  revenue: number;
}

export function revenueSeries(
  bookings: readonly DashboardBooking[],
  range: DateRange,
  granularity: TrendGranularity = pickGranularity(range),
): RevenuePoint[] {
  const buckets = seedBuckets(
    range,
    granularity,
    (date) => ({ date, revenue: 0 }),
    () => {},
  );

  forEachSoldNight(bookings, range, ({ nightDate, amount }) => {
    const key = bucketKey(bucketStart(nightDate, granularity), granularity);
    const bucket = buckets.get(key);
    if (bucket) bucket.revenue += amount;
  });

  return sortedBuckets(buckets).map(([key, value]) => ({
    key,
    date: value.date,
    revenue: value.revenue,
  }));
}
