import type { GuestBookingStatus } from "@/features/guest/bookings/types/guest-booking.types";

/** پارامترهای URL صفحه (هم‌شکل `searchParams` نکست). */
export type BookingsSearchParams = Record<string, string | string[] | undefined>;

/** تعداد رزرو در هر صفحه. */
export const BOOKINGS_PAGE_SIZE = 10;

/** همه‌ی وضعیت‌های ممکن — آینه‌ی enum بک‌اند. */
export const BOOKING_STATUS_VALUES: readonly GuestBookingStatus[] = [
  "pending",
  "confirmed",
  "checkedIn",
  "checkedOut",
  "cancelled",
];

/** فیلترهای نرمال‌شده‌ی صفحه‌ی رزروها (منبع حقیقت: URL). */
export interface BookingsFilters {
  statuses: GuestBookingStatus[];
  cabinId: number | null;
  cityId: number | null;
  /** ابتدای بازه‌ی تاریخ ورود (`YYYY-MM-DD`) — یا رشته‌ی خالی. */
  from: string;
  to: string;
  /** جستجوی نام مهمان. */
  query: string;
  page: number;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function one(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function parsePositiveInt(raw: string): number | null {
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : null;
}

/** `status` می‌تواند CSV باشد (`confirmed,checkedIn`) یا تک‌مقداری. */
function parseStatuses(raw: string): GuestBookingStatus[] {
  const valid = raw
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is GuestBookingStatus =>
      (BOOKING_STATUS_VALUES as readonly string[]).includes(item),
    );
  return [...new Set(valid)];
}

/** خواندن فیلترها از URL — مقادیر نامعتبر بی‌اثر می‌شوند. */
export function parseBookingsFilters(
  params: BookingsSearchParams,
): BookingsFilters {
  const from = one(params.from);
  const to = one(params.to);

  return {
    statuses: parseStatuses(one(params.status)),
    cabinId: parsePositiveInt(one(params.cabin)),
    cityId: parsePositiveInt(one(params.city)),
    from: DATE_RE.test(from) ? from : "",
    to: DATE_RE.test(to) ? to : "",
    query: one(params.q).trim(),
    page: parsePositiveInt(one(params.page)) ?? 1,
  };
}

/** آیا فیلتری (غیر از صفحه‌بندی) فعال است؟ */
export function hasActiveBookingsFilters(filters: BookingsFilters): boolean {
  return (
    filters.statuses.length > 0 ||
    filters.cabinId !== null ||
    filters.cityId !== null ||
    filters.from !== "" ||
    filters.to !== "" ||
    filters.query !== ""
  );
}

/**
 * ساخت کوئری API از فیلترها.
 *
 * ⚠️ `guestQuery` فقط با حداقل ۲ کاراکتر فرستاده می‌شود (قرارداد اعتبارسنجی
 * بک‌اند) تا درخواست بی‌دلیل ۴۰۰ نگیرد.
 */
export function toBookingsApiQuery(filters: BookingsFilters): string {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(BOOKINGS_PAGE_SIZE));

  if (filters.statuses.length) params.set("statuses", filters.statuses.join(","));
  if (filters.cabinId !== null) params.set("cabinId", String(filters.cabinId));
  if (filters.cityId !== null) params.set("cityId", String(filters.cityId));
  if (filters.from) params.set("startDateFrom", filters.from);
  if (filters.to) params.set("startDateTo", filters.to);
  if (filters.query.length >= 2) params.set("guestQuery", filters.query);

  return params.toString();
}
