"use server";

import { requestBookingStatusTransition } from "../../shared/api/bookings.api";
import type { DashboardBookingJson } from "../data/dashboard.hydrate";

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
