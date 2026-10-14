/** هدف یک شاخص + جهت مطلوب آن. */
export interface KpiTarget {
  /** مقدار هدف — یا `null` اگر هدفی تعریف نشده */
  value: number | null;
  direction: "up" | "down";
  /** آیا این شاخص درصدی است؟ (برای قالب‌بندی) */
  isPercent: boolean;
}

export type KpiKey =
  | "totalRevenue"
  | "bookingCount"
  | "occupancy"
  | "adr"
  | "cancellationRate"
  | "averageStay";

export const KPI_TARGETS: Record<KpiKey, KpiTarget> = {
  totalRevenue: {
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
