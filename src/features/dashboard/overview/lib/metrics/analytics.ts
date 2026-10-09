/**
 * شاخص‌های تحلیلی تکمیلی — جدول عملکرد، سهم کانال، Pace، توزیع‌ها.
 *
 * همه pure و strict، بدون `any`. تعریف‌ها در `docs/dashboard-metrics.md`.
 */

import type {
  DashboardBooking,
  DashboardCabin,
} from "../../types/dashboard.types";
import { SOLD_STATUSES } from "../../types/dashboard.types";
import { type DateRange, overlapsRange, toEpochDay } from "./range";
import {
  roomRevenue,
  soldNights,
} from "./kpi";
import { safeRatio } from "./money";

const SOLD = new Set<string>(SOLD_STATUSES);

/* ==========================================================================
   جدول عملکرد (شهر / اقامتگاه)
   ========================================================================== */

/** یک ردیف عملکرد — برای جدول قابل‌مرتب‌سازی. */
export interface PerformanceRow {
  id: number;
  label: string;
  revenue: number;
  soldNights: number;
  availableNights: number;
  occupancy: number | null;
  adr: number | null;
  revPar: number | null;
  bookingCount: number;
  /** Δ درآمد نسبت به بازه‌ی مقایسه — یا null */
  revenueDelta: number | null;
}

/** عملکرد به تفکیک **اقامتگاه**. */
export function cabinPerformance(
  bookings: readonly DashboardBooking[],
  cabins: readonly DashboardCabin[],
  range: DateRange,
  compareRange: DateRange | null,
): PerformanceRow[] {
  const days = Math.max(
    0,
    toEpochDay(range.to) - toEpochDay(range.from) + 1,
  );

  return cabins
    .map<PerformanceRow>((cabin) => {
      const cabinBookings = bookings.filter((b) => b.cabinId === cabin.id);
      const revenue = roomRevenue(cabinBookings, range);
      const nights = soldNights(cabinBookings, range);
      const available = days; // per-cabin: شب‌های بازه
      const bookingCount = cabinBookings.filter(
        (b) => SOLD.has(b.status) && nightsInRangeSafe(b, range),
      ).length;

      const compareRevenue = compareRange
        ? roomRevenue(cabinBookings, compareRange)
        : null;

      return {
        id: cabin.id,
        label: cabin.name,
        revenue,
        soldNights: nights,
        availableNights: available,
        occupancy: safeRatio(nights, available),
        adr: safeRatio(revenue, nights),
        revPar: safeRatio(revenue, available),
        bookingCount,
        revenueDelta:
          compareRevenue !== null && compareRevenue !== 0
            ? (revenue - compareRevenue) / compareRevenue
            : null,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

/** عملکرد به تفکیک **شهر**. */
export function cityPerformance(
  bookings: readonly DashboardBooking[],
  cabins: readonly DashboardCabin[],
  range: DateRange,
  compareRange: DateRange | null,
): PerformanceRow[] {
  const days = Math.max(
    0,
    toEpochDay(range.to) - toEpochDay(range.from) + 1,
  );

  /** گروه‌بندی اقامتگاه‌ها بر اساس شهر. */
  const cabinIdsByCity = new Map<number, number[]>();
  const cityName = new Map<number, string>();

  for (const cabin of cabins) {
    const list = cabinIdsByCity.get(cabin.cityId) ?? [];
    list.push(cabin.id);
    cabinIdsByCity.set(cabin.cityId, list);
    if (cabin.city?.name) cityName.set(cabin.cityId, cabin.city.name);
  }

  return [...cabinIdsByCity.entries()]
    .map<PerformanceRow>(([cityId, cabinIds]) => {
      const idSet = new Set(cabinIds);
      const cityBookings = bookings.filter((b) => idSet.has(b.cabinId));

      const revenue = roomRevenue(cityBookings, range);
      const nights = soldNights(cityBookings, range);
      const available = cabinIds.length * days;
      const bookingCount = cityBookings.filter(
        (b) => SOLD.has(b.status) && nightsInRangeSafe(b, range),
      ).length;

      const compareRevenue = compareRange
        ? roomRevenue(cityBookings, compareRange)
        : null;

      return {
        id: cityId,
        label: cityName.get(cityId) ?? `شهر ${cityId}`,
        revenue,
        soldNights: nights,
        availableNights: available,
        occupancy: safeRatio(nights, available),
        adr: safeRatio(revenue, nights),
        revPar: safeRatio(revenue, available),
        bookingCount,
        revenueDelta:
          compareRevenue !== null && compareRevenue !== 0
            ? (revenue - compareRevenue) / compareRevenue
            : null,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

/** Top N و Bottom N از یک لیست مرتب‌شده. */
export function topBottom<T>(
  rows: readonly T[],
  n: number,
): { top: T[]; bottom: T[] } {
  return {
    top: rows.slice(0, n),
    bottom: rows.length > n ? rows.slice(-n).reverse() : [],
  };
}

/* ==========================================================================
   توزیع وضعیت رزرو
   ========================================================================== */

export interface StatusDistributionRow {
  status: DashboardBooking["status"];
  count: number;
  share: number | null;
}

/** توزیع رزروها بر اساس وضعیت — در بازه‌ی ثبت (`createdAt`). */
export function statusDistribution(
  bookings: readonly DashboardBooking[],
  range: DateRange,
): StatusDistributionRow[] {
  const created = bookings.filter((b) => {
    const t = toEpochDay(b.createdAt);
    return t >= toEpochDay(range.from) && t <= toEpochDay(range.to);
  });

  const buckets = new Map<DashboardBooking["status"], number>();
  for (const booking of created) {
    buckets.set(booking.status, (buckets.get(booking.status) ?? 0) + 1);
  }

  const total = created.length;

  return [...buckets.entries()]
    .map<StatusDistributionRow>(([status, count]) => ({
      status,
      count,
      share: safeRatio(count, total),
    }))
    .sort((a, b) => b.count - a.count);
}

/* ==========================================================================
   توزیع مدت اقامت
   ========================================================================== */

export interface DurationBucket {
  label: string;
  min: number;
  max: number | null;
  count: number;
  share: number | null;
}

/** سطل‌های مدت اقامت — همان تفکیک نمودار فعلی پروژه. */
const DURATION_BUCKETS: readonly { label: string; min: number; max: number | null }[] = [
  { label: "۱ شب", min: 1, max: 1 },
  { label: "۲ شب", min: 2, max: 2 },
  { label: "۳ شب", min: 3, max: 3 },
  { label: "۴ تا ۵ شب", min: 4, max: 5 },
  { label: "۶ تا ۷ شب", min: 6, max: 7 },
  { label: "۸ تا ۱۴ شب", min: 8, max: 14 },
  { label: "۱۵ تا ۲۱ شب", min: 15, max: 21 },
  { label: "۲۱+ شب", min: 22, max: null },
];

/** توزیع مدت اقامت — روی شب‌های داخل بازه. */
export function durationDistribution(
  bookings: readonly DashboardBooking[],
  range: DateRange,
): DurationBucket[] {
  const relevant = bookings.filter(
    (b) => SOLD.has(b.status) && nightsInRangeSafe(b, range),
  );

  return DURATION_BUCKETS.map<DurationBucket>((bucket) => {
    const count = relevant.filter((b) => {
      if (bucket.max === null) return b.numNights >= bucket.min;
      return b.numNights >= bucket.min && b.numNights <= bucket.max;
    }).length;

    return {
      ...bucket,
      count,
      share: safeRatio(count, relevant.length),
    };
  });
}

/* ==========================================================================
   کمکی داخلی
   ========================================================================== */

function nightsInRangeSafe(booking: DashboardBooking, range: DateRange): boolean {
  return overlapsRange(booking.startDate, booking.endDate, range.from, range.to);
}
