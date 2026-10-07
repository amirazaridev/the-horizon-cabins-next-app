import { BOOKING_TABS, statusesForTab } from "../constants/booking-status";
import { PAYMENT_WINDOW_MINUTES } from "../constants/payment";
import { GUEST_BOOKINGS_PAGE_SIZE } from "../config/bookings.config";
import type {
  CancellationReason,
  GuestBooking,
  GuestBookingNight,
  GuestBookingStatus,
  GuestBookingsCounts,
  GuestBookingsPage,
  GuestBookingsQuery,
} from "../types/guest-booking.types";
import type { GuestBookingsRepository } from "./guest-bookings.repository";

/**
 * پیاده‌سازی ماکِ مرز داده‌ی رزروهای مهمان.
 *
 * ⚠️ **داده‌ی ساختگی — فقط برای توسعه‌ی UI.** خروجی عیناً هم‌شکل پاسخ
 * واقعی `GET /bookings` است (تاریخ‌ها ISO، `cabin`/`guest` تودرتو،
 * `meta` صفحه‌بندی) تا وقتی بک‌اند وصل شد، جایگزینی این فایل هیچ اثری روی
 * کامپوننت‌ها نداشته باشد.
 */

/** تاریخ فقط‌تاریخی (`YYYY-MM-DD`) به‌فاصله‌ی n روز از امروز. */
function dateOffset(days: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

/** لحظه‌ی ISO به‌فاصله‌ی n روز از امروز. */
function momentOffset(days: number, hours = 10): string {
  const date = new Date();
  date.setHours(hours, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

const MOCK_GUEST = { id: 1, fullName: "کاربر مهمان" };

type BookingSeed = {
  id: number;
  cabinId: number;
  cabinName: string;
  /** فاصله‌ی تاریخ ورود از امروز (روز) — منفی یعنی گذشته. */
  startOffset: number;
  nights: number;
  guests: number;
  status: GuestBookingStatus;
  /** قیمت هر شب، تومان. */
  pricePerNight: number;
  cancellationReason?: CancellationReason;
  /**
   * فقط برای رزروهای `pending`: دقیقه‌ی باقی‌مانده تا مهلت پرداخت.
   *
   * ⚠️ عمداً دو مقدار متفاوت داریم (۳۰ و ۴ دقیقه) تا هر دو حالت هشدار —
   * «عادی» و «فوری» — در UI قابل مشاهده و تست باشد.
   */
  paymentMinutesLeft?: number;
};

/**
 * ⚠️ ترتیب آرایه = ترتیب نمایش؛ بک‌اند بر اساس `createdAt` نزولی مرتب
 * می‌کند و `buildBooking` بر همین اساس `createdAt` نزولی می‌سازد.
 */
const SEEDS: readonly BookingSeed[] = [
  {
    id: 1042,
    cabinId: 12,
    cabinName: "سوئیت جنگلی هیرکانی",
    startOffset: 12,
    nights: 3,
    guests: 2,
    status: "confirmed",
    pricePerNight: 2_400_000,
  },
  {
    id: 1041,
    cabinId: 7,
    cabinName: "کابین کوهستانی دماوند",
    startOffset: 40,
    nights: 2,
    guests: 4,
    status: "pending",
    pricePerNight: 2_100_000,
    paymentMinutesLeft: PAYMENT_WINDOW_MINUTES,
  },
  {
    id: 1039,
    cabinId: 3,
    cabinName: "ویلای ساحلی خزر",
    startOffset: 2,
    nights: 4,
    guests: 3,
    status: "checkedIn",
    pricePerNight: 3_200_000,
  },
  {
    id: 1036,
    cabinId: 9,
    cabinName: "اقامتگاه باغ ایرانی",
    startOffset: -18,
    nights: 2,
    guests: 2,
    status: "checkedOut",
    pricePerNight: 1_900_000,
  },
  {
    id: 1033,
    cabinId: 5,
    cabinName: "سوئیت شیشه‌ای جنگل",
    startOffset: -45,
    nights: 3,
    guests: 5,
    status: "cancelled",
    pricePerNight: 3_600_000,
    cancellationReason: "userCancelled",
  },
  {
    id: 1030,
    cabinId: 15,
    cabinName: "خانه چوبی لاهیجان",
    startOffset: 75,
    nights: 5,
    guests: 6,
    status: "confirmed",
    pricePerNight: 2_800_000,
  },
  {
    id: 1027,
    cabinId: 2,
    cabinName: "کابین دریاچه ولشت",
    startOffset: -8,
    nights: 1,
    guests: 2,
    status: "cancelled",
    pricePerNight: 1_800_000,
    cancellationReason: "paymentExpired",
  },
  {
    id: 1024,
    cabinId: 20,
    cabinName: "عمارت سنتی کاشان",
    startOffset: -70,
    nights: 2,
    guests: 3,
    status: "checkedOut",
    pricePerNight: 2_200_000,
  },
  {
    id: 1021,
    cabinId: 11,
    cabinName: "سوئیت صخره‌ای کندوان",
    startOffset: 28,
    nights: 3,
    guests: 2,
    status: "pending",
    pricePerNight: 2_600_000,
    paymentMinutesLeft: 4,
  },
  {
    id: 1018,
    cabinId: 6,
    cabinName: "ویلای جنگلی رامسر",
    startOffset: -120,
    nights: 4,
    guests: 4,
    status: "checkedOut",
    pricePerNight: 3_000_000,
  },
  {
    id: 1015,
    cabinId: 18,
    cabinName: "کابین زاگرس",
    startOffset: -33,
    nights: 2,
    guests: 2,
    status: "cancelled",
    pricePerNight: 1_700_000,
    cancellationReason: "adminCancelled",
  },
  {
    id: 1012,
    cabinId: 1,
    cabinName: "سوئیت ساحلی کیش",
    startOffset: 150,
    nights: 6,
    guests: 5,
    status: "confirmed",
    pricePerNight: 4_500_000,
  },
];

/**
 * لغوهایی که کاربر در طول عمر همین پروسه انجام داده است.
 *
 * ⚠️ چون هنوز بک‌اندی برای ذخیره وجود ندارد، «لغو رزرو» در همین ماژول
 * نگه داشته می‌شود تا جریان UI واقعاً کار کند (لغو → به‌روزشدن لیست).
 * با اتصال API این Map و کل مسیر ماک حذف می‌شوند.
 */
const userCancellations = new Map<
  number,
  { at: string; reason: CancellationReason }
>();

/** روزهای آخر هفته‌ی ایران (`Date#getDay`): پنجشنبه و جمعه. */
const PERSIAN_WEEKEND_DAYS: readonly number[] = [4, 5];

/** درصد افزایش نرخ در آخر هفته — همان مفهوم موتور قیمت‌گذاری بک‌اند. */
const WEEKEND_SURCHARGE_PERCENT = 15;

/** درصد تخفیف اقامت بلند (۴ شب و بیشتر). */
const LONG_STAY_DISCOUNT_PERCENT = 10;

/**
 * ساخت قیمت هر شب — هم‌شکل `BookingNight` بک‌اند.
 *
 * ⚠️ عمداً نرخ‌ها یکنواخت نیستند (آخر هفته گران‌تر، اقامت بلند ارزان‌تر) تا
 * صورت‌حساب حالت واقعی «اقلام متفاوت» را نشان دهد و UI فقط برای داده‌ی
 * یکنواخت تست نشده باشد.
 */
function buildNights(seed: BookingSeed): GuestBookingNight[] {
  const discountPercent =
    seed.nights >= 4 ? LONG_STAY_DISCOUNT_PERCENT : 0;

  return Array.from({ length: seed.nights }, (_, index) => {
    const date = dateOffset(seed.startOffset + index);
    const weekday = new Date(`${date}T00:00:00`).getDay();
    const surchargePercent = PERSIAN_WEEKEND_DAYS.includes(weekday)
      ? WEEKEND_SURCHARGE_PERCENT
      : 0;
    const finalPrice = Math.round(
      seed.pricePerNight *
        (1 + surchargePercent / 100) *
        (1 - discountPercent / 100),
    );

    return {
      date,
      basePrice: seed.pricePerNight,
      discountPercent,
      surchargePercent,
      finalPrice,
    };
  });
}

function buildBooking(seed: BookingSeed, index: number): GuestBooking {
  const override = userCancellations.get(seed.id);
  const status: GuestBookingStatus = override ? "cancelled" : seed.status;

  const startDate = dateOffset(seed.startOffset);
  const endDate = dateOffset(seed.startOffset + seed.nights);
  // نزولی: آیتم صفر تازه‌ترین رزرو است.
  const createdAt = momentOffset(-(7 * index + 3));
  const isPaid =
    status === "confirmed" ||
    status === "checkedIn" ||
    status === "checkedOut";
  const isCancelled = status === "cancelled";

  const nights = buildNights(seed);
  // ⚠️ هم‌خوان با بک‌اند: `cabinPrice` جمع کل اقامت (subtotal) است، نه نرخ شب.
  const subtotal = nights.reduce((sum, night) => sum + night.finalPrice, 0);

  /**
   * ⚠️ مهلت پرداخت **نسبت به لحظه‌ی خواندن** ساخته می‌شود، نه لحظه‌ی
   * بارگذاری ماژول؛ وگرنه شمارش معکوس صفحه بعد از ۳۰ دقیقه‌ای که سرور
   * بالا مانده بی‌دلیل منقضی می‌شد.
   */
  const paymentDeadline =
    status === "pending"
      ? new Date(
          Date.now() +
            (seed.paymentMinutesLeft ?? PAYMENT_WINDOW_MINUTES) * 60_000,
        ).toISOString()
      : new Date(
          new Date(createdAt).getTime() + PAYMENT_WINDOW_MINUTES * 60_000,
        ).toISOString();

  return {
    id: seed.id,
    startDate,
    endDate,
    numNights: seed.nights,
    numGuests: seed.guests,
    cabinPrice: subtotal,
    totalPrice: subtotal,
    status,
    paymentDeadline,
    paidAt: isPaid ? paymentDeadline : null,
    paymentReference: isPaid ? `PAY-${seed.id}` : null,
    cancelledAt: isCancelled
      ? (override?.at ?? momentOffset(seed.startOffset - 20))
      : null,
    cancellationReason: isCancelled
      ? (override?.reason ?? seed.cancellationReason ?? "userCancelled")
      : null,
    observations: null,
    createdAt,
    updatedAt: override?.at ?? createdAt,
    cabin: { id: seed.cabinId, name: seed.cabinName },
    guest: MOCK_GUEST,
    nights,
  };
}

/** همه‌ی رزروها با وضعیت به‌روز (شامل لغوهای همین پروسه). */
function allBookings(): GuestBooking[] {
  return SEEDS.map((seed, index) => buildBooking(seed, index));
}

export function createMockGuestBookingsRepository(): GuestBookingsRepository {
  return {
    async list(query: GuestBookingsQuery = {}): Promise<GuestBookingsPage> {
      const tab = query.tab ?? "all";
      const limit = Math.max(1, query.limit ?? GUEST_BOOKINGS_PAGE_SIZE);
      const requestedPage = Math.max(1, query.page ?? 1);

      const allowed = statusesForTab(tab);
      const filtered = allBookings().filter((booking) =>
        allowed.includes(booking.status),
      );

      const totalItems = filtered.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / limit));
      const currentPage = Math.min(requestedPage, totalPages);
      const start = (currentPage - 1) * limit;

      return {
        bookings: filtered.slice(start, start + limit),
        meta: {
          totalItems,
          totalPages,
          currentPage,
          limit,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        },
      };
    },

    async counts(): Promise<GuestBookingsCounts> {
      const bookings = allBookings();

      return BOOKING_TABS.reduce((acc, tab) => {
        acc[tab.id] = bookings.filter((booking) =>
          tab.statuses.includes(booking.status),
        ).length;
        return acc;
      }, {} as GuestBookingsCounts);
    },

    async getById(id: number): Promise<GuestBooking | null> {
      const index = SEEDS.findIndex((seed) => seed.id === id);
      return index === -1 ? null : buildBooking(SEEDS[index], index);
    },

    async cancel(id: number): Promise<GuestBooking | null> {
      const index = SEEDS.findIndex((seed) => seed.id === id);
      if (index === -1) return null;

      // ⚠️ فقط رزرو «در انتظار پرداخت» قابل لغو است؛ بقیه بی‌صدا رد می‌شوند
      // تا UI پیام درستی نشان دهد (نه این‌که وضعیت را عوض کند).
      const current = buildBooking(SEEDS[index], index);
      if (current.status !== "pending") return null;

      userCancellations.set(id, {
        at: new Date().toISOString(),
        reason: "userCancelled",
      });

      return buildBooking(SEEDS[index], index);
    },
  };
}
