import { BOOKING_TABS, statusesForTab } from "../constants/booking-status";
import { GUEST_BOOKINGS_PAGE_SIZE } from "../config/bookings.config";
import type {
  CancellationReason,
  GuestBooking,
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

function buildBooking(seed: BookingSeed, index: number): GuestBooking {
  const startDate = dateOffset(seed.startOffset);
  const endDate = dateOffset(seed.startOffset + seed.nights);
  // نزولی: آیتم صفر تازه‌ترین رزرو است.
  const createdAt = momentOffset(-(7 * index + 3));
  const isPaid =
    seed.status === "confirmed" ||
    seed.status === "checkedIn" ||
    seed.status === "checkedOut";
  const isCancelled = seed.status === "cancelled";

  const paymentDeadline =
    seed.status === "pending"
      ? new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString()
      : new Date(new Date(createdAt).getTime() + 30 * 60 * 1000).toISOString();

  return {
    id: seed.id,
    startDate,
    endDate,
    numNights: seed.nights,
    numGuests: seed.guests,
    cabinPrice: seed.pricePerNight,
    totalPrice: seed.pricePerNight * seed.nights,
    status: seed.status,
    paymentDeadline,
    paidAt: isPaid ? paymentDeadline : null,
    paymentReference: isPaid ? `PAY-${seed.id}` : null,
    cancelledAt: isCancelled ? momentOffset(seed.startOffset - 20) : null,
    cancellationReason: isCancelled
      ? (seed.cancellationReason ?? "userCancelled")
      : null,
    observations: null,
    createdAt,
    updatedAt: createdAt,
    cabin: { id: seed.cabinId, name: seed.cabinName },
    guest: MOCK_GUEST,
  };
}

const MOCK_BOOKINGS: readonly GuestBooking[] = SEEDS.map((seed, index) =>
  buildBooking(seed, index),
);

export function createMockGuestBookingsRepository(): GuestBookingsRepository {
  return {
    async list(query: GuestBookingsQuery = {}): Promise<GuestBookingsPage> {
      const tab = query.tab ?? "all";
      const limit = Math.max(1, query.limit ?? GUEST_BOOKINGS_PAGE_SIZE);
      const requestedPage = Math.max(1, query.page ?? 1);

      const allowed = statusesForTab(tab);
      const filtered = MOCK_BOOKINGS.filter((booking) =>
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
      return BOOKING_TABS.reduce((acc, tab) => {
        acc[tab.id] = MOCK_BOOKINGS.filter((booking) =>
          tab.statuses.includes(booking.status),
        ).length;
        return acc;
      }, {} as GuestBookingsCounts);
    },
  };
}
