/**
 * قالب‌بندی اعداد و مبالغ برای کارت‌های KPI.
 *
 * ⭐ **تک‌منبع** — هیچ کامپوننتی خودش `toLocaleString` یا `٪` دستی نمی‌زند.
 * همه‌ی خروجی‌ها با اعداد فارسی و واحد تومان تولید می‌شوند.
 *
 * ⚠️ `formatCurrency` مشترک در `libs/utils/format.ts` برای جدول‌ها/فرم‌ها
 * استفاده می‌شود؛ این ماژول نسخه‌ی فشرده‌ی مخصوص KPI است (مثلاً
 * «۱٫۲ میلیارد» برای کارت درآمد).
 */

const FA = "fa-IR";

/** عدد صحیح/اعشاری با اعداد فارسی. */
export function formatNumber(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat(FA, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** نسبت (۰..۱) به درصد فارسی با علامت ٪. مثال: ۰٫۲۷ → «۲۷٪». */
export function formatPercent(ratio: number | null, fractionDigits = 0): string {
  if (ratio === null || !Number.isFinite(ratio)) return "—";
  return `${formatNumber(ratio * 100, fractionDigits)}٪`;
}

/**
 * مقدار **درصدی آماده** (مثل ۲۷ به‌معنی ۲۷٪) با علامت ٪.
 * ⚠️ با `formatPercent` اشتباه نشود: آن یکی نسبت ۰..۱ می‌گیرد.
 */
export function formatPercentValue(value: number | null, fractionDigits = 0): string {
  if (value === null || !Number.isFinite(value)) return "—";
  return `${formatNumber(value, fractionDigits)}٪`;
}

/** Δ نسبت (۰..۱) با علامت + / −. مثال: ۰٫۱۲ → «+۱۲٪»، −۰٫۰۵ → «−۵٪». */
export function formatDelta(ratio: number | null, fractionDigits = 0): string {
  if (ratio === null || !Number.isFinite(ratio)) return "—";
  const sign = ratio > 0 ? "+" : ratio < 0 ? "−" : "";
  return `${sign}${formatNumber(Math.abs(ratio) * 100, fractionDigits)}٪`;
}

/**
 * مبلغ تومان فشرده — برای کارت‌های KPI.
 * مثال: ۱٫۲ میلیارد · ۸۵۰ میلیون · ۴۵ هزار.
 */
export function formatTomanShort(value: number): string {
  const n = value;
  if (!Number.isFinite(n)) return "—";

  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : "";

  if (abs >= 1_000_000_000) {
    return `${sign}${trimDecimal(abs / 1_000_000_000)} میلیارد`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${trimDecimal(abs / 1_000_000)} میلیون`;
  }
  if (abs >= 1_000) {
    return `${sign}${trimDecimal(abs / 1_000)} هزار`;
  }
  return `${sign}${formatNumber(abs)}`;
}

/** مبلغ کامل تومان با اعداد فارسی (برای tooltip). */
export function formatToman(value: number): string {
  const n = value;
  if (!Number.isFinite(n)) return "—";
  return formatNumber(n);
}

/** شب با اعداد فارسی. مثال: ۳٫۵ → «۳٫۵ شب». */
export function formatNights(value: number | null, fractionDigits = 1): string {
  if (value === null || !Number.isFinite(value)) return "—";
  // اگر عدد صحیح است، اعشار نگذار
  const digits = Number.isInteger(value) ? 0 : fractionDigits;
  return `${formatNumber(value, digits)} شب`;
}

/** یک عدد ساده (مثل تعداد رزرو) با اعداد فارسی. */
export function formatCount(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";
  return formatNumber(value);
}

/* ==========================================================================
   شمارنده‌ی واحددار — «۳ شب»، «۵ رزرو»، «۲ اقامتگاه»
   ⚠️ تک‌منبع برای الگوی «عدد + واحد» در همه‌ی ویجت‌ها؛ هیچ‌جای UI
   `toLocaleString` خام نزنید.
   ========================================================================== */

export const COUNT_UNITS = {
  night: "شب",
  guest: "مهمان",
  booking: "رزرو",
  cabin: "اقامتگاه",
  day: "روز",
  item: "",
} as const;

export type CountUnit = keyof typeof COUNT_UNITS;

/**
 * «عدد + واحد». برای واحد `item` فقط خود عدد برمی‌گردد.
 * مثال: `formatCountWithUnit(3, "night")` → «۳ شب».
 */
export function formatCountWithUnit(
  value: number | null,
  unit: CountUnit,
  options?: { shortUnit?: string },
): string {
  const n = formatCount(value);
  const label = options?.shortUnit ?? COUNT_UNITS[unit];
  return label ? `${n} ${label}` : n;
}

/** یک رقم اعشار بدون صفر اضافه. مثال: 1.20 → ۱٫۲ · 1.0 → ۱. */
function trimDecimal(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return formatNumber(rounded, Number.isInteger(rounded) ? 0 : 1);
}
