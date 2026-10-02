/**
 * نرمال‌سازی ورودی کاربر.
 *
 * کاربر ایرانی ممکن است با کیبورد فارسی عدد بزند یا حرف‌های عربی «ي/ك»
 * تایپ کند. اگر این‌ها نرمال نشوند، regexهای اعتبارسنجی بی‌دلیل رد
 * می‌کنند و کاربر پیام خطای نادرست می‌بیند.
 */

/**
 * تبدیل ارقام فارسی/عربی به لاتین.
 *
 * `\d` در regex این ارقام را نمی‌گیرد؛ پس برای «کد تایید» و هر جای دیگری
 * که عدد لازم است، اول باید از این تابع بگذرد.
 */
export function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

/**
 * حذف فاصله‌های ابتدا/انتها + تبدیل ارقام + یکسان‌سازی «ی/ك» عربی.
 *
 * الگوی استاندارد پروژه برای هر ورودی متنی قبل از مقایسه یا ارسال.
 */
export function normalizeText(value: string): string {
  return normalizeDigits(value)
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .trim();
}

/** حذف همه‌ی کاراکترهای غیررقمی — برای ورودی‌های عددی سخت‌گیرانه. */
export function digitsOnly(value: string): string {
  return normalizeDigits(value).replace(/\D/g, "");
}
