/**
 * پیکربندی مشترک نمودارها — **تک‌منبع رنگ و استایل tooltip**.
 *
 * ⭐ هیچ کامپوننت نموداری رنگ هاردکد نمی‌کند؛ همه از اینجا می‌خوانند.
 * رنگ‌ها به‌صورت `var(--…)` هستند تا در تم روشن/تیره خودکار عوض شوند
 * (متغیرها در `src/styles/globals.css` تعریف شده‌اند).
 */

/** رنگ‌های پایه‌ی نمودار — همه CSS variable برای سازگاری با تم. */
export const CHART_COLORS = {
  /** کهربایی برند — سری اصلی درآمد */
  primary: "var(--color-primary-400)",
  /** کهربایی تیره — برای gradient */
  primaryDark: "var(--color-primary-600)",
  /** سبز — سری مثبت / مقایسه */
  emerald: "var(--color-emerald-500)",
  /** نیلی — سری ثانویه (اشغال) */
  indigo: "var(--color-indigo-400)",
  /** آبی آسمانی */
  sky: "var(--color-sky-500)",
  /** بنفش */
  violet: "var(--color-violet-500)",
  /** رز / خطر */
  rose: "var(--color-rose-500)",
  /** نارنجی هشدار */
  amber: "var(--color-amber-500)",
  /** خطوط شبکه */
  grid: "var(--color-border)",
  /** رنگ محور/متن */
  axis: "var(--color-text-gray)",
} as const;

/** رنگ‌های ثابت توزیع مدت اقامت (روشن/تیره). */
export const DURATION_COLORS_LIGHT: readonly string[] = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#a855f7",
];

export const DURATION_COLORS_DARK: readonly string[] = [
  "#b91c1c",
  "#c2410c",
  "#a16207",
  "#4d7c0f",
  "#15803d",
  "#0f766e",
  "#1d4ed8",
  "#7e22ce",
];

/** رنگ توزیع وضعیت رزرو — بر اساس معنی هر وضعیت (نه ترتیب). */
export const STATUS_COLORS: Record<string, string> = {
  confirmed: "var(--color-emerald-500)",
  checkedIn: "var(--color-sky-500)",
  checkedOut: "var(--color-indigo-400)",
  pending: "var(--color-amber-500)",
  cancelled: "var(--color-rose-500)",
};

/**
 * استایل مشترک tooltip ری‌چارتس.
 * جهت RTL و رنگ‌ها از تم خوانده می‌شوند.
 */
export const CHART_TOOLTIP_STYLE = {
  borderRadius: 10,
  border: "1px solid var(--color-border)",
  background: "var(--color-surface)",
  direction: "rtl" as const,
  fontSize: 12,
};

/** استایل مشترک محورها. */
export const CHART_AXIS_TICK = {
  fill: "var(--color-text-gray)",
  fontSize: 11,
} as const;
