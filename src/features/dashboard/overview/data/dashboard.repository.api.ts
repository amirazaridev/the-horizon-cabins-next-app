import type {
  DashboardBooking,
  DashboardFilters,
} from "../types/dashboard.types";
import { formatDateKey } from "../lib/date-range";
import {
  checkInBookingAction,
  checkOutBookingAction,
} from "../actions/dashboard.actions";
import {
  hydrateBooking,
  hydrateSnapshot,
  type DashboardBookingJson,
  type DashboardSnapshotJson,
} from "./dashboard.hydrate";
import type { DashboardRepository, DashboardSnapshot } from "./dashboard.repository";

/**
 * پیاده‌سازی API لایه‌ی داده‌ی داشبورد — **client-safe**.
 *
 * خواندن از Route Handler داخلی (`/api/dashboard/snapshot`) عبور می‌کند که
 * خودش با `authFetch` سرور-ساید به بک‌اند می‌زند؛ پس توکن/`API_URL` هرگز به
 * باندل مرورگر نمی‌رسد و درگیر CORS نمی‌شویم (همان الگوی `search/cabins`).
 *
 * نوشتن (check-in/out) از Server Actionها عبور می‌کند.
 */

const SNAPSHOT_ENDPOINT = "/api/dashboard/snapshot";

/** ساخت query string از فیلترها — نام پارامترها همان قرارداد بک‌اند است. */
function buildSnapshotQuery(filters: DashboardFilters): string {
  const params = new URLSearchParams();
  params.set("from", formatDateKey(filters.from));
  params.set("to", formatDateKey(filters.to));
  params.set("compare", filters.compare);

  if (filters.cities.length) params.set("cityIds", filters.cities.join(","));
  if (filters.cabinIds.length) params.set("cabinIds", filters.cabinIds.join(","));
  if (filters.statuses.length) params.set("statuses", filters.statuses.join(","));
  if (filters.paymentStatuses.length) {
    params.set("paymentStatuses", filters.paymentStatuses.join(","));
  }

  return params.toString();
}

/** اجرای یک گذار وضعیت و بازسازی خروجی؛ در صورت شکست، خطا پرتاب می‌شود. */
async function runStatusTransition(
  bookingId: number,
  action: (id: number) => Promise<DashboardBookingJson | null>,
): Promise<DashboardBooking> {
  const raw = await action(bookingId);
  if (!raw) {
    throw new Error("عملیات انجام نشد. دوباره تلاش کنید.");
  }
  return hydrateBooking(raw);
}

export class ApiDashboardRepository implements DashboardRepository {
  async getSnapshot(filters: DashboardFilters): Promise<DashboardSnapshot> {
    const res = await fetch(`${SNAPSHOT_ENDPOINT}?${buildSnapshotQuery(filters)}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`دریافت دادهٔ داشبورد ناموفق بود (HTTP ${res.status}).`);
    }

    const json = (await res.json()) as DashboardSnapshotJson;
    return hydrateSnapshot(json);
  }

  async checkIn(bookingId: number): Promise<DashboardBooking> {
    return runStatusTransition(bookingId, checkInBookingAction);
  }

  async checkOut(bookingId: number): Promise<DashboardBooking> {
    return runStatusTransition(bookingId, checkOutBookingAction);
  }
}
