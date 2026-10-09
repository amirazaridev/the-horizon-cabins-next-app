"use client";

import { useMemo, type ReactNode } from "react";

import { KPI_CARDS } from "../../config/kpi-cards.config";
import {
  computeKpis,
  deltaPercent,
  pickGranularity,
  revenueSeries,
  soldNightsSeries,
  type KpiSnapshot,
} from "../../lib/metrics/kpi";
import type { DateRange } from "../../lib/metrics/range";
import type { DashboardBooking } from "../../types/dashboard.types";
import type { KpiKey } from "../../config/targets";
import KpiCard from "./KpiCard";

interface KpiRowProps {
  /** رزروهای داخل بازه (فیلترشده) */
  bookings: DashboardBooking[];
  /** رزروهای بازه‌ی مقایسه (یا خالی اگر مقایسه خاموش است) */
  compareBookings: DashboardBooking[];
  /** تعداد اقامتگاه‌های فعال (بعد از فیلتر) */
  activeCabinCount: number;
  /** بازه‌ی اصلی */
  range: DateRange;
  /** بازه‌ی مقایسه (یا null) */
  compareRange: DateRange | null;
  /** آیا مقایسه فعال است؟ */
  compareEnabled: boolean;
  /** در حال بارگذاری؟ */
  loading?: boolean;
  /** drill-down: کلیک روی کارت یک فیلتر را اعمال می‌کند */
  onDrill?: (key: KpiKey) => void;
}

/** استخراج یک شاخص از snapshot. */
function pickKpi(snapshot: KpiSnapshot, key: KpiKey): number | null {
  return snapshot[key];
}

/** Δ هر شاخص بین بازه‌ی اصلی و بازه‌ی مقایسه. */
function computeDelta(
  key: KpiKey,
  current: KpiSnapshot,
  previous: KpiSnapshot | null,
): number | null {
  if (!previous) return null;
  return deltaPercent(current[key], previous[key]);
}

/**
 * ردیف ۸ کارت KPI.
 *
 * همه‌ی محاسبات (KPI، Δ، sparkline) اینجا از توابع pure `lib/metrics`
 * می‌آید. کامپوننت هیچ عددی را خودش محاسبه نمی‌کند.
 */
export default function KpiRow({
  bookings,
  compareBookings,
  activeCabinCount,
  range,
  compareRange,
  compareEnabled,
  loading = false,
  onDrill,
}: KpiRowProps): ReactNode {
  const kpi = useMemo(
    () => computeKpis(bookings, activeCabinCount, range),
    [bookings, activeCabinCount, range],
  );

  const prevKpi = useMemo(
    () =>
      compareRange
        ? computeKpis(compareBookings, activeCabinCount, compareRange)
        : null,
    [compareBookings, activeCabinCount, compareRange],
  );

  // سری‌های sparkline — فقط وقتی بازه کوتاه‌اند تا نمودار معنادار باشد
  const granularity = useMemo(() => pickGranularity(range), [range]);

  const revenuePoints = useMemo(
    () => revenueSeries(bookings, range, granularity).map((p) => p.revenue),
    [bookings, range, granularity],
  );

  const nightsSeries = useMemo(
    () => soldNightsSeries(bookings, range, granularity),
    [bookings, range, granularity],
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {KPI_CARDS.map((def) => {
        const value = pickKpi(kpi, def.key);
        const compareValue = prevKpi ? pickKpi(prevKpi, def.key) : null;
        const delta = compareEnabled
          ? computeDelta(def.key, kpi, prevKpi)
          : null;

        const sparkline = def.sparkline
          ? def.sparklineKind === "revenue"
            ? revenuePoints
            : nightsSeries
          : undefined;

        return (
          <KpiCard
            key={def.key}
            def={def}
            value={value}
            compareValue={compareValue}
            delta={delta}
            loading={loading}
            sparkline={sparkline}
            onClick={onDrill ? () => onDrill(def.key) : undefined}
          />
        );
      })}
    </div>
  );
}
