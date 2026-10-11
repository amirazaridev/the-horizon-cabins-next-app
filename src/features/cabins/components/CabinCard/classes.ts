/** قاب پایه‌ی هر سه واریانت کارت. */
export const baseClasses =
  "group relative overflow-hidden rounded-3xl border border-foreground/5 bg-surface";

/** انیمیشن hover — `none` برای داخل کاروسل‌ها/داشبورد. */
export const animationClasses = {
  none: "transition-all duration-300",
  hover:
    "transition-all duration-500 hover:border-primary-400/30 hover:shadow-2xl hover:shadow-primary-400/10",
} as const;

/** `sizes` تصویر — به چیدمان و گرید هر واریانت بستگی دارد. */
export const CARD_IMAGE_SIZES = {
  landing: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  default:
    "(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  dashboard: "(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw",
} as const;

/**
 * ⚠️ کلاس بزرگ‌نمایی به‌صورت **کامل** نوشته می‌شود؛ Tailwind کلاسِ
 * ساخته‌شده با template-string را تولید نمی‌کند (قاعده‌ی پروژه).
 */
export const IMAGE_HOVER_SCALE = {
  sm: "group-hover:scale-105",
  lg: "group-hover:scale-110",
} as const;
