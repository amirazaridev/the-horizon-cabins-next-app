/**
 * KPIهای مرتبط با درآمد — درآمد اتاق و ADR (میانگین نرخ هر شب).
 * همه pure؛ تعریف دقیق در `docs/dashboard-metrics.md`.
 */

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

/**
 * درآمد اتاق در بازه — توزیع **شب‌به‌شب (prorated)**.
 *
 * سهم هر شب با `perNightAmountExact` حساب می‌شود تا جمع کل دقیقاً برابر
 * مبلغ شب‌های داخل بازه باشد (بدون خطای گرد‌کردن).
 */
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

/**
 * سری زمانی درآمد با تجمیع خودکار.
 *
 * مبنای گروه‌بندی: **شبی که درآمد به آن نسبت داده می‌شود** (شب‌به‌شب).
 * پس رزرو عبوری از مرز بین دو باکت تقسیم می‌شود — دقیقاً مثل `roomRevenue`.
 */
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
