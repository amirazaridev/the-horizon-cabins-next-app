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
 * یک رزرو مهمان.
 *
 * ⚠️ این تایپ **دقیقاً هم‌شکل پاسخ `GET /bookings`** بک‌اند است؛ تاریخ‌ها
 * رشته‌ی ISO هستند (JSON تاریخ را به رشته تبدیل می‌کند) و نمایش جلالی در
 * `lib/format-booking.ts` انجام می‌شود. با همین هم‌شکلی، تعویض ماک با API
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
  /** قیمت هر شب (بعد از تخفیف) — واحد تومان. */
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
