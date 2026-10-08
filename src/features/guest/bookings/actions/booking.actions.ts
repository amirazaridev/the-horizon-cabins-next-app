"use server";

import { revalidatePath } from "next/cache";

import { getGuestBookingsRepository } from "../services/guest-bookings.repository";

export type BookingActionResult = {
  success: boolean;
  message: string;
};

/**
 * لغو رزرو «در انتظار پرداخت» توسط خودِ مهمان.
 *
 * ⚠️ از طریق `GuestBookingsRepository` انجام می‌شود که پیاده‌سازی‌اش روی
 * بک‌اند واقعی است (`POST /bookings/:id/cancel` با `authFetch`). بک‌اند هم
 * فقط رزروِ `pending` را می‌پذیرد (`cancelBooking` → «Only pending bookings
 * can be cancelled»)، پس همان قاعده‌ی این UI را دوباره اعمال می‌کند؛ اگر
 * رزرو قابل لغو نباشد `null` برمی‌گردد و پیام درست نمایش داده می‌شود.
 */
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

    // هر دو مسیری که این رزرو در آن‌ها دیده می‌شود تازه‌سازی می‌شوند:
    // لیست رزروها (کارت عوض می‌شود) و صفحه‌ی پرداخت (حالا بی‌اعتبار است).
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
