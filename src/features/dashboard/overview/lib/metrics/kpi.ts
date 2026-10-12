/**
 * محاسبه‌ی شاخص‌های کلیدی (KPI) — **نقطه‌ی ورود عمومی** این ماژول.
 *
 * پیاده‌سازی به زیرماژول‌های تک‌مسئولیتی در `./kpis/` منتقل شده و این فایل
 * تنها یک barrel برای حفظ مسیر import مصرف‌کننده‌هاست:
 * - `kpis/shared`   → حلقه‌ی مشترک شب‌شماری + ابزارهای باکت‌بندی
 * - `kpis/revenue`  → درآمد اتاق و ADR
 * - `kpis/occupancy`→ شب‌های فروخته‌شده/قابل‌فروش، اشغال و سری‌ها
 * - `kpis/guest`    → نرخ لغو، میانگین اقامت، شمارش‌ها، Δ%
 * - `kpis/snapshot` → تجمیع کامل (`computeKpis`)
 *
 * همه‌ی توابع pure و TypeScript strict هستند. تعریف دقیق هر شاخص در
 * `docs/dashboard-metrics.md` (Data Dictionary) مستند شده است.
 */

export {
  soldNights,
  soldNightsByCabin,
  availableNights,
  occupancy,
  soldNightsSeries,
  occupancyAdrSeries,
  type OccupancyAdrPoint,
} from "./kpis/occupancy";

export { roomRevenue, adr, revenueSeries, type RevenuePoint } from "./kpis/revenue";

export {
  cancellationRate,
  averageStay,
  bookingCount,
  createdBookingCount,
  deltaPercent,
} from "./kpis/guest";

export { computeKpis, type KpiSnapshot } from "./kpis/snapshot";

export { pickGranularity, type TrendGranularity } from "./kpis/shared";
