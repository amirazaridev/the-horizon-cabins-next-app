import type {
  GuestBooking,
  GuestBookingsCounts,
  GuestBookingsPage,
  GuestBookingsQuery,
} from "../types/guest-booking.types";
import { createApiGuestBookingsRepository } from "./api-guest-bookings.repository";

/**
 * مرز داده‌ی رزروهای مهمان.
 *
 * ⚠️ تنها لایه‌ای که UI با آن حرف می‌زند. UI هیچ‌جا مستقیم با `fetch`
 * تماس نمی‌گیرد؛ فقط این اینترفیس را می‌شناسد. پیاده‌سازی امروز روی
 * بک‌اند واقعی است (`api-guest-bookings.repository.ts`، server-only)؛ اگر
 * روزی منبع داده عوض شود، فقط همین نقطه‌ی تعویض تغییر می‌کند.
 *
 * ⚠️ قرارداد داده با بک‌اند:
 *   - `GET  /bookings?page&limit&status` → `{ data: { bookings, meta } }`
 *     (برای نقش `guest` خودکار به رزروهای خودِ کاربر محدود می‌شود)
 *   - `GET  /bookings/:id`         → `getById` (صفحه‌ی پرداخت، شامل `nights[]`)
 *   - `POST /bookings/:id/cancel`  → `cancel` (فقط رزرو `pending` را می‌پذیرد)
 *
 * ⚠️ نکته‌ی قرارداد داده: بک‌اند `cabinPrice` را **جمع کل اقامت** می‌گذارد
 * (نه نرخ شب) و اقلام واقعی را در `nights[]` برمی‌گرداند.
 */
export interface GuestBookingsRepository {
  /** یک صفحه از رزروها (فیلترشده بر اساس تب). */
  list(query?: GuestBookingsQuery): Promise<GuestBookingsPage>;
  /** تعداد رزروها در هر تب — برای شمارنده‌ی روی تب‌ها. */
  counts(): Promise<GuestBookingsCounts>;
  /** یک رزرو با شناسه — برای صفحه‌ی پرداخت. */
  getById(id: number): Promise<GuestBooking | null>;
  /**
   * لغو یک رزرو «در انتظار پرداخت».
   *
   * @returns رزرو به‌روزشده، یا `null` اگر رزرو پیدا نشد یا دیگر
   * «در انتظار پرداخت» نبود (مثلاً مهلتش منقضی شده باشد).
   */
  cancel(id: number): Promise<GuestBooking | null>;
  /**
   * پرداخت (تأیید) یک رزرو «در انتظار پرداخت».
   *
   * ⚠️ این متد درگاه واقعی نیست: بک‌اند درگاه را شبیه‌سازی می‌کند
   * (`simulatePaymentGateway`) و رزرو را `confirmed` می‌کند.
   *
   * @returns رزرو به‌روزشده، یا `null` اگر پرداخت ممکن نبود (رزرو دیگر
   * `pending` نیست یا مهلت پرداختش گذشته است).
   */
  pay(id: number): Promise<GuestBooking | null>;
}

let repository: GuestBookingsRepository | null = null;

/** ⭐ تنها نقطه‌ی ساخت پیاده‌سازی — singleton در طول عمر سرور. */
export function getGuestBookingsRepository(): GuestBookingsRepository {
  repository ??= createApiGuestBookingsRepository();
  return repository;
}
