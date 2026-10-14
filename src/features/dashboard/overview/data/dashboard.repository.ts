import type {
  DashboardBooking,
  DashboardCabin,
  DashboardCity,
  DashboardFilters,
  TodayActivityItem,
} from "../types/dashboard.types";
import { ACTIVE_BOOKING_STATUSES } from "../types/dashboard.types";
import { toEpochDay } from "../lib/metrics/range";

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

export interface DashboardFilterOptions {
  cities: DashboardCity[];
  cabins: DashboardCabin[];
}

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
