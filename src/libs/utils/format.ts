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

/**
 * قالب **خیلی فشرده**‌ی قیمت — مخصوص داخل سلول تقویم.
 *
 * ⚠️ سلول روز عرض محدودی دارد (~۵۰px) و «۲٬۵۰۰٬۰۰۰» هرگز جا نمی‌شود؛ پس
 * میلیون/هزار با یک حرف خلاصه می‌شود («۲٫۵م»، «۲۵۰ه»). قیمت کامل هم به‌عنوان
 * `title` (راهنمای hover) روی همان سلول می‌نشیند تا ابهامی نماند.
 */
export function formatCompactPrice(value: number): string {
  if (value >= 1_000_000) {
    const millions = Math.round((value / 1_000_000) * 10) / 10;
    return `${millions.toLocaleString("fa-IR")}م`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000).toLocaleString("fa-IR")}ه`;
  }
  return value.toLocaleString("fa-IR");
}

