/**
 * توابع محاسبه‌ی شاخص‌های کلیدی (KPI) — همه pure و TypeScript strict.
 *
 * هر تابع فقط داده می‌گیرد و عدد/آبجکت برمی‌گرداند. **هیچ‌جا به mock،
 * fetch یا state دست نمی‌زند.** تعریف دقیق هر شاخص در
 * `docs/dashboard-metrics.md` (Data Dictionary) مستند شده است.
 *
 * ### قراردادهای مشترک
 * - درآمد **شب‌به‌شب (prorated)** توزیع می‌شود: هر شب = `totalPrice / numNights`.
 * - «رزروهای فروخته‌شده» = وضعیت‌های `SOLD_STATUSES` (شامل checkedOut).
 * - «رزروهای فعال» = `ACTIVE_BOOKING_STATUSES` (بدون checkedOut).
 * - `cancelled` هرگز در درآمد/اشغال نمی‌آید.
 * - تقسیم بر صفر → `null`، نه `Infinity`.
 */

import type { DashboardBooking } from "../../types/dashboard.types";
import { SOLD_STATUSES, CANCELLED_STATUSES } from "../../types/dashboard.types";
import {
  type DateRange,
  createdAtInRange,
  eachDayInRange,
  inclusiveDayCount,
  nightsInRange,
  toEpochDay,
} from "./range";
import { perNightAmountExact, safeRatio } from "./money";

/* ==========================================================================
   فیلتر پایه
   ========================================================================== */

/** فقط شب‌های فروخته‌شده (شامل checkedOut) که داخل بازه می‌افتند. */
function soldBookings(bookings: readonly DashboardBooking[]): DashboardBooking[] {
  const sold = new Set<string>(SOLD_STATUSES);
  return bookings.filter((b) => sold.has(b.status));
}

/* ==========================================================================
   ۱) شب‌های فروخته‌شده — SoldNights
   ========================================================================== */

/**
 * مجموع شب‌های فروخته‌شده داخل بازه.
 *
 * رزرو عبوری از مرز **فقط به‌اندازه‌ی تداخل** شمرده می‌شود (نه کل شب‌ها).
 */
export function soldNights(
  bookings: readonly DashboardBooking[],
  range: DateRange,
): number {
  return soldBookings(bookings).reduce(
    (total, booking) =>
      total + nightsInRange(booking.startDate, booking.endDate, range.from, range.to),
    0,
  );
}

/**
 * مجموع شب‌های فروخته‌شده برای یک اقامتگاه خاص.
 * برای جدول عملکرد اقامتگاه‌ها.
 */
export function soldNightsByCabin(
  bookings: readonly DashboardBooking[],
  cabinId: number,
  range: DateRange,
): number {
  return soldBookings(bookings)
    .filter((b) => b.cabinId === cabinId)
    .reduce(
      (total, booking) =>
        total + nightsInRange(booking.startDate, booking.endDate, range.from, range.to),
      0,
    );
}

/* ==========================================================================
   ۲) شب‌های قابل‌فروش — AvailableNights
   ========================================================================== */

/**
 * تعداد شب‌های قابل‌فروش = (تعداد اقامتگاه‌های فعال بعد از فیلتر) × (روزهای بازه)
 *
 * ⚠️ فرض صریح: هر اقامتگاه **هر شب** قابل‌فروش است. تعطیلی/بلوک دستی در
 * اسکیمای فعلی وجود ندارد (جدول `cabin_blocks` نیست). اگر اضافه شد، این
 * تابع باید شب‌های بلوک‌شده را کم کند.
 * // TODO(supabase): کسر شب‌های بلوک‌شده از جدول cabin_availability
 */
export function availableNights(
  cabinCount: number,
  range: DateRange,
): number {
  if (cabinCount <= 0) return 0;
  return cabinCount * inclusiveDayCount(range.from, range.to);
}

/* ==========================================================================
   ۳) نرخ اشغال — Occupancy
   ========================================================================== */

/** `Occupancy = SoldNights / AvailableNights` — نسبت بین ۰ و ۱، یا null. */
export function occupancy(
  bookings: readonly DashboardBooking[],
  cabinCount: number,
  range: DateRange,
): number | null {
  const sold = soldNights(bookings, range);
  const available = availableNights(cabinCount, range);
  return safeRatio(sold, available);
}

/* ==========================================================================
   ۴) درآمد اتاق — RoomRevenue (prorated)
   ========================================================================== */

/**
 * درآمد اتاق در بازه — توزیع **شب‌به‌شب**.
 *
 * برای هر رزرو، سهم هر شب داخل بازه با `perNightAmountExact` حساب می‌شود
 * تا جمع کل دقیقاً برابر مبلغ شب‌های داخل بازه باشد (بدون خطای گردکردن).
 */
export function roomRevenue(
  bookings: readonly DashboardBooking[],
  range: DateRange,
): number {
  const rangeStart = toEpochDay(range.from);
  const rangeEnd = toEpochDay(range.to);

  let total = 0;

  for (const booking of soldBookings(bookings)) {
    const bookingStart = toEpochDay(booking.startDate);
    const bookingEnd = toEpochDay(booking.endDate);
    if (bookingEnd <= bookingStart) continue;

    const lo = Math.max(bookingStart, rangeStart);
    const hi = Math.min(bookingEnd, rangeEnd + 1);
    if (hi <= lo) continue;

    const nights = booking.numNights > 0 ? booking.numNights : bookingEnd - bookingStart;

    // ایندکس شبِ مطلق داخل رزرو برای محاسبه‌ی باقی‌مانده‌ی دقیق
    for (let night = lo; night < hi; night++) {
      const nightIndexInBooking = night - bookingStart;
      total += perNightAmountExact(booking.totalPrice, nights, nightIndexInBooking);
    }
  }

  return total;
}

/* ==========================================================================
   ۵) ADR — میانگین نرخ هر شب
   ========================================================================== */

/** `ADR = RoomRevenue / SoldNights` — خروجی به تومان (number)، یا null. */
export function adr(
  bookings: readonly DashboardBooking[],
  range: DateRange,
): number | null {
  const revenue = roomRevenue(bookings, range);
  const nights = soldNights(bookings, range);
  return safeRatio(revenue, nights);
}

/* ==========================================================================
   ۷) نرخ لغو — CancellationRate
   ========================================================================== */

/**
 * `CancellationRate = رزروهای لغوشده / کل رزروهای ثبت‌شده در بازه`
 *
 * ⚠️ مخرج **ثبت‌شده در بازه** است، نه شروع‌شده در بازه. یعنی معیار
 * `createdAt` داخل بازه است (تصمیم کاربر). لغو هرگز مخرج را عوض نمی‌کند.
 */
export function cancellationRate(
  bookings: readonly DashboardBooking[],
  range: DateRange,
): number | null {
  const created = bookings.filter((b) => createdAtInRange(b.createdAt, range.from, range.to));
  if (created.length === 0) return null;

  const cancelled = created.filter((b) =>
    (CANCELLED_STATUSES as readonly string[]).includes(b.status),
  ).length;

  return cancelled / created.length;
}

/* ==========================================================================
   ۸) میانگین اقامت — AverageStay
   ========================================================================== */

/**
 * میانگین شب‌های رزروهای فروخته‌شده در بازه.
 * ⚠️ `null` وقتی هیچ رزرو فروخته‌شده‌ای نیست (نه صفر).
 */
export function averageStay(
  bookings: readonly DashboardBooking[],
  range: DateRange,
): number | null {
  const sold = soldBookings(bookings).filter((b) =>
    nightsInRange(b.startDate, b.endDate, range.from, range.to) > 0,
  );
  if (sold.length === 0) return null;

  const totalNights = sold.reduce(
    (sum, b) => sum + nightsInRange(b.startDate, b.endDate, range.from, range.to),
    0,
  );
  return totalNights / sold.length;
}

/* ==========================================================================
   ۹) شمارش رزرو
   ========================================================================== */

/** تعداد رزروهایی که شب‌شان داخل بازه می‌افتد (فقط فروخته‌شده). */
export function bookingCount(
  bookings: readonly DashboardBooking[],
  range: DateRange,
): number {
  return soldBookings(bookings).filter(
    (b) => nightsInRange(b.startDate, b.endDate, range.from, range.to) > 0,
  ).length;
}

/** تعداد رزروهای ثبت‌شده در بازه (هر وضعیتی) — مبنای نرخ لغو. */
export function createdBookingCount(
  bookings: readonly DashboardBooking[],
  range: DateRange,
): number {
  return bookings.filter((b) => createdAtInRange(b.createdAt, range.from, range.to)).length;
}

/* ==========================================================================
   ۱۲) Δ% — رشد نسبت به دوره مقایسه
   ========================================================================== */

/**
 * `Δ% = (current - previous) / previous`
 *
 * ⚠️ اگر مقدار مبنا `0` یا `null` باشد، `null` برمی‌گردد (نه 0 و نه
 * Infinity). این تصمیم عمدی است: «رشد نسبت به صفر» بی‌معناست و UI باید
 * به‌جای `+∞٪` متن «بدون مقایسه» نشان دهد.
 */
export function deltaPercent(
  current: number | null,
  previous: number | null,
): number | null {
  if (current === null || previous === null) return null;
  if (previous === 0) return null;
  return (current - previous) / previous;
}

/** همان `deltaPercent` ولی برای مبالغ bigint. */

/* ==========================================================================
   AGGREGATE — مجموعه‌ی کامل KPI در یک فراخوانی
   ========================================================================== */

/** مجموعه‌ی کامل KPIهای ردیف کارت‌ها. */
export interface KpiSnapshot {
  totalRevenue: number;
  bookingCount: number;
  occupancy: number | null;
  adr: number | null;
  cancellationRate: number | null;
  averageStay: number | null;
  soldNights: number;
  availableNights: number;
  createdCount: number;
}

/**
 * همه‌ی KPIها را یک‌جا حساب می‌کند.
 *
 * ⚠️ در کامپوننت‌ها هرگز مستقیم صدا زده نشود؛ فقط از داخل repository یا
 * hook. هدف: یک نقطه‌ی واحد برای memoization و تست.
 */
export function computeKpis(
  bookings: readonly DashboardBooking[],
  cabinCount: number,
  range: DateRange,
): KpiSnapshot {
  return {
    totalRevenue: roomRevenue(bookings, range),
    bookingCount: bookingCount(bookings, range),
    occupancy: occupancy(bookings, cabinCount, range),
    adr: adr(bookings, range),
    cancellationRate: cancellationRate(bookings, range),
    averageStay: averageStay(bookings, range),
    soldNights: soldNights(bookings, range),
    availableNights: availableNights(cabinCount, range),
    createdCount: createdBookingCount(bookings, range),
  };
}

/* ==========================================================================
   ۱۳) سری‌های زمانی — برای sparkline و نمودار روند
   ========================================================================== */

/** سطح تجمیع سری زمانی. */
export type TrendGranularity = "daily" | "weekly" | "monthly";

/**
 * انتخاب خودکار سطح تجمیع بر اساس طول بازه.
 * - ≤ ۳۱ روز → روزانه
 * - ≤ ۱۲۰ روز → هفتگی
 * - بیشتر → ماهانه
 */
export function pickGranularity(range: DateRange): TrendGranularity {
  const days = inclusiveDayCount(range.from, range.to);
  if (days <= 31) return "daily";
  if (days <= 120) return "weekly";
  return "monthly";
}

/** یک نقطه‌ی سری زمانی درآمد. */
export interface RevenuePoint {
  key: string;
  date: Date;
  revenue: number;
}

/**
 * سری زمانی درآمد با تجمیع خودکار.
 *
 * مبنای گروه‌بندی: **شبی که درآمد به آن نسبت داده می‌شود** (شب‌به‌شب).
 * پس رزرو عبوری از مرز بین دو باکت تقسیم می‌شود — دقیقاً مثل `roomRevenue`.
 */
export function revenueSeries(
  bookings: readonly DashboardBooking[],
  range: DateRange,
  granularity: TrendGranularity = pickGranularity(range),
): RevenuePoint[] {
  const buckets = new Map<string, { date: Date; revenue: number }>();

  // ساخت باکت‌های خالی تا نقاط صفر هم در نمودار باشند
  for (const day of eachDayInRange(range.from, range.to)) {
    const bucketDate = bucketStart(day, granularity);
    const key = bucketKey(bucketDate, granularity);
    if (!buckets.has(key)) buckets.set(key, { date: bucketDate, revenue: 0 });
  }

  const rangeStart = toEpochDay(range.from);
  const rangeEnd = toEpochDay(range.to);

  for (const booking of soldBookings(bookings)) {
    const bookingStart = toEpochDay(booking.startDate);
    const bookingEnd = toEpochDay(booking.endDate);
    if (bookingEnd <= bookingStart) continue;

    const lo = Math.max(bookingStart, rangeStart);
    const hi = Math.min(bookingEnd, rangeEnd + 1);
    if (hi <= lo) continue;

    const nights = booking.numNights > 0 ? booking.numNights : bookingEnd - bookingStart;

    for (let night = lo; night < hi; night++) {
      const nightDate = new Date(night * 86_400_000);
      const bucketDate = bucketStart(nightDate, granularity);
      const key = bucketKey(bucketDate, granularity);
      const bucket = buckets.get(key);
      if (!bucket) continue;

      const amount = perNightAmountExact(
        booking.totalPrice,
        nights,
        night - bookingStart,
      );
      bucket.revenue += amount;
    }
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, value]) => ({ key, date: value.date, revenue: value.revenue }));
}

/**
 * سری زمانی شب‌های فروخته‌شده — برای sparkline.
 * همان منطق `revenueSeries` ولی روی تعداد شب به‌جای مبلغ.
 */
export function soldNightsSeries(
  bookings: readonly DashboardBooking[],
  range: DateRange,
  granularity: TrendGranularity = pickGranularity(range),
): number[] {
  const buckets = new Map<string, number>();

  for (const day of eachDayInRange(range.from, range.to)) {
    const key = bucketKey(bucketStart(day, granularity), granularity);
    if (!buckets.has(key)) buckets.set(key, 0);
  }

  const rangeStart = toEpochDay(range.from);
  const rangeEnd = toEpochDay(range.to);

  for (const booking of soldBookings(bookings)) {
    const bookingStart = toEpochDay(booking.startDate);
    const bookingEnd = toEpochDay(booking.endDate);
    const lo = Math.max(bookingStart, rangeStart);
    const hi = Math.min(bookingEnd, rangeEnd + 1);

    for (let night = lo; night < hi; night++) {
      const key = bucketKey(bucketStart(new Date(night * 86_400_000), granularity), granularity);
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([, value]) => value);
}

/**
 * سری شاخص‌های ترکیبی (اشغال + ADR) در بازه — برای نمودار ترکیبی فاز ۴.
 *
 * ⚠️ اینجا ADR **به‌ازای هر باکت** حساب می‌شود (نه کل بازه): درآمد آن
 * باکت ÷ شب‌های آن باکت. اگر باکتی شب فروخته‌شده نداشته باشد، `adr`
 * آن `null` می‌شود (نه صفر) تا خط ADR شکسته شود، نه اینکه به کف بچسبد.
 */
export interface OccupancyAdrPoint {
  key: string;
  date: Date;
  /** نسبت ۰..۱ */
  occupancy: number | null;
  /** تومان */
  adr: number | null;
}

export function occupancyAdrSeries(
  bookings: readonly DashboardBooking[],
  cabinCount: number,
  range: DateRange,
  granularity: TrendGranularity = pickGranularity(range),
): OccupancyAdrPoint[] {
  const buckets = new Map<
    string,
    { date: Date; nights: number; revenue: number; days: number }
  >();

  for (const day of eachDayInRange(range.from, range.to)) {
    const bucketDate = bucketStart(day, granularity);
    const key = bucketKey(bucketDate, granularity);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.days += 1;
    } else {
      buckets.set(key, { date: bucketDate, nights: 0, revenue: 0, days: 1 });
    }
  }

  const rangeStart = toEpochDay(range.from);
  const rangeEnd = toEpochDay(range.to);

  for (const booking of soldBookings(bookings)) {
    const bookingStart = toEpochDay(booking.startDate);
    const bookingEnd = toEpochDay(booking.endDate);
    if (bookingEnd <= bookingStart) continue;

    const lo = Math.max(bookingStart, rangeStart);
    const hi = Math.min(bookingEnd, rangeEnd + 1);
    if (hi <= lo) continue;

    const nights = booking.numNights > 0 ? booking.numNights : bookingEnd - bookingStart;

    for (let night = lo; night < hi; night++) {
      const bucketDate = bucketStart(new Date(night * 86_400_000), granularity);
      const key = bucketKey(bucketDate, granularity);
      const bucket = buckets.get(key);
      if (!bucket) continue;

      bucket.nights += 1;
      bucket.revenue += perNightAmountExact(
        booking.totalPrice,
        nights,
        night - bookingStart,
      );
    }
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, value]) => {
      const available = cabinCount * value.days;
      return {
        key,
        date: value.date,
        occupancy: safeRatio(value.nights, available),
        adr: safeRatio(value.revenue, value.nights),
      };
    });
}

/* ==========================================================================
   HELPERهای داخلی باکت‌بندی
   ========================================================================== */

function bucketStart(date: Date, granularity: TrendGranularity): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (granularity === "daily") return d;

  if (granularity === "weekly") {
    // شنبه ابتدای هفته ایرانی — getDay(): 0=شنبه? نه، 6=شنبه در JS
    // JS: 0=Sunday … 6=Saturday. شنبه = 6 ⇒ آفست تا شنبه
    const dayOfWeek = d.getDay(); // 6 = Saturday
    const offsetToSaturday = dayOfWeek === 6 ? 0 : dayOfWeek + 1;
    d.setDate(d.getDate() - offsetToSaturday);
    return d;
  }

  // monthly
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function bucketKey(date: Date, granularity: TrendGranularity): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  if (granularity === "monthly") return `${y}-${m}`;
  return `${y}-${m}-${d}`;
}
