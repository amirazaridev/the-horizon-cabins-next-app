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

export const COUNT_UNITS = {
  night: "شب",
  guest: "مهمان",
  booking: "رزرو",
  cabin: "اقامتگاه",
  day: "روز",
  item: "",
} as const;

export type CountUnit = keyof typeof COUNT_UNITS;

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
