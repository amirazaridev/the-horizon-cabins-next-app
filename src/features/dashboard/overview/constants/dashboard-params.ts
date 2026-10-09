/**
 * کلیدهای پارامتر URL داشبورد + (سریال‌سازی) مقادیر فیلترها.
 *
 * ⭐ **تک‌منبع.** هم `FilterBar` و هم `useDashboardFilters` از همین ماژول
 * می‌خوانند تا کلیدها و قواعد سریال‌سازی هرگز از هم جدا نشوند.
 *
 * URL در داشبورد **منبع حقیقتِ** حالت فیلتر است؛ هر تغییری در فیلترها
 * باید با یک navigation به URL بنشیند تا لینک قابل اشتراک بماند.
 */

import {
  BOOKING_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  type BookingStatus,
  type CompareMode,
  type PaymentStatus,
} from "../types/dashboard.types";

/* ==========================================================================
   کلیدهای پارامتر
   ========================================================================== */

export const PARAM_FROM = "from";
export const PARAM_TO = "to";
/** حالت تاریخ — نام‌گذاری قدیمی: `range` (``custom`` یا نام preset) */
export const PARAM_RANGE = "range";
/** تب فعال در پنل تاریخ */
export const PARAM_DATE_TAB = "dateTab";

export const PARAM_CITY = "city";
export const PARAM_CABIN = "cabin";
export const PARAM_STATUS = "status";
export const PARAM_PAYMENT = "paymentStatus";
export const PARAM_COMPARE = "compare";

/** مرتبه‌ی فیلترها در نوار فیلتر (کنترل‌شده و قابل پیش‌بینی) */
export const DASHBOARD_PARAM_KEYS = [
  PARAM_FROM,
  PARAM_TO,
  PARAM_RANGE,
  PARAM_DATE_TAB,
  PARAM_CITY,
  PARAM_CABIN,
  PARAM_STATUS,
  PARAM_PAYMENT,
  PARAM_COMPARE,
] as const;

/* ==========================================================================
   سریال‌سازی چندمقداری
   ========================================================================== */

/**
 * تبدیل مقدار خام پارامتر URL به آرایه.
 * - خالی یا `all` ⇒ آرایه‌ی خالی (یعنی «بدون فیلتر»)
 * - مقادیر با کاما جدا می‌شوند و فاصله‌های اضافی حذف می‌شوند.
 */
export function parseMultiParam(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/** آرایه ⇄ مقدار پارامتر. آرایه‌ی خالی ⇒ `null` (پارامتر از URL حذف شود). */
export function serializeMultiParam(values: readonly string[]): string | null {
  if (values.length === 0) return null;
  return values.join(",");
}

/* ==========================================================================
   عددی (مثل شناسه‌ی اقامتگاه)
   ========================================================================== */

/** آرایه‌ی عددی از پارامتر URL — مقادیر نامعتبر حذف می‌شوند. */
export function parseNumberListParam(
  raw: string | null | undefined,
): number[] {
  return parseMultiParam(raw)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0);
}

export function serializeNumberListParam(
  values: readonly number[],
): string | null {
  return serializeMultiParam(values.map(String));
}

/* ==========================================================================
   اعتبارسنجی enumها — URL می‌تواند دستی تغییر کند
   ========================================================================== */

const STATUS_VALUES = Object.keys(BOOKING_STATUS_LABELS) as BookingStatus[];
const PAYMENT_VALUES = Object.keys(PAYMENT_STATUS_LABELS) as PaymentStatus[];

export function isBookingStatus(value: string): value is BookingStatus {
  return (STATUS_VALUES as string[]).includes(value);
}

export function isPaymentStatus(value: string): value is PaymentStatus {
  return (PAYMENT_VALUES as string[]).includes(value);
}

export function isCompareMode(value: string): value is CompareMode {
  return value === "prev-period" || value === "prev-year" || value === "none";
}

/** فیلتر enumهای چندمقداری بر اساس مجموعه‌ی مقادیر مجاز. */
export function parseEnumListParam<T extends string>(
  raw: string | null | undefined,
  isValid: (value: string) => value is T,
): T[] {
  return parseMultiParam(raw).filter(isValid);
}

/* ==========================================================================
   Compare mode — تک‌مقداری با پیش‌فرض
   ========================================================================== */

/** مقدار پیش‌فرض مقایسه — دوره‌ی قبل. */
export const DEFAULT_COMPARE: CompareMode = "prev-period";

/**
 * خواندن حالت مقایسه از URL.
 * مقدار نامعتبر ⇒ پیش‌فرض (`prev-period`)، پس URL دستیِ خراب، UI را نمی‌شکند.
 */
export function parseCompareParam(
  raw: string | null | undefined,
): CompareMode {
  return raw && isCompareMode(raw) ? raw : DEFAULT_COMPARE;
}
