import type {
  GuestBookingsCounts,
  GuestBookingsPage,
  GuestBookingsQuery,
} from "../types/guest-booking.types";
import { createMockGuestBookingsRepository } from "./mock-guest-bookings.repository";

/**
 * مرز داده‌ی رزروهای مهمان.
 *
 * ⚠️ تنها لایه‌ای که UI با آن حرف می‌زند. امروز پیاده‌سازی ماک پشت این
 * اینترفیس است؛ فردا فقط یک پیاده‌سازی API نوشته می‌شود و همین‌جا برگردانده
 * می‌شود — هیچ کامپوننتی تغییر نمی‌کند.
 */
export interface GuestBookingsRepository {
  /** یک صفحه از رزروها (فیلترشده بر اساس تب). */
  list(query?: GuestBookingsQuery): Promise<GuestBookingsPage>;
  /** تعداد رزروها در هر تب — برای شمارنده‌ی روی تب‌ها. */
  counts(): Promise<GuestBookingsCounts>;
}

let repository: GuestBookingsRepository | null = null;

/**
 * ⭐ تنها نقطه‌ی تعویض mock ↔ API.
 *
 * TODO(backend): اندپوینت واقعی **از قبل موجود است** —
 *   `GET /bookings?page&limit&status`
 * که برای نقش `guest` خودکار به رزروهای خودِ کاربر محدود می‌شود. برای
 * اتصال، یک پیاده‌سازی با `authFetch` (server-only) بنویسید که همان شکل
 * `{ bookings, meta }` را برگرداند و اینجا جایگزین ماک شود. شمارنده‌ی
 * تب‌ها هم می‌تواند از `meta.totalItems` هر درخواست `status` ساخته شود.
 */
export function getGuestBookingsRepository(): GuestBookingsRepository {
  repository ??= createMockGuestBookingsRepository();
  return repository;
}
