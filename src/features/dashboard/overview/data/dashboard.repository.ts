/**
 * لایه‌ی دسترسی به داده‌ی داشبورد — `DashboardRepository`.
 *
 * کامپوننت‌ها و hookها **فقط** این interface را می‌شناسند؛ پیاده‌سازی فعلی
 * `ApiDashboardRepository` است (از `GET /api/dashboard/snapshot` می‌خواند).
 *
 * ⚠️ این ماژول **client-safe** است و هیچ import سرور-محوری ندارد.
 */

import type {
  DashboardBooking,
  DashboardCabin,
  DashboardCity,
  DashboardFilters,
  TodayActivityItem,
} from "../types/dashboard.types";
import { ACTIVE_BOOKING_STATUSES } from "../types/dashboard.types";
import { toEpochDay } from "../lib/metrics/range";

/**
 * نتیجه‌ی کامل یک درخواست داشبورد — همان چیزی که endpoint بک‌اند
 * (`GET /dashboard/snapshot`) برمی‌گرداند.
 */
export interface DashboardSnapshot {
  /** رزروهای داخل بازه (شامل عبوری‌ها) — پایه‌ی KPI اصلی */
  bookings: DashboardBooking[];
  /** همان فیلترها روی بازه‌ی مقایسه */
  compareBookings: DashboardBooking[];
  /** اقامتگاه‌های فعال بعد از اعمال فیلتر شهر/اقامتگاه */
  cabins: DashboardCabin[];
  /** رزروهای امروز — مستقل از فیلتر تاریخ */
  todayBookings: DashboardBooking[];
  /** رزروهای آینده (۹۰ روز) — مستقل از فیلتر تاریخ */
  forwardBookings: DashboardBooking[];
  range: { from: Date; to: Date };
  compareRange: { from: Date; to: Date } | null;
  today: Date;
}

/** عملیات نوشتنی (check-in / check-out). */
export interface DashboardMutations {
  checkIn(bookingId: number): Promise<DashboardBooking>;
  checkOut(bookingId: number): Promise<DashboardBooking>;
}

/** قرارداد کامل repository. */
export interface DashboardRepository extends DashboardMutations {
  /** بارگذاری همه‌ی داده‌ی لازم برای یک رندر داشبورد. */
  getSnapshot(filters: DashboardFilters): Promise<DashboardSnapshot>;
}

/**
 * گزینه‌های فیلتر — از بک‌اند (`GET /locations/cities` و `GET /cabins`)
 * خوانده می‌شوند تا dropdown فیلتر مستقل از بازه‌ی تاریخ کار کند.
 */
export interface DashboardFilterOptions {
  cities: DashboardCity[];
  cabins: DashboardCabin[];
}

/* ==========================================================================
   کمکی‌های مشترک — فقط چیزهایی که در کلاینت لازم‌اند
   ========================================================================== */

/**
 * نگاشت یک رزرو امروزی به «آیتم فعالیت امروز».
 *
 * ⚠️ یک رزرو ممکن است **هم‌زمان** ورود و خروج امروز باشد؛ اگر هم ورود و
 * هم خروج امروز بودند (رزرو تک‌شبه‌ی نامتعارف)، **ورود** اولویت می‌گیرد
 * چون اکشن اصلی روز است.
 */
export function toTodayActivityItem(
  booking: DashboardBooking,
  today: Date,
): TodayActivityItem {
  const isArrival = isSameEpochDay(booking.startDate, today);

  return {
    bookingId: booking.id,
    kind: isArrival ? "arrival" : "departure",
    guestName: booking.guest?.fullName ?? "مهمان",
    cabinName: booking.cabin?.name ?? "اقامتگاه",
    numNights: booking.numNights,
    numGuests: booking.numGuests,
    status: booking.status,
  };
}

/** آیتم‌های فعالیت امروز — مشتق‌شده از رزروهای امروز. */
export function pickTodayActivity(
  bookings: readonly DashboardBooking[],
  today: Date,
): TodayActivityItem[] {
  const active = new Set<string>(ACTIVE_BOOKING_STATUSES);

  return bookings
    .filter((booking) => active.has(booking.status))
    .filter(
      (booking) =>
        isSameEpochDay(booking.startDate, today) ||
        isSameEpochDay(booking.endDate, today),
    )
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .map((booking) => toTodayActivityItem(booking, today));
}

function isSameEpochDay(a: Date, b: Date): boolean {
  return toEpochDay(a) === toEpochDay(b);
}
