import "server-only";

import { authFetch } from "@/libs/api/authFetch";
import type { PaginationMeta } from "@/types/api-response";
import { GUEST_BOOKINGS_PAGE_SIZE } from "../config/bookings.config";
import { BOOKING_TABS, statusesForTab } from "../constants/booking-status";
import type {
  GuestBooking,
  GuestBookingStatus,
  GuestBookingsCounts,
  GuestBookingsPage,
  GuestBookingsQuery,
} from "../types/guest-booking.types";
import type { GuestBookingsRepository } from "./guest-bookings.repository";

/**
 * پیاده‌سازی APIِ مرز داده‌ی رزروهای مهمان — **server-only**.
 *
 * ⚠️ چرا server-only؟ چون با `authFetch` تماس می‌گیرد که توکن را از کوکی
 * سرور می‌خواند؛ نباید هرگز در باندل کلاینت بیاید.
 *
 * ⚠️ قرارداد داده با بک‌اند:
 *   - `GET  /bookings?page&limit&status` → `{ data: { bookings, meta } }`
 *     و چون نقش `guest` است، بک‌اند خودکار به رزروهای خودِ کاربر محدود می‌کند.
 *   - `GET  /bookings/:id`  → `{ data: { booking } }` (شامل `nights[]`)
 *   - `POST /bookings/:id/cancel` → رزرو به‌روزشده؛ فقط `pending` را می‌پذیرد.
 *   - `cabinPrice` جمع کل اقامت است (نه نرخ شب) و اقلام واقعی در `nights[]`.
 */

/** همه‌ی وضعیت‌های ممکن — آینه‌ی enum بک‌اند؛ برای شمارش تب‌ها لازم است. */
const ALL_STATUSES: readonly GuestBookingStatus[] = [
  "pending",
  "confirmed",
  "checkedIn",
  "checkedOut",
  "cancelled",
];

/** سقف `limit` که بک‌اند اعمال می‌کند (`getPagination`). */
const MAX_LIMIT = 100;

type ApiListResponse = {
  status: "success" | "fail" | "error";
  data?: { bookings: GuestBooking[]; meta: PaginationMeta };
};

type ApiSingleResponse = {
  status: "success" | "fail" | "error";
  data?: { booking: GuestBooking };
};

async function readJson<T>(res: Response): Promise<T | null> {
  return (await res.json().catch(() => null)) as T | null;
}

/** یک صفحه از `GET /bookings` — با فیلتر اختیاری وضعیت. */
async function fetchBookingsPage(
  status: GuestBookingStatus | undefined,
  page: number,
  limit: number,
): Promise<GuestBookingsPage> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) params.set("status", status);

  const res = await authFetch(`bookings?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load bookings (HTTP ${res.status})`);

  const json = await readJson<ApiListResponse>(res);
  if (!json?.data) throw new Error("Malformed bookings response");

  return { bookings: json.data.bookings, meta: json.data.meta };
}

/** تعداد رزروها در یک وضعیت — با `limit=1` فقط `meta.totalItems` خوانده می‌شود. */
async function countByStatus(status: GuestBookingStatus): Promise<number> {
  const page = await fetchBookingsPage(status, 1, 1);
  return page.meta.totalItems;
}

/** مرتب‌سازی نزولی بر اساس `createdAt` — همان ترتیبی که بک‌اند می‌دهد. */
function byCreatedAtDesc(a: GuestBooking, b: GuestBooking): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export function createApiGuestBookingsRepository(): GuestBookingsRepository {
  return {
    async list(query: GuestBookingsQuery = {}): Promise<GuestBookingsPage> {
      const tab = query.tab ?? "all";
      const limit = Math.max(1, query.limit ?? GUEST_BOOKINGS_PAGE_SIZE);
      const page = Math.max(1, query.page ?? 1);
      const statuses = statusesForTab(tab);

      // «همه» و تب‌های تک‌وضعیتی → صفحه‌بندی را خود سرور درست انجام می‌دهد.
      if (tab === "all" || statuses.length === 1) {
        return fetchBookingsPage(statuses.length === 1 ? statuses[0] : undefined, page, limit);
      }

      // تب چندوضعیتی (فقط «جاری» = confirmed + checkedIn):
      // API فقط یک `status` می‌پذیرد، پس هر وضعیت را تا انتهای صفحه‌ی جاری
      // می‌خوانیم، ادغام و برش می‌زنیم. تعداد رزروهای یک مهمان کم است، پس
      // این ساده‌ترین راهِ درست است.
      const take = Math.min(page * limit, MAX_LIMIT);
      const pages = await Promise.all(statuses.map((status) => fetchBookingsPage(status, 1, take)));

      const totalItems = pages.reduce((sum, page) => sum + page.meta.totalItems, 0);
      const totalPages = Math.max(1, Math.ceil(totalItems / limit));
      const start = (page - 1) * limit;

      const bookings = pages
        .flatMap((page) => page.bookings)
        .sort(byCreatedAtDesc)
        .slice(start, start + limit);

      return {
        bookings,
        meta: {
          totalItems,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    },

    async counts(): Promise<GuestBookingsCounts> {
      const totals = await Promise.all(ALL_STATUSES.map(countByStatus));
      const byStatus = Object.fromEntries(
        ALL_STATUSES.map((status, index) => [status, totals[index]]),
      ) as Record<GuestBookingStatus, number>;

      return BOOKING_TABS.reduce((acc, tab) => {
        acc[tab.id] = statusesForTab(tab.id).reduce((sum, status) => sum + byStatus[status], 0);
        return acc;
      }, {} as GuestBookingsCounts);
    },

    async getById(id: number): Promise<GuestBooking | null> {
      const res = await authFetch(`bookings/${id}`, { cache: "no-store" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Failed to load booking ${id} (HTTP ${res.status})`);

      const json = await readJson<ApiSingleResponse>(res);
      return json?.data?.booking ?? null;
    },

    async cancel(id: number): Promise<GuestBooking | null> {
      // بک‌اند فقط رزرو `pending` را می‌پذیرد؛ 404/409 ⇒ null یعنی
      // «قابل لغو نبود» (قبلاً لغو/پرداخت‌شده یا مهلتش گذشته).
      const res = await authFetch(`bookings/${id}/cancel`, {
        method: "POST",
        cache: "no-store",
      });
      if (!res.ok) return null;

      const json = await readJson<ApiSingleResponse>(res);
      return json?.data?.booking ?? null;
    },

    async pay(id: number): Promise<GuestBooking | null> {
      // بک‌اند فقط رزرو `pending` با مهلتِ نگذشته را تأیید می‌کند؛ 409 ⇒
      // null یعنی «قابل پرداخت نبود» (قبلاً پرداخت‌شده یا منقضی).
      const res = await authFetch(`bookings/${id}/pay`, {
        method: "POST",
        cache: "no-store",
      });
      if (!res.ok) return null;

      const json = await readJson<ApiSingleResponse>(res);
      return json?.data?.booking ?? null;
    },
  };
}
