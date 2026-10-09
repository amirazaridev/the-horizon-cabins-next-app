"use client";

import { useMemo, type ReactNode } from "react";
import { ArrowDownLeft, ArrowUpRight, Info, Minus } from "lucide-react";

import Skeleton from "@/components/ui/Skeleton";
import CardDashContainer from "@/components/ui/CardDashContainer";
import { KPI_TONE_CLASSES, type KpiCardDef } from "../../config/kpi-cards.config";
import { type KpiKey, meetsTarget, targetProgress } from "../../config/targets";
import { formatDelta } from "../../lib/metrics/format";

/* ==========================================================================
   Sparkline — SVG سبک بدون کتابخانه
   ========================================================================== */

interface SparklineProps {
  points: number[];
}

/**
 * نمودار جرقه‌ای کوچک.
 *
 * ⚠️ از SVG خام استفاده می‌شود نه `recharts` — چون sparkline فقط به یک
 * path نیاز دارد و ResponsiveContainer برای این اندازه overkill است.
 * رنگ از والد (`text-*` روی `tone.spark`) با `currentColor` ارث می‌برد.
 */
function Sparkline({ points }: SparklineProps): ReactNode {
  const path = useMemo(() => {
    if (points.length < 2) return null;

    const width = 100;
    const height = 28;
    const max = Math.max(...points, 1);
    const min = Math.min(...points, 0);
    const span = max - min || 1;

    return points
      .map((value, index) => {
        const x = (index / (points.length - 1)) * width;
        const y = height - ((value - min) / span) * height;
        return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [points]);

  if (!path) return <div className="h-7" aria-hidden="true" />;

  return (
    <svg
      viewBox="0 0 100 28"
      preserveAspectRatio="none"
      className="h-7 w-full"
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ==========================================================================
   KpiCard
   ========================================================================== */

export interface KpiCardProps {
  def: KpiCardDef;
  /** مقدار فعلی */
  value: number | null;
  /** مقدار دوره‌ی مقایسه (یا null اگر مقایسه خاموش است) */
  compareValue: number | null;
  /** Δ محاسبه‌شده (نسبت) — یا null */
  delta: number | null;
  /** آیا کارت در حال بارگذاری است؟ */
  loading?: boolean;
  /** نقاط sparkline (اختیاری) */
  sparkline?: number[];
  /** کلیک روی کارت — drill-down */
  onClick?: () => void;
}

/**
 * کارت KPI.
 *
 * شامل: مقدار، Δ نسبت به دوره‌ی مقایسه (رنگ بر اساس **جهت مطلوب**)،
 * نوار پیشرفت نسبت به هدف، sparkline اختیاری، و tooltip متدولوژی.
 */
export default function KpiCard({
  def,
  value,
  compareValue,
  delta,
  loading = false,
  sparkline,
  onClick,
}: KpiCardProps) {
  const tone = KPI_TONE_CLASSES[def.tone];

  const numeric = value;
  const achieved = meetsTarget(def.key, numeric);
  const progress = targetProgress(def.key, numeric);

  if (loading) {
    return (
      <CardDashContainer className="relative overflow-hidden p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3.5 w-24 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-3.5 w-32 rounded-full" />
          </div>
          <Skeleton className="size-11.5 shrink-0 rounded-xl" />
        </div>
        <Skeleton className="mt-4 h-1.5 w-full rounded-full" />
      </CardDashContainer>
    );
  }

  const deltaDirection = deltaDirectionOf(def.key, delta);

  return (
    <CardDashContainer
      className={`relative overflow-hidden p-5 ${
        onClick
          ? "focus-visible:ring-primary-400/60 cursor-pointer focus-visible:ring-2 focus-visible:outline-none"
          : ""
      }`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `${def.label} — مشاهده‌ی جزئیات` : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div
        className={`${tone.glow} pointer-events-none absolute -top-10 -left-10 size-35 rounded-full blur-2xl`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted truncate text-sm">{def.label}</span>
            <Tooltip text={def.hint} />
          </div>

          <span className="text-text truncate text-2xl font-extrabold tracking-tight tabular-nums">
            {def.format(value)}
          </span>

          <DeltaLine
            delta={delta}
            direction={deltaDirection}
            compareValue={compareValue}
          />
        </div>

        <div
          className={`${tone.tile} grid size-11.5 shrink-0 place-items-center rounded-xl text-white shadow-lg`}
        >
          {def.icon}
        </div>
      </div>

      {sparkline && sparkline.length > 1 && (
        <div className={`mt-3 ${tone.spark}`}>
          <Sparkline points={sparkline} />
        </div>
      )}

      {progress !== null && def.target !== null && (
        <div className="mt-3 flex flex-col gap-1">
          <div className="bg-background h-1.5 w-full overflow-hidden rounded-full">
            <div
              className={`h-full rounded-full transition-[width] duration-500 ${
                achieved ? "bg-emerald-500" : tone.bar
              }`}
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <span className="text-text-gray text-[11px]">
            هدف: {def.formatTarget ? def.formatTarget(def.target) : def.target}
          </span>
        </div>
      )}
    </CardDashContainer>
  );
}

/* ==========================================================================
   کمکی‌ها
   ========================================================================== */

/** خط Δ با رنگ بر اساس جهت مطلوب شاخص. */
function DeltaLine({
  delta,
  direction,
  compareValue,
}: {
  delta: number | null;
  direction: "good" | "bad" | "neutral";
  compareValue: number | null;
}): ReactNode {
  if (delta === null) {
    const hasCompare = compareValue !== null && compareValue !== undefined;
    return (
      <span className="text-text-gray flex items-center gap-1 text-xs font-normal">
        {hasCompare ? "بدون مبنای مقایسه" : "بدون مقایسه"}
      </span>
    );
  }

  const colorClass =
    direction === "good"
      ? "text-emerald-600 dark:text-emerald-400"
      : direction === "bad"
        ? "text-rose-600 dark:text-rose-400"
        : "text-text-gray";

  const Icon =
    delta > 0 ? ArrowUpRight : delta < 0 ? ArrowDownLeft : Minus;

  return (
    <span
      className={`flex items-center gap-1 text-xs font-semibold ${colorClass}`}
    >
      <Icon className="size-3.5" />
      <span className="tabular-nums">{formatDelta(delta)}</span>
      <span className="text-text-gray font-normal">نسبت به دوره قبل</span>
    </span>
  );
}

/**
 * جهت خروجی Δ:
 * - برای شاخصی که «بالاتر بهتر» است ⇒ افزایش = خوب
 * - برای شاخصی که «پایین‌تر بهتر» است (نرخ لغو/مطالبات) ⇒ کاهش = خوب
 * - شاخص‌های بدون جهت مشخص (نرخ لغو دو طرفه معنا ندارد) ⇒ neutral
 */
function deltaDirectionOf(
  key: KpiKey,
  delta: number | null,
): "good" | "bad" | "neutral" {
  if (delta === null || delta === 0) return "neutral";

  const lowerIsBetter: KpiKey[] = ["cancellationRate"];
  const higherIsBetter: KpiKey[] = [
    "totalRevenue",
    "bookingCount",
    "occupancy",
    "adr",
    "averageStay",
  ];

  if (lowerIsBetter.includes(key)) return delta < 0 ? "good" : "bad";
  if (higherIsBetter.includes(key)) return delta > 0 ? "good" : "bad";
  return "neutral";
}

/** آیکون اطالعات با tooltip ساده (title) — سبک و بومی مرورگر. */
function Tooltip({ text }: { text: string }): ReactNode {
  return (
    <span
      className="text-text-gray hover:text-text inline-flex cursor-help"
      title={text}
      aria-label={text}
    >
      <Info className="size-3.5" />
    </span>
  );
}
