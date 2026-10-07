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
 * ⚠️ امروز از طریق `GuestBookingsRepository` روی داده‌ی ماک انجام می‌شود تا
 * جریان UI واقعاً کار کند (لغو → به‌روزشدن کارت رزرو). برای اتصال به
 * بک‌اند فقط بدنه‌ی همین تابع عوض می‌شود:
 *
 *   TODO(backend): `POST /bookings/:id/cancel` با `authFetch` — اندپوینت از
 *   قبل در بک‌اند موجود است و خودش هم فقط رزروِ `pending` را می‌پذیرد
 *   (`cancelBooking` → «Only pending bookings can be cancelled»)، پس همان
 *   قاعده‌ی این UI را دوباره اعمال می‌کند. پاسخش رزروِ به‌روزشده است.
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
