"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import CardDashContainer from "@/components/ui/CardDashContainer";
import { WidgetEmpty } from "../WidgetStates";
import { formatBucketLabel } from "../../lib/date-range";
import {
  pickGranularity,
  revenueSeries,
  soldNights,
  type TrendGranularity,
} from "../../lib/metrics/kpi";
import { formatTomanShort, formatToman, formatNumber } from "../../lib/metrics/format";
import type { DateRange } from "../../lib/metrics/range";
import {
  CHART_AXIS_TICK,
  CHART_COLORS,
  CHART_TOOLTIP_STYLE,
} from "../../config/chart-theme";
import type { DashboardBooking } from "../../types/dashboard.types";

interface RevenueTrendChartProps {
  /** رزروهای بازه‌ی اصلی (فیلترشده) */
  bookings: DashboardBooking[];
  /** بازه‌ی اصلی */
  range: DateRange;
  /** رزروهای بازه‌ی مقایسه — برای خط مقایسه (یا خالی) */
  compareBookings: DashboardBooking[];
  /** آیا خط مقایسه نمایش داده شود؟ */
  compareEnabled: boolean;
  /** برچسب بازه‌ی مقایسه — «دوره قبل» یا «سال قبل» */
  compareLabel: string;
}

interface TrendPoint {
  key: string;
  label: string;
  revenue: number;
  compare: number | null;
}

/**
 * نمودار روند درآمد + خط مقایسه.
 *
 * ⭐ خط مقایسه **به‌ازای هر باکت** حساب می‌شود: سری درآمد بازه‌ی مقایسه
 * با همان سطح تجمیع ساخته و روی محور اصلی نگاشت می‌شود. اگر طول یا سطح
 * تجمیع دو بازه یکی نباشد (همیشه یکی است، چون `prev-period`/`prev-year`
 * طول‌برابرند)، نقاط به‌ترتیب ایندکس روی هم می‌افتند.
 *
 * ⚠️ برای اینکه مقایسه معنادار بماند، از `granularity` یکسان برای هر دو
 * سری استفاده می‌شود.
 */
export default function RevenueTrendChart({
  bookings,
  range,
  compareBookings,
  compareEnabled,
  compareLabel,
}: RevenueTrendChartProps) {
  const granularity: TrendGranularity = useMemo(
    () => pickGranularity(range),
    [range],
  );

  const data = useMemo<TrendPoint[]>(() => {
    const current = revenueSeries(bookings, range, granularity);
    const compare = compareEnabled
      ? revenueSeries(compareBookings, range, granularity)
      : [];

    return current.map((point, index) => ({
      key: point.key,
      label: formatBucketLabel(point.date, granularity),
      revenue: point.revenue,
      compare: compareEnabled ? (compare[index]?.revenue ?? 0) : null,
    }));
  }, [bookings, compareBookings, range, granularity, compareEnabled]);

  const totalRevenue = useMemo(
    () => data.reduce((sum, point) => sum + point.revenue, 0),
    [data],
  );

  const totalNights = useMemo(
    () => soldNights(bookings, range),
    [bookings, range],
  );

  const showCompare = compareEnabled && data.some((p) => p.compare !== null);

  const hasData = data.some((point) => point.revenue > 0) || totalNights > 0;

  return (
    <CardDashContainer className="flex h-full w-full flex-col gap-5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-text font-semibold">روند درآمد</h3>
          <p className="text-text-gray text-sm">
            درآمد شب‌به‌شب، تجمیع{" "}
            {granularity === "daily"
              ? "روزانه"
              : granularity === "weekly"
                ? "هفتگی"
                : "ماهانه"}
          </p>
        </div>
        <div className="shrink-0 text-left">
          <p className="text-text text-lg font-extrabold tabular-nums">
            {formatTomanShort(totalRevenue)} تومان
          </p>
          <p className="text-text-gray text-xs tabular-nums">
            {formatNumber(totalNights)} شب فروخته‌شده
          </p>
        </div>
      </div>

      {!hasData ? (
        <WidgetEmpty
          label="درآمدی برای بازهٔ انتخابی ثبت نشده"
          description="در این بازه هیچ شبِ فروخته‌شده‌ای وجود ندارد. بازه یا فیلترها را تغییر دهید."
          className="h-[280px]"
        />
      ) : (
        <>
          {/* خلاصه‌ی متنی برای صفحه‌خوان — نقش نمودار تصویری است */}
          <p className="sr-only">
            مجموع درآمد بازه {formatToman(totalRevenue)} تومان و مجموع شب‌های
            فروخته‌شده {formatNumber(totalNights)} شب است. جزئیات هر بازه در
            جدول عملکرد همین صفحه آمده است.
          </p>
          <div dir="ltr" style={{ width: "100%" }} aria-hidden="true">
            <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={CHART_COLORS.primary}
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor={CHART_COLORS.primary}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

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
              axisLine={false}
              tickLine={false}
              width={48}
              tick={CHART_AXIS_TICK}
              tickFormatter={(value) => formatTomanShort(Number(value))}
            />

            <Tooltip
              cursor={{
                stroke: "var(--color-border-strong)",
                strokeDasharray: "4 4",
              }}
              contentStyle={CHART_TOOLTIP_STYLE}
              labelStyle={{ color: "var(--color-text)" }}
              formatter={(value, name) => [
                `${formatToman(Number(value))} تومان`,
                name,
              ]}
            />

            <Area
              dataKey="revenue"
              type="monotone"
              stroke={CHART_COLORS.primary}
              strokeWidth={2.5}
              fill="url(#revenueFill)"
              name="درآمد دوره"
              dot={false}
              activeDot={{
                r: 6,
                fill: CHART_COLORS.primary,
                stroke: "var(--color-surface)",
                strokeWidth: 3,
              }}
            />

            {showCompare && (
              <Area
                dataKey="compare"
                type="monotone"
                stroke={CHART_COLORS.indigo}
                strokeWidth={2}
                strokeDasharray="6 5"
                fill="transparent"
                name={compareLabel}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: CHART_COLORS.indigo,
                  stroke: "var(--color-surface)",
                  strokeWidth: 2,
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <LegendItem color={CHART_COLORS.primary} label="درآمد دوره" />
            {showCompare && (
              <LegendItem
                color={CHART_COLORS.indigo}
                label={compareLabel}
                dashed
              />
            )}
          </div>
        </>
      )}
    </CardDashContainer>
  );
}

function LegendItem({
  color,
  label,
  dashed,
}: {
  color: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {dashed ? (
        <span
          className="h-0.5 w-4 shrink-0 rounded-full"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 5px, transparent 5px 9px)`,
          }}
        />
      ) : (
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      <span className="text-text text-sm">{label}</span>
    </div>
  );
}
