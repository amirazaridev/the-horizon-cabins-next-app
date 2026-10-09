/**
 * اهداف (Targets) شاخص‌ها — **تک‌منبع، بدون عدد جادویی در کامپوننت**.
 *
 * ⚠️ جدول `Setting` در Prisma وجود دارد ولی repository آن کامنت شده و
 * فیلدی برای اهداف ندارد. تا آن زمان، مقادیر اینجا ثابت‌اند.
 * // TODO(supabase): خواندن از جدول `settings` یا جدول جدید `dashboard_targets`
 */

/** هدف یک شاخص + جهت مطلوب آن. */
export interface KpiTarget {
  /** مقدار هدف — یا `null` اگر هدفی تعریف نشده */
  value: number | null;
  /**
   * جهت مطلوب شاخص:
   * - `up`   → بالاتر بهتر
   * - `down` → پایین‌تر بهتر
   */
  direction: "up" | "down";
  /** آیا این شاخص درصدی است؟ (برای قالب‌بندی) */
  isPercent: boolean;
}

/**
 * کلید شاخص‌ها — هم‌نام با `KpiSnapshot` تا نگاشت بدون خطا باشد.
 */
export type KpiKey =
  | "totalRevenue"
  | "bookingCount"
  | "occupancy"
  | "adr"
  | "cancellationRate"
  | "averageStay";

/**
 * اهداف پیش‌فرض داشبورد.
 *
 * مقادیر بر اساس تجربه‌ی عملیاتی اقامتگاه‌های شمال انتخاب شده‌اند و
 * **قابل تنظیم** هستند. هر تغییری اینجا بلافاصله در کارت‌های KPI
 * (نوار پیشرفت نسبت به هدف) و رنگ‌بندی اثر می‌گذارد.
 */
export const KPI_TARGETS: Record<KpiKey, KpiTarget> = {
  totalRevenue: {
    // هدف درآمدی — در عمل باید داینامیک بر اساس ماه/فصل باشد
    // TODO(supabase): هدف ماهانه از جدول تنظیمات
    value: null,
    direction: "up",
    isPercent: false,
  },
  bookingCount: {
    value: null,
    direction: "up",
    isPercent: false,
  },
  occupancy: {
    // هدف اشغال ۶۵٪ — آستانه‌ی رایج در صنعت اجاره‌ی کوتاه‌مدت
    value: 0.65,
    direction: "up",
    isPercent: true,
  },
  adr: {
    value: null,
    direction: "up",
    isPercent: false,
  },
  cancellationRate: {
    // هدف نرخ لغو زیر ۱۵٪
    value: 0.15,
    direction: "down",
    isPercent: true,
  },
  averageStay: {
    // هدف میانگین ۳ شب
    value: 3,
    direction: "up",
    isPercent: false,
  },
};

/**
 * آیا مقدار فعلی به هدف رسیده است؟
 *
 * - شاخص‌های `up`: `value >= target`
 * - شاخص‌های `down`: `value <= target`
 * - هدف `null` یا مقدار `null` → `null` (بدون ارزیابی)
 */
export function meetsTarget(
  key: KpiKey,
  value: number | null,
): boolean | null {
  const target = KPI_TARGETS[key];
  if (target.value === null || value === null) return null;
  return target.direction === "up"
    ? value >= target.value
    : value <= target.value;
}

/**
 * درصد پیشرفت نسبت به هدف — بین ۰ و ۱ (کلمپ‌شده).
 * برای شاخص `down` معکوس محاسبه می‌شود (هرچه کمتر، پیشرفت بیشتر).
 */
export function targetProgress(
  key: KpiKey,
  value: number | null,
): number | null {
  const target = KPI_TARGETS[key];
  if (target.value === null || target.value === 0 || value === null) return null;

  const ratio =
    target.direction === "up" ? value / target.value : target.value / value;

  return Math.max(0, Math.min(1, ratio));
}
