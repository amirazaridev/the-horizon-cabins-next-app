/** عدد کامل با جداکننده‌ی هزارگان فارسی — «۲٬۵۰۰٬۰۰۰». */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}

type PriceSuffixes = {
  /** پسوند میلیون — فاصله‌ی ابتدایی هم بخشی از خودِ پسوند است. */
  million: string;
  thousand: string;
};

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

export function formatCompactPrice(value: number): string {
  return formatPrice(value, "compact");
}
