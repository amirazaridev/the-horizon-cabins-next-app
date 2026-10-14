import type {
  GuestBooking,
  GuestBookingsCounts,
  GuestBookingsPage,
  GuestBookingsQuery,
} from "../types/guest-booking.types";
import { createApiGuestBookingsRepository } from "./api-guest-bookings.repository";

export interface GuestBookingsRepository {
  /** یک صفحه از رزروها (فیلترشده بر اساس تب). */
  list(query?: GuestBookingsQuery): Promise<GuestBookingsPage>;
  /** تعداد رزروها در هر تب — برای شمارنده‌ی روی تب‌ها. */
  counts(): Promise<GuestBookingsCounts>;
  /** یک رزرو با شناسه — برای صفحه‌ی پرداخت. */
  getById(id: number): Promise<GuestBooking | null>;
  cancel(id: number): Promise<GuestBooking | null>;
  pay(id: number): Promise<GuestBooking | null>;
}

let repository: GuestBookingsRepository | null = null;

/** ⭐ تنها نقطه‌ی ساخت پیاده‌سازی — singleton در طول عمر سرور. */
export function getGuestBookingsRepository(): GuestBookingsRepository {
  repository ??= createApiGuestBookingsRepository();
  return repository;
}
