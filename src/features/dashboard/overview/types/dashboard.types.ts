/**
 * تایپ‌های دامنه‌ی داشبورد مدیریتی.
 *
 * ⚠️ منبع حقیقت این تایپ‌ها اسکیمای Prisma در پروژه‌ی API است
 * (`the-horizon-cabins-API-TS/prisma/schema.prisma`). هر فیلد اینجا
 * عمداً هم‌نام و هم‌نوع با ستون واقعی دیتابیس است تا هنگام مهاجرت از
 * mock به API، **هیچ تغییری در UI و توابع metrics لازم نباشد**.
 *
 * نگاشت کامل در `docs/supabase-migration-notes.md` مستند شده است.
 */

/* ==========================================================================
   ENUMS — عیناً معادل enumهای Prisma
   ========================================================================== */

/**
 * وضعیت رزرو — معادل `enum BookingStatus` در Prisma.
 *
 * جریان واقعی بک‌اند:
 * ```
 * pending → confirmed → checkedIn → checkedOut
 *        ↘ cancelled
 * ```
 * ⚠️ حالت `no-show` در اسکیمای واقعی **وجود ندارد**. به‌جای آن
 * `cancellationReason = paymentExpired` معیار «پرداخت منقضی» است.
 */
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "checkedIn"
  | "checkedOut";

/**
 * دلیل لغو — معادل `enum CancellationReason` در Prisma.
 * ⚠️ مقادیر با `@map` در دیتابیس snake_case هستند
 * (`payment_expired` …) ولی در Prisma Client camelCase برمی‌گردند.
 */
export type CancellationReason =
  | "paymentExpired"
  | "userCancelled"
  | "adminCancelled";

/** معادل `enum UserRole` — مالک شرکت و مدیر سایت دسترسی داشبورد دارند. */
export type UserRole = "admin" | "owner" | "guest";

/**
 * وضعیت پرداخت — **مشتق از `status`**، نه ستون دیتابیس.
 *
 * قاعده (تصمیم کاربر):
 * - `cancelled` و `pending` ⇒ **پرداخت‌نشده** (`unpaid`)
 * - بقیه (`confirmed`/`checkedIn`/`checkedOut`) ⇒ **پرداخت‌شده** (`paid`)
 *
 * ⚠️ هیچ فیلد `paidAmount` یا جدول پرداخت لازم نیست؛ مبلغ پرداختی برای
 * رزروهای پرداخت‌شده همان `totalPrice` است.
 */
export type PaymentStatus = "paid" | "unpaid";

/* ==========================================================================
   ENTITIES — آینه‌ی مدل‌های Prisma
   ========================================================================== */

/**
 * اقامتگاه — معادل `model Cabin`.
 *
 * ⚠️ در UI واژه‌ی «اقامتگاه» استفاده می‌شود (کاربر: مالک ویلا است ولی
 * سوییت هم در محصولات هست). شناسه/مسیر در کد همان `cabin` می‌ماند.
 */
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

/**
 * مهمان — معادل `model Guest` (کاهش‌یافته به فیلدهای لازم داشبورد).
 * ⚠️ `Guest` جداست از `User`؛ `guestId` رزرو به `Guest.id` اشاره دارد.
 */
export interface DashboardGuest {
  id: number;
  fullName: string;
  phoneNumber?: string | null;
  nationalId?: string | null;
}

/**
 * رزرو — آینه‌ی `model Booking`.
 *
 * ### تفاوت‌های عمدی با بک‌اند
 * - `totalPrice` در Prisma از نوع `Int` است، پس این‌جا هم `number` است.
 * - `extrasPrice`/`hasBreakfast` اساساً در DB وجود ندارند (تصمیم کاربر:
 *   فروش افزونه لازم نیست) و حذف شده‌اند.
 * - `guestName` حذف شد؛ رابطه‌ی `guest` جای آن را گرفته.
 * - `channel` (کانال فروش) و `paidAmount` **کاملاً حذف شدند** (بدون تغییر
 *   اسکیما؛ پرداخت به‌صورت دوتایی از `status` مشتق می‌شود).
 */
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

/* ==========================================================================
   FILTER TYPES
   ========================================================================== */

/**
 * حالت مقایسه‌ی KPIها.
 * - `prev-period`      → دوره‌ی قبل به همان طول
 * - `prev-year`        → همان دوره در سال قبل (YoY)
 * - `none`             → بدون مقایسه
 */
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

/**
 * وضعیت‌هایی که طبق بک‌اند، کابین را برای بازه‌ی تاریخ **اشغال/محجوز**
 * می‌کنند — عیناً معادل `ACTIVE_BOOKING_STATUSES` در
 * `the-horizon-cabins-API-TS/src/constants/booking.constants.ts`.
 *
 * ⚠️ `checkedOut` عمداً نیست: رزرو تمام‌شده مانع رزرو جدید نمی‌شود.
 * در محاسبه‌ی اشغال تاریخی، `checkedOut` هم به‌عنوان شبِ فروخته‌شده
 * شمرده می‌شود (نگاه کنید به `SOLD_STATUSES`).
 */
export const ACTIVE_BOOKING_STATUSES: readonly BookingStatus[] = [
  "pending",
  "confirmed",
  "checkedIn",
] as const;

/**
 * وضعیت‌هایی که شب‌هایشان «فروخته‌شده» حساب می‌شود (Occupancy/ADR/RevPAR).
 * شامل `checkedOut` هم هست چون آن شب‌ها واقعاً فروش رفته‌اند.
 * `cancelled` حذف است — پول و شب نمی‌دهد.
 */
export const SOLD_STATUSES: readonly BookingStatus[] = [
  "pending",
  "confirmed",
  "checkedIn",
  "checkedOut",
] as const;

/** رزروهای لغوشده — فقط برای نرخ لغو. */
export const CANCELLED_STATUSES: readonly BookingStatus[] = ["cancelled"] as const;

/**
 * وضعیت‌هایی که «پرداخت‌شده» تلقی می‌شوند — برای فیلتر دوتایی پرداخت.
 * `cancelled`/`pending` پرداخت‌نشده‌اند (تصمیم کاربر).
 */
export const PAID_STATUSES: readonly BookingStatus[] = [
  "confirmed",
  "checkedIn",
  "checkedOut",
] as const;
