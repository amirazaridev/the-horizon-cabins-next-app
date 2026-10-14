import type { PaginationMeta } from "@/types/api-response";

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

export type GuestBooking = {
  id: number;
  /** تاریخ ورود (`YYYY-MM-DD`). */
  startDate: string;
  /** تاریخ خروج (`YYYY-MM-DD`). */
  endDate: string;
  numNights: number;
  numGuests: number;
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
  nights?: readonly GuestBookingNight[];
};

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
