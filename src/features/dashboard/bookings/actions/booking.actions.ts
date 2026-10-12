"use server";

import { revalidatePath } from "next/cache";

import { requestBookingStatusTransition } from "../../shared/api/bookings.api";

//* Server Actionهای عملیات رزرو در پنل مدیریت.

export type BookingActionResult = {
  success: boolean;
  message: string;
};

type StatusTransition = "checkedIn" | "checkedOut" | "cancelled";

async function transitionBooking(
  bookingId: number,
  status: StatusTransition,
  messages: { success: string; failure: string },
): Promise<BookingActionResult> {
  try {
    const result = await requestBookingStatusTransition(bookingId, status);

    if (!result.ok) {
      return { success: false, message: messages.failure };
    }

    revalidatePath("/dashboard/bookings");
    return { success: true, message: messages.success };
  } catch {
    return { success: false, message: messages.failure };
  }
}

//* تحویل اتاق — گذار `confirmed → checkedIn`
export async function checkInBookingAction(
  bookingId: number,
): Promise<BookingActionResult> {
  return transitionBooking(bookingId, "checkedIn", {
    success: "ورود مهمان با موفقیت ثبت شد.",
    failure:
      "ثبت ورود ناموفق بود؛ ممکن است وضعیت رزرو تغییر کرده یا تاریخ ورود نرسیده باشد.",
  });
}

//* تخلیه اتاق — گذار `checkedIn → checkedOut`
export async function checkOutBookingAction(
  bookingId: number,
): Promise<BookingActionResult> {
  return transitionBooking(bookingId, "checkedOut", {
    success: "خروج مهمان با موفقیت ثبت شد.",
    failure: "ثبت خروج ناموفق بود؛ ممکن است وضعیت رزرو تغییر کرده باشد.",
  });
}

//* کنسل کردن رزرو — گذار `pending|confirmed → cancelled`
export async function cancelBookingAction(
  bookingId: number,
): Promise<BookingActionResult> {
  return transitionBooking(bookingId, "cancelled", {
    success: "رزرو با موفقیت لغو شد.",
    failure:
      "لغو رزرو ناموفق بود؛ ممکن است رزرو در وضعیتی نباشد که قابل لغو باشد.",
  });
}
