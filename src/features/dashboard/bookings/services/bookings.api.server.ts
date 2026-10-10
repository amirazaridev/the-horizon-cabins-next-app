import "server-only";

import { authFetch } from "@/libs/api/authFetch";
import type { PaginationMeta } from "@/types/api-response";
import type { GuestBooking } from "@/features/guest/bookings/types/guest-booking.types";

/**
 * لایه‌ی داده‌ی صفحه‌ی رزروهای داشبورد — **سرور-ساید**.
 *
 * صفحه‌ی `dashboard/bookings/page.tsx` (Server Component) این توابع را صدا
 * می‌زند؛ توکن از کوکی سرور با `authFetch` فوروارد می‌شود.
 */

export interface BookingsPage {
  bookings: GuestBooking[];
  meta: PaginationMeta;
}

/** یک صفحه از رزروها با فیلترهای اعمال‌شده روی بک‌اند. */
export async function fetchBookings(apiQuery: string): Promise<BookingsPage> {
  const res = await authFetch(`bookings?${apiQuery}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`دریافت رزروها ناموفق بود (HTTP ${res.status}).`);
  }

  const json = (await res.json()) as {
    data?: { bookings?: GuestBooking[]; meta?: PaginationMeta };
  };

  if (!json.data?.meta) {
    throw new Error("پاسخ رزروها نامعتبر بود.");
  }

  return { bookings: json.data.bookings ?? [], meta: json.data.meta };
}

/** گزینه‌ی سبک برای dropdown فیلتر. */
export interface BookingsFilterOption {
  id: number;
  name: string;
}

export interface BookingsFilterOptions {
  cabins: BookingsFilterOption[];
  cities: BookingsFilterOption[];
}

/**
 * گزینه‌های فیلتر (اقامتگاه و شهر) — مستقل از بازه و وضعیت.
 * هر دو endpoint عمومی‌اند، ولی برای یکدستی از `authFetch` استفاده می‌شود.
 */
export async function fetchBookingsFilterOptions(): Promise<BookingsFilterOptions> {
  const [cabinsRes, citiesRes] = await Promise.all([
    authFetch("cabins?limit=100", {
      cache: "force-cache",
      next: { revalidate: 300, tags: ["cabins-data"] },
    }),
    authFetch("locations/cities", {
      cache: "force-cache",
      next: { revalidate: 300, tags: ["cities-data"] },
    }),
  ]);

  if (!cabinsRes.ok || !citiesRes.ok) {
    throw new Error("دریافت گزینه‌های فیلتر رزروها ناموفق بود.");
  }

  const cabinsJson = (await cabinsRes.json()) as {
    data?: { cabins?: BookingsFilterOption[] };
  };
  const citiesJson = (await citiesRes.json()) as {
    data?: { cities?: BookingsFilterOption[] };
  };

  return {
    cabins: cabinsJson.data?.cabins ?? [],
    cities: citiesJson.data?.cities ?? [],
  };
}
