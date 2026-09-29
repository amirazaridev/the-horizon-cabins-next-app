export function formatCurrency(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

/**
 * قالب فشرده‌ی عدد پولی برای برچسب‌ها و اسلایدرها.
 * مثال: ۸٫۵ میلیون · ۲۵۰ هزار · ۹۰۰
 */
export function formatPriceShort(value: number): string {
  if (value >= 1_000_000) {
    const millions = Math.round((value / 1_000_000) * 10) / 10;
    return `${millions.toLocaleString("fa-IR")} میلیون`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000).toLocaleString("fa-IR")} هزار`;
  }
  return value.toLocaleString("fa-IR");
}
