/**
 * پیکربندی کارت‌های KPI — **تک‌منبع** برای ردیف ۶ کارتی.
 *
 * ⭐ هیچ عدد/رنگ/برچسبی داخل کامپوننت نیست. هر کارت از این پیکربندی
 * ساخته می‌شود و مقدارش از `KpiSnapshot` خوانده می‌شود.
 *
 * شش شاخص (طبق spec فاز ۳):
 *   ۱. درآمد کل        ۴. ADR
 *   ۲. تعداد رزرو       ۵. نرخ لغو
 *   ۳. نرخ اشغال        ۶. میانگین اقامت
 */

import type { ReactNode } from "react";
import {
  BedDouble,
  CalendarCheck2,
  CircleDollarSign,
  Gauge,
  Percent,
  TrendingUp,
} from "lucide-react";

import type { KpiKey } from "./targets";
import { KPI_TARGETS } from "./targets";
import type { KpiSnapshot } from "../lib/metrics/kpi";
import {
  formatCount,
  formatNights,
  formatPercent,
  formatToman,
  formatTomanShort,
} from "../lib/metrics/format";

/** رنگ‌بندی کارت — کلاس‌های تِیل‌ویند (روشن/تیره). */
export type KpiTone = "amber" | "indigo" | "emerald" | "sky" | "violet" | "rose";

export const KPI_TONE_CLASSES: Record<
  KpiTone,
  { tile: string; glow: string; bar: string; spark: string }
> = {
  amber: {
    tile: "bg-[linear-gradient(135deg,#fbbf24,#d97706)]",
    glow: "bg-amber-500/10",
    bar: "bg-amber-500",
    spark: "text-amber-500",
  },
  indigo: {
    tile: "bg-[linear-gradient(135deg,#818cf8,#6366f1)]",
    glow: "bg-indigo-500/10",
    bar: "bg-indigo-500",
    spark: "text-indigo-500",
  },
  emerald: {
    tile: "bg-[linear-gradient(135deg,#34d399,#059669)]",
    glow: "bg-emerald-500/10",
    bar: "bg-emerald-500",
    spark: "text-emerald-500",
  },
  sky: {
    tile: "bg-[linear-gradient(135deg,#38bdf8,#0284c7)]",
    glow: "bg-sky-500/10",
    bar: "bg-sky-500",
    spark: "text-sky-500",
  },
  violet: {
    tile: "bg-[linear-gradient(135deg,#a78bfa,#7c3aed)]",
    glow: "bg-violet-500/10",
    bar: "bg-violet-500",
    spark: "text-violet-500",
  },
  rose: {
    tile: "bg-[linear-gradient(135deg,#fb7185,#e11d48)]",
    glow: "bg-rose-500/10",
    bar: "bg-rose-500",
    spark: "text-rose-500",
  },
};

/** تعریف یک کارت KPI. */
export interface KpiCardDef {
  key: KpiKey;
  /** عنوان کارت */
  label: string;
  /** توضیح کوتاه متدولوژی — برای tooltip */
  hint: string;
  icon: ReactNode;
  tone: KpiTone;
  /** استخراج مقدار عددی از snapshot */
  value: (kpi: KpiSnapshot) => number | null;
  /**
   * مقدار هدف برای نمایش و نوار پیشرفت.
   * ⚠️ از `KPI_TARGETS` می‌آید؛ اگر هدف null باشد، نوار پیشرفت نمایش داده
   * نمی‌شود.
   */
  target: number | null;
  /** قالب‌بندی مقدار هدف برای نمایش در tooltip («هدف: …») */
  formatTarget?: (value: number) => string;
  /** قالب‌بندی مقدار برای نمایش در کارت */
  format: (value: number | null) => string;
  /** قالب‌بندی مقدار کامل (tooltip) */
  formatFull?: (value: number | null) => string;
  /**
   * آیا از این کارت sparkline نشان داده شود؟
   * (فقط شاخص‌هایی که سری زمانی معنادار دارند)
   */
  sparkline?: boolean;
  /** نوع sparkline: درآمد یا شب‌های فروخته‌شده */
  sparklineKind?: "revenue" | "nights";
}

/**
 * شش کارت KPI به‌ترتیب نمایش.
 *
 * ⚠️ ترتیب این آرایه مستقیماً ترتیب رندر است.
 */
export const KPI_CARDS: readonly KpiCardDef[] = [
  {
    key: "totalRevenue",
    label: "درآمد کل",
    hint: "مجموع درآمد شب‌به‌شب رزروهای فروخته‌شده در بازه (توزیع prorated).",
    icon: <CircleDollarSign className="size-5.5" />,
    tone: "emerald",
    value: (kpi) => kpi.totalRevenue,
    target: KPI_TARGETS.totalRevenue.value,
    formatTarget: (value) => `${formatTomanShort(value)} تومان`,
    format: (value) =>
      value === null ? "—" : `${formatTomanShort(value)} تومان`,
    formatFull: (value) =>
      value === null ? "—" : `${formatToman(value)} تومان`,
    sparkline: true,
    sparklineKind: "revenue",
  },
  {
    key: "bookingCount",
    label: "تعداد رزرو",
    hint: "تعداد رزروهای فروخته‌شده‌ای که حداقل یک شبشان داخل بازه می‌افتد.",
    icon: <CalendarCheck2 className="size-5.5" />,
    tone: "indigo",
    value: (kpi) => kpi.bookingCount,
    target: KPI_TARGETS.bookingCount.value,
    format: (value) => formatCount(value as number | null),
    sparkline: true,
    sparklineKind: "nights",
  },
  {
    key: "occupancy",
    label: "نرخ اشغال",
    hint: "شب‌های فروخته‌شده ÷ شب‌های قابل‌فروش (تعداد اقامتگاه × روزهای بازه).",
    icon: <Gauge className="size-5.5" />,
    tone: "sky",
    value: (kpi) => kpi.occupancy,
    target: KPI_TARGETS.occupancy.value,
    formatTarget: (value) => formatPercent(value),
    format: (value) => formatPercent(value as number | null),
  },
  {
    key: "adr",
    label: "ADR (نرخ هر شب)",
    hint: "میانگین درآمد هر شب فروخته‌شده = درآمد ÷ شب‌های فروخته‌شده.",
    icon: <TrendingUp className="size-5.5" />,
    tone: "violet",
    value: (kpi) => kpi.adr,
    target: KPI_TARGETS.adr.value,
    formatTarget: (value) => `${formatTomanShort(Math.round(value))} تومان`,
    format: (value) =>
      value === null ? "—" : `${formatTomanShort(Math.round(value as number))}`,
    formatFull: (value) =>
      value === null ? "—" : `${formatToman(Math.round(value as number))} تومان`,
  },
  {
    key: "cancellationRate",
    label: "نرخ لغو",
    hint: "رزروهای لغوشده ÷ کل رزروهای ثبت‌شده در بازه (مبنای createdAt).",
    icon: <Percent className="size-5.5" />,
    tone: "rose",
    value: (kpi) => kpi.cancellationRate,
    target: KPI_TARGETS.cancellationRate.value,
    formatTarget: (value) => formatPercent(value, 1),
    format: (value) => formatPercent(value as number | null, 1),
  },
  {
    key: "averageStay",
    label: "میانگین اقامت",
    hint: "میانگین شب‌های رزروهای فروخته‌شده در بازه.",
    icon: <BedDouble className="size-5.5" />,
    tone: "indigo",
    value: (kpi) => kpi.averageStay,
    target: KPI_TARGETS.averageStay.value,
    formatTarget: (value) => formatNights(value),
    format: (value) => formatNights(value as number | null),
  },
] as const;
