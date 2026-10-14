export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "checkedIn"
  | "checkedOut";

export type CancellationReason =
  | "paymentExpired"
  | "userCancelled"
  | "adminCancelled";

/** معادل `enum UserRole` — مالک شرکت و مدیر سایت دسترسی داشبورد دارند. */
export type UserRole = "admin" | "owner" | "guest";

export type PaymentStatus = "paid" | "unpaid";

export interface DashboardCabin {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  bedrooms: number;
  bathrooms: number;

  cityId: number;
  /** رابطه‌ی eager-load شده — در `GET /cabins` به‌شکل `{id, name}` می‌آید */
  city?: {
    id: number;
    name: string;
    regionId?: number;
    region?: { id: number; name: string; slug: string };
  };

  createdAt: Date;
  updatedAt: Date;
}

/** شهر — معادل `model City`. */
export interface DashboardCity {
  id: number;
  name: string;
  regionId: number;
  region?: { id: number; name: string; slug: string };
}

export interface DashboardGuest {
  id: number;
  fullName: string;
  phoneNumber?: string | null;
  nationalId?: string | null;
}

export interface DashboardBooking {
  id: number;

  /** ISO datetime — تاریخ ورود */
  startDate: Date;
  /** ISO datetime — تاریخ خروج (شب خروج اقامت حساب نمی‌شود) */
  endDate: Date;
  numNights: number;
  numGuests: number;

  /** مبلغ اقامت هر شب × تعداد شب — `Int` در Prisma */
  cabinPrice: number;
  /** مبلغ نهایی — `Int` در Prisma */
  totalPrice: number;

  status: BookingStatus;
  paymentDeadline: Date | null;
  paidAt: Date | null;
  paymentReference: string | null;

  cancelledAt: Date | null;
  cancellationReason: CancellationReason | null;

  cabinId: number;
  guestId: number;

  /** ISO datetime — تاریخ ثبت رزرو (مبنای LeadTime و CancellationRate) */
  createdAt: Date;
  updatedAt: Date;

  /** رابطه‌ها — در mock پر می‌شوند؛ در API با `include` */
  guest?: DashboardGuest;
  cabin?: { id: number; name: string };
}

/** ورودی «اقدام امروز» — مشتق‌شده از رزروها؛ ستون دیتابیس نیست. */
export type TodayActivityKind = "arrival" | "departure";

export interface TodayActivityItem {
  bookingId: number;
  kind: TodayActivityKind;
  guestName: string;
  cabinName: string;
  numNights: number;
  numGuests: number;
  status: BookingStatus;
}

export type CompareMode = "prev-period" | "prev-year" | "none";

/** همه‌ی فیلترهای داشبورد — تک‌منبع، سریال‌شده در URL. */
export interface DashboardFilters {
  from: Date;
  to: Date;
  numDays: number;

  cities: number[];
  cabinIds: number[];
  statuses: BookingStatus[];
  paymentStatuses: PaymentStatus[];

  compare: CompareMode;
}

/** برچسب‌های فارسی enumها — تک‌منبع برای UI و drill-down. */
export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "در انتظار پرداخت",
  confirmed: "تأیید شده",
  cancelled: "لغو شده",
  checkedIn: "در اقامت",
  checkedOut: "خروج کرده",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: "پرداخت‌شده",
  unpaid: "پرداخت‌نشده",
};

export const COMPARE_MODE_LABELS: Record<CompareMode, string> = {
  "prev-period": "دوره قبل",
  "prev-year": "سال قبل",
  none: "بدون مقایسه",
};

export const ACTIVE_BOOKING_STATUSES: readonly BookingStatus[] = [
  "pending",
  "confirmed",
  "checkedIn",
] as const;

export const SOLD_STATUSES: readonly BookingStatus[] = [
  "pending",
  "confirmed",
  "checkedIn",
  "checkedOut",
] as const;

/** رزروهای لغوشده — فقط برای نرخ لغو. */
export const CANCELLED_STATUSES: readonly BookingStatus[] = ["cancelled"] as const;

export const PAID_STATUSES: readonly BookingStatus[] = [
  "confirmed",
  "checkedIn",
  "checkedOut",
] as const;
