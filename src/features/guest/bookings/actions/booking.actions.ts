"use server";

import { revalidatePath } from "next/cache";

import { getGuestBookingsRepository } from "../services/guest-bookings.repository";

export type BookingActionResult = {
  success: boolean;
  message: string;
};

export async function cancelPendingBookingAction(
  bookingId: number,
): Promise<BookingActionResult> {
  try {
    const booking = await getGuestBookingsRepository().cancel(bookingId);

    if (!booking) {
      return {
        success: false,
        message: "این رزرو قابل لغو نیست؛ ممکن است قبلاً لغو یا پرداخت شده باشد.",
      };
    }

    revalidatePath("/account/bookings");
    revalidatePath(`/account/bookings/${bookingId}/pay`);

    return { success: true, message: "رزرو شما با موفقیت لغو شد." };
  } catch {
    return {
      success: false,
      message: "لغو رزرو ناموفق بود. دوباره تلاش کنید.",
    };
  }
}

export async function payBookingAction(
  bookingId: number,
): Promise<BookingActionResult> {
  try {
    const booking = await getGuestBookingsRepository().pay(bookingId);

    if (!booking) {
      return {
        success: false,
        message:
          "پرداخت انجام نشد؛ ممکن است مهلت این رزرو گذشته یا قبلاً پرداخت شده باشد.",
      };
    }

    revalidatePath("/account/bookings");
    revalidatePath(`/account/bookings/${bookingId}/pay`);

    return { success: true, message: "پرداخت با موفقیت انجام شد و رزرو تأیید شد." };
  } catch {
    return {
      success: false,
      message: "پرداخت ناموفق بود. دوباره تلاش کنید.",
    };
  }
}
