import type { PaginationMeta } from "@/types/api-response";

/**
 * وضعیت‌های رزرو — آینه‌ی enum بک‌اند (`booking_status`).
 *
 * ⚠️ عمداً همین پنج مقدار؛ `unconfirmed`/`no-show` در بک‌اند وجود ندارد.
 */
export type GuestBookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "checkedIn"
  | "checkedOut";

/** دلیل لغو — آینه‌ی enum بک‌اند (`cancellation_reason`). */
export type CancellationReason =
  | "paymentExpired"
  | "userCancelled"
  | "adminCancelled";

/**
 * قیمت‌گذاری یک شب از اقامت — آینه‌ی ردیف‌های `BookingNight` بک‌اند.
 *
 * ⚠️ موتور قیمت‌گذاری بک‌اند برای هر شب می‌تواند افزایش (آخر هفته/تعطیلات)
 * یا تخفیف (اقامت بلند) اعمال کند؛ پس «اقلام» صورت‌حساب از همین آرایه
 * ساخته می‌شود، نه از یک نرخ ثابت.
 */
export type GuestBookingNight = {
  /** تاریخ آن شب (`YYYY-MM-DD`). */
  date: string;
  /** نرخ پایه‌ی آن شب — واحد تومان. */
  basePrice: number;
  discountPercent: number;
  surchargePercent: number;
  /** قیمت نهایی آن شب پس از تخفیف/افزایش — واحد تومان. */
  finalPrice: number;
};

/**
 * یک رزرو مهمان.
 *
 * ⚠️ این تایپ **دقیقاً هم‌شکل پاسخ `GET /bookings`** بک‌اند است؛ تاریخ‌ها
 * رشته‌ی ISO هستند (JSON تاریخ را به رشته تبدیل می‌کند) و نمایش جلالی در
 * `lib/format.ts` انجام می‌شود. با همین هم‌شکلی، تعویض ماک با API
 * هیچ تغییری در UI لازم ندارد.
 */
export type GuestBooking = {
  id: number;
  /** تاریخ ورود (`YYYY-MM-DD`). */
  startDate: string;
  /** تاریخ خروج (`YYYY-MM-DD`). */
  endDate: string;
  numNights: number;
  numGuests: number;
  /**
   * **جمع کل اقامت (subtotal)** — نه قیمت یک شب.
   *
   * ⚠️ در بک‌اند `createBooking` عمداً `cabinPrice = totalPrice` ست می‌شود
   * («cabinPrice اکنون جمع کل اقامت است، نه قیمت یک شب»)؛ برای نرخ هر شب
   * باید از `nights[]` استفاده کرد.
   */
  cabinPrice: number;
  /** مبلغ کل رزرو — واحد تومان. */
  totalPrice: number;
  status: GuestBookingStatus;
  /** مهلت پرداخت (ISO datetime) — فقط برای `pending` معنا دارد. */
  paymentDeadline: string;
  paidAt: string | null;
  paymentReference: string | null;
  cancelledAt: string | null;
  cancellationReason: CancellationReason | null;
  observations: string | null;
  createdAt: string;
  updatedAt: string;
  cabin: { id: number; name: string };
  guest: { id: number; fullName: string };
  /**
   * قیمت هر شب اقامت — منبع اقلام صورت‌حساب.
   *
   * ⚠️ اختیاری در نظر گرفته شده تا UI در برابر پاسخ ناقص/قدیمی نترکد؛
   * ولی بک‌اند همیشه آن را برمی‌گرداند.
   */
  nights?: readonly GuestBookingNight[];
};

/**
 * شناسه‌ی تب‌های صفحه‌ی رزروها.
 *
 * تب‌ها «گروهی» هستند، نه یک‌به‌یکِ وضعیت‌ها: مثلاً «جاری» هم
 * `confirmed` و هم `checkedIn` را در بر می‌گیرد. همین شناسه در URL
 * به‌عنوان `status` می‌نشیند.
 */
export type GuestBookingsTabId =
  | "all"
  | "pending"
  | "active"
  | "completed"
  | "cancelled";

export type GuestBookingsQuery = {
  page?: number;
  limit?: number;
  tab?: GuestBookingsTabId;
};

export type GuestBookingsPage = {
  bookings: GuestBooking[];
  meta: PaginationMeta;
};

/** شمارنده‌ی رزروها در هر تب — برای نشان دادن روی تب‌ها. */
export type GuestBookingsCounts = Record<GuestBookingsTabId, number>;
