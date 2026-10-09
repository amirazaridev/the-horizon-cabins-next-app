import type {
  DashboardBooking,
  DashboardCabin,
} from "../types/dashboard.types";
import type { DashboardSnapshot } from "./dashboard.repository";

/**
 * بازسازی تایپ‌های دامنه از پاسخ JSON.
 *
 * ⚠️ JSON همه‌ی تاریخ‌ها را به **رشته** تبدیل می‌کند. بدون بازسازی،
 * مقایسه‌ی `getTime()` و توابع metrics می‌شکنند. این تنها لایه‌ای است که
 * شکل «خام» (string) را به شکل دامنه (`Date`) تبدیل می‌کند.
 */

/** شکل JSON رزرو — تاریخ‌ها رشته‌اند. */
export type DashboardBookingJson = Omit<
  DashboardBooking,
  | "startDate"
  | "endDate"
  | "paymentDeadline"
  | "paidAt"
  | "cancelledAt"
  | "createdAt"
  | "updatedAt"
> & {
  startDate: string;
  endDate: string;
  paymentDeadline: string | null;
  paidAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

/** شکل JSON بازه — هر دو سر رشته. */
export interface DateRangeJson {
  from: string;
  to: string;
}

/** شکل JSON snapshot — همان `DashboardSnapshot` با تاریخ‌های رشته‌ای. */
export interface DashboardSnapshotJson {
  bookings: DashboardBookingJson[];
  compareBookings: DashboardBookingJson[];
  cabins: DashboardCabin[];
  todayBookings: DashboardBookingJson[];
  forwardBookings: DashboardBookingJson[];
  range: DateRangeJson;
  compareRange: DateRangeJson | null;
  today: string;
}

/** تبدیل یک رزرو JSON به رزرو دامنه (تاریخ‌ها `Date` می‌شوند). */
export function hydrateBooking(raw: DashboardBookingJson): DashboardBooking {
  return {
    ...raw,
    startDate: new Date(raw.startDate),
    endDate: new Date(raw.endDate),
    paymentDeadline: raw.paymentDeadline ? new Date(raw.paymentDeadline) : null,
    paidAt: raw.paidAt ? new Date(raw.paidAt) : null,
    cancelledAt: raw.cancelledAt ? new Date(raw.cancelledAt) : null,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };
}

/** تبدیل snapshot JSON به snapshot دامنه. */
export function hydrateSnapshot(raw: DashboardSnapshotJson): DashboardSnapshot {
  return {
    bookings: raw.bookings.map(hydrateBooking),
    compareBookings: raw.compareBookings.map(hydrateBooking),
    cabins: raw.cabins,
    todayBookings: raw.todayBookings.map(hydrateBooking),
    forwardBookings: raw.forwardBookings.map(hydrateBooking),
    range: { from: new Date(raw.range.from), to: new Date(raw.range.to) },
    compareRange: raw.compareRange
      ? {
          from: new Date(raw.compareRange.from),
          to: new Date(raw.compareRange.to),
        }
      : null,
    today: new Date(raw.today),
  };
}
