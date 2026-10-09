"use client";

import { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import CardDashContainer from "@/components/ui/CardDashContainer";
import { WidgetEmpty } from "../WidgetStates";
import { formatBucketLabel } from "../../lib/date-range";
import {
  occupancyAdrSeries,
  pickGranularity,
  type TrendGranularity,
} from "../../lib/metrics/kpi";
import { formatPercentValue, formatToman, formatTomanShort } from "../../lib/metrics/format";
import type { DateRange } from "../../lib/metrics/range";
import {
  CHART_AXIS_TICK,
  CHART_COLORS,
  CHART_TOOLTIP_STYLE,
} from "../../config/chart-theme";
import type { DashboardBooking } from "../../types/dashboard.types";

interface OccupancyAdrChartProps {
  bookings: DashboardBooking[];
  cabinCount: number;
  range: DateRange;
}

interface ComboPoint {
  label: string;
  /** درصد ۰..۱۰۰ (برای محور راست) */
  occupancy: number | null;
  /** تومان */
  adr: number | null;
}

/**
 * نمودار ترکیبی اشغال + ADR.
 *
 * - **میله‌ها**: نرخ اشغال هر باکت (٪)
 * - **خط**: ADR هر باکت (تومان)
 *
 * ⭐ دو محور عمودی جدا: اشغال (٪) و ADR (تومان) مقیاس‌های متفاوتی دارند.
 * ترکیب‌شان در یک محور، خط ADR را به کف می‌چسباند.
 */
export default function OccupancyAdrChart({
  bookings,
  cabinCount,
  range,
}: OccupancyAdrChartProps) {
  const granularity: TrendGranularity = useMemo(
    () => pickGranularity(range),
    [range],
  );

  const data = useMemo<ComboPoint[]>(() => {
    return occupancyAdrSeries(bookings, cabinCount, range, granularity).map(
      (point) => ({
        label: formatBucketLabel(point.date, granularity),
        occupancy:
          point.occupancy === null ? null : Math.round(point.occupancy * 1000) / 10,
        adr: point.adr === null ? null : Math.round(point.adr),
      }),
    );
  }, [bookings, cabinCount, range, granularity]);

  const hasOccupancy = data.some((p) => p.occupancy !== null);
  const hasAdr = data.some((p) => p.adr !== null);

  return (
    <CardDashContainer className="flex h-full w-full flex-col gap-4 p-5">
      <div>
        <h3 className="text-text font-semibold">اشغال و ADR</h3>
        <p className="text-text-gray text-sm">
          نرخ اشغال (میله) در برابر میانگین نرخ هر شب (خط)
        </p>
      </div>

      <p className="sr-only">
        {data.length === 0
          ? "داده‌ای برای بازهٔ انتخابی وجود ندارد."
          : `نمودار ترکیبی نرخ اشغال و میانگین نرخ هر شب در ${data.length.toLocaleString("fa-IR")} بازه. ${
              hasOccupancy
                ? `میانگین نرخ اشغال ${formatPercentValue(
                    data.reduce(
                      (sum, point) => sum + (point.occupancy ?? 0),
                      0,
                    ) / Math.max(data.length, 1),
                    1,
                  )} است.`
                : ""
            }`}
      </p>

      {data.length === 0 ? (
        <WidgetEmpty
          label="داده‌ای برای بازهٔ انتخابی نیست"
          description="بازه یا فیلترها را تغییر دهید تا داده نمایش داده شود."
          className="h-[280px]"
        />
      ) : (
        <div dir="ltr" style={{ width: "100%" }} aria-hidden="true">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid horizontal vertical={false} stroke={CHART_COLORS.grid} />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={CHART_AXIS_TICK}
                dy={10}
                minTickGap={24}
              />
              <YAxis
                yAxisId="occupancy"
                axisLine={false}
                tickLine={false}
                width={40}
                domain={[0, 100]}
                tick={CHART_AXIS_TICK}
                tickFormatter={(value) => `${value}٪`}
              />
              <YAxis
                yAxisId="adr"
                orientation="right"
                axisLine={false}
                tickLine={false}
                width={48}
                tick={CHART_AXIS_TICK}
                tickFormatter={(value) => formatTomanShort(Number(value))}
              />

              <Tooltip
                cursor={{ fill: "var(--color-foreground)", fillOpacity: 0.04 }}
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={{ color: "var(--color-text)" }}
                formatter={(value, name) =>
                  name === "نرخ اشغال"
                    ? [formatPercentValue(Number(value)), name]
                    : [`${formatToman(Number(value))} تومان`, name]
                }
              />

              {hasOccupancy && (
                <Bar
                  yAxisId="occupancy"
                  dataKey="occupancy"
                  name="نرخ اشغال"
                  fill={CHART_COLORS.indigo}
                  radius={[5, 5, 0, 0]}
                  maxBarSize={34}
                />
              )}

              {hasAdr && (
                <Line
                  yAxisId="adr"
                  dataKey="adr"
                  name="ADR"
                  type="monotone"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2.5}
                  dot={false}
                  connectNulls
                  activeDot={{
                    r: 5,
                    fill: CHART_COLORS.primary,
                    stroke: "var(--color-surface)",
                    strokeWidth: 2,
                  }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-6">
        {hasOccupancy && (
          <LegendItem color={CHART_COLORS.indigo} label="نرخ اشغال" square />
        )}
        {hasAdr && <LegendItem color={CHART_COLORS.primary} label="ADR" />}
      </div>
    </CardDashContainer>
  );
}

function LegendItem({
  color,
  label,
  square,
}: {
  color: string;
  label: string;
  square?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`shrink-0 ${square ? "size-2.5 rounded-sm" : "size-2.5 rounded-full"}`}
        style={{ backgroundColor: color }}
      />
      <span className="text-text text-sm">{label}</span>
    </div>
  );
}
