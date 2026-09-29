/**
 * بازه‌ی قیمت — ابزار مشترک و خالص.
 *
 * قرارداد رشته‌ای پروژه برای بازه‌ی قیمت `lo-hi` است (مثل `1000000-8000000`).
 * این ماژول تنها محل پارس/ساخت آن است تا منطق در سرچ و فیلترها تکرار نشود.
 */

export type PriceRangeTuple = [min: number, max: number];

/** پارس امن `lo-hi`؛ هر مقدار نامعتبر یا معکوس نادیده گرفته می‌شود */
export function parsePriceRange(
  raw: string | null | undefined,
): PriceRangeTuple | undefined {
  if (!raw) return undefined;

  const [lo, hi] = raw.split("-").map((part) => Number(part.trim()));

  if (
    !Number.isFinite(lo) ||
    !Number.isFinite(hi) ||
    lo < 0 ||
    hi <= 0 ||
    hi < lo
  ) {
    return undefined;
  }

  return [lo, hi];
}

/** ساخت رشته‌ی `lo-hi` */
export function formatPriceRange(min: number, max: number): string {
  return `${min}-${max}`;
}
