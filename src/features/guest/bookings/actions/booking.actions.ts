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

/**
 * پرداخت یک رزرو «در انتظار پرداخت» از طریق درگاه.
 *
 * ⚠️ درگاه **شبیه‌سازی‌شده** است: هیچ داده‌ی کارتی جایی نمی‌رود. فقط
 * `POST /bookings/:id/pay` صدا زده می‌شود و بک‌اند رزرو را `confirmed`
 * می‌کند (همان چیزی که در تب «جاری» دیده می‌شود).
 *
 * ⚠️ چرا آرگومان کارت نمی‌گیرد؟ چون درگاه واقعی هم این داده‌ها را به
 * پذیرنده نمی‌دهد؛ اطلاعات کارت فقط داخل خود درگاه مصرف می‌شود.
 */
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

    // رزرو از «در انتظار پرداخت» به «جاری» می‌رود؛ هر دو مسیر تازه‌سازی
    // می‌شوند تا شمارنده‌ی تب‌ها و صفحه‌ی پرداخت هم درست بمانند.
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
