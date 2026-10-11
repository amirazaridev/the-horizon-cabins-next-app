/**
 * قالب‌بندی عدد و قیمت — همه با لوکیل فارسی (`fa-IR`).
 *
 * ⚠️ نام `formatCurrency` عمداً حفظ شد (۴۸ نقطه‌ی مصرف در پروژه). توجه کنید
 * این تابع **واحد پول اضافه نمی‌کند** و فقط عدد را با جداکننده‌ی فارسی
 * می‌سازد؛ واحد («تومان») را مصرف‌کننده اضافه می‌کند.
 */

/** عدد کامل با جداکننده‌ی هزارگان فارسی — «۲٬۵۰۰٬۰۰۰». */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}

type PriceSuffixes = {
  /** پسوند میلیون — فاصله‌ی ابتدایی هم بخشی از خودِ پسوند است. */
  million: string;
  thousand: string;
};

/**
 * هسته‌ی مشترک قالب‌بندی فشرده‌ی قیمت.
 *
 * ⚠️ پیش از این `formatPriceShort` و `formatCompactPrice` دو بدنه‌ی
 * تقریباً یکسان داشتند و تنها تفاوتشان پسوند («میلیون»/«هزار» در برابر
 * «م»/«ه») بود — یعنی یک منطق در دو جا کپی شده بود. حالا هر دو به این
 * هسته تکیه می‌کنند.
 */
function formatScaledPrice(value: number, suffixes: PriceSuffixes): string {
  if (value >= 1_000_000) {
    const millions = Math.round((value / 1_000_000) * 10) / 10;
    return `${millions.toLocaleString("fa-IR")}${suffixes.million}`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000).toLocaleString("fa-IR")}${suffixes.thousand}`;
  }
  return value.toLocaleString("fa-IR");
}

const PRICE_SUFFIXES = {
  /** خوانا — «۸٫۵ میلیون · ۲۵۰ هزار · ۹۰۰». */
  long: { million: " میلیون", thousand: " هزار" },
  /** خیلی فشرده — «۲٫۵م · ۲۵۰ه» (برای سلول‌های باریک تقویم). */
  compact: { million: "م", thousand: "ه" },
} as const;

export type PriceFormatStyle = keyof typeof PRICE_SUFFIXES;

/** قالب‌بندی فشرده‌ی قیمت با سبک انتخابی. */
export function formatPrice(
  value: number,
  style: PriceFormatStyle = "long",
): string {
  return formatScaledPrice(value, PRICE_SUFFIXES[style]);
}

/** سبک خوانا — برای برچسب‌ها و اسلایدرها. */
export function formatPriceShort(value: number): string {
  return formatPrice(value, "long");
}

/**
 * سبک خیلی فشرده — مخصوص داخل سلول تقویم.
 *
 * ⚠️ سلول روز عرض محدودی دارد (~۵۰px) و «۲٬۵۰۰٬۰۰۰» هرگز جا نمی‌شود؛ پس
 * میلیون/هزار با یک حرف خلاصه می‌شود. قیمت کامل هم به‌عنوان `title`
 * (راهنمای hover) روی همان سلول می‌نشیند تا ابهامی نماند.
 */
export function formatCompactPrice(value: number): string {
  return formatPrice(value, "compact");
}
