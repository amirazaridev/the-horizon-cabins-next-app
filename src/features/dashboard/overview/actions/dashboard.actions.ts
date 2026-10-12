"use server";

import { requestBookingStatusTransition } from "../../shared/api/bookings.api";
import type { DashboardBookingJson } from "../data/dashboard.hydrate";

/**
 * Server Actionهای عملیات امروز (check-in / check-out).
 *
 * ⚠️ چرا Server Action؟ چون `useTodayActivity` یک هوک **کلاینت** است و
 * نمی‌تواند `authFetch` (server-only) را صدا بزند. این اکشن‌ها همان
 * `PATCH /bookings/:id/status` بک‌اند را می‌زنند.
 *
 * ⚠️ خروجی، **JSON خام** رزرو است (تاریخ‌ها رشته) تا سمت کلاینت با همان
 * `hydrateBooking` بازسازی شود — یک قرارداد یکسان با مسیر snapshot.
 *
 * ⭐ تماس HTTP خام در `../../shared/api/bookings.api` است (مشترک با
 * اکشن‌های رزروِ bookings)؛ این‌جا فقط استخراج رزرو از پاسخ.
 */

type BookingStatusTransition = "checkedIn" | "checkedOut";

/** گذار وضعیت رزرو با اعتبارسنجی بک‌اند (فقط admin|owner). */
async function transitionBookingStatus(
  bookingId: number,
  status: BookingStatusTransition,
): Promise<DashboardBookingJson | null> {
  const result = await requestBookingStatusTransition(bookingId, status);
  if (!result.ok) return null;

  const json = result.data as {
    data?: { booking?: DashboardBookingJson };
  };
  return json.data?.booking ?? null;
}

/** ثبت ورود (تحویل اتاق). */
export async function checkInBookingAction(
  bookingId: number,
): Promise<DashboardBookingJson | null> {
  return transitionBookingStatus(bookingId, "checkedIn");
}

/** ثبت خروج (تخلیه اتاق). */
export async function checkOutBookingAction(
  bookingId: number,
): Promise<DashboardBookingJson | null> {
  return transitionBookingStatus(bookingId, "checkedOut");
}
