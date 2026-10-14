import "server-only";

import { authFetch } from "@/libs/api/authFetch";
import type { PaginationMeta } from "@/types/api-response";
import type { GuestBooking } from "@/features/guest/bookings/types/guest-booking.types";
import { fetchFilterOptions } from "../../shared/api/filter-options.api";

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

export async function fetchBookingsFilterOptions(): Promise<BookingsFilterOptions> {
  const { cabins, cities } = await fetchFilterOptions<
    BookingsFilterOption,
    BookingsFilterOption
  >();

  return { cabins, cities };
}
