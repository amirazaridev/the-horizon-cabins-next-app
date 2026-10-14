export function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

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
