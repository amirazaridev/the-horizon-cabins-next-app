"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import CardDashContainer from "@/components/ui/CardDashContainer";
import { WidgetEmpty } from "../WidgetStates";
import { cityPerformance } from "../../lib/metrics/analytics";
import { formatToman, formatTomanShort } from "../../lib/metrics/format";
import type { DateRange } from "../../lib/metrics/range";
import { CHART_COLORS, CHART_TOOLTIP_STYLE } from "../../config/chart-theme";
import type {
  DashboardBooking,
  DashboardCabin,
} from "../../types/dashboard.types";

interface CityRevenueChartProps {
  bookings: DashboardBooking[];
  cabins: DashboardCabin[];
  range: DateRange;
  /** حداکثر تعداد شهر نمایش‌داده‌شده — بقیه در «سایر» تجمیع می‌شوند */
  maxCities?: number;
}

interface CityDatum {
  city: string;
  revenue: number;
}

/**
 * نمودار درآمد به تفکیک شهر.
 *
 * ⭐ از `cityPerformance` می‌آید (نه محاسبه‌ی دستی داخل کامپوننت) تا
 * تعریف درآمد با بقیه‌ی داشبورد یکسان بماند (شب‌به‌شب/prorated).
 *
 * شهرهای خارج از Top-N در یک باکت «سایر شهرها» تجمیع می‌شوند تا محور X
 * شلوغ نشود.
 */
export default function CityRevenueChart({
  bookings,
  cabins,
  range,
  maxCities = 6,
}: CityRevenueChartProps) {
  const data = useMemo<CityDatum[]>(() => {
    const rows = cityPerformance(bookings, cabins, range, null);
    const positive = rows.filter((row) => row.revenue > 0);

    if (positive.length <= maxCities) {
      return positive.map((row) => ({ city: row.label, revenue: row.revenue }));
    }

    const top = positive.slice(0, maxCities);
    const restRevenue = positive
      .slice(maxCities)
      .reduce((sum, row) => sum + row.revenue, 0);

    return [
      ...top.map((row) => ({ city: row.label, revenue: row.revenue })),
      { city: "سایر شهرها", revenue: restRevenue },
    ];
  }, [bookings, cabins, range, maxCities]);

  const total = useMemo(
    () => data.reduce((sum, point) => sum + point.revenue, 0),
    [data],
  );

  return (
    <CardDashContainer className="flex h-full w-full flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-text font-semibold">درآمد به تفکیک شهر</h3>
          <p className="text-text-gray text-sm">سهم هر شهر از درآمد بازه</p>
        </div>
        <div className="shrink-0 text-left">
          <p className="text-text text-sm font-bold tabular-nums">
            {formatTomanShort(total)} تومان
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <WidgetEmpty
          label="درآمدی برای بازهٔ انتخابی ثبت نشده"
          description="بازه یا فیلترها را تغییر دهید تا سهم شهرها نمایش داده شود."
          className="h-[260px]"
        />
      ) : (
        <>
          <p className="sr-only">
            مجموع درآمد {formatToman(total)} تومان. سهم شهرها:{" "}
            {data
              .map((point) => `${point.city} ${formatTomanShort(point.revenue)} تومان`)
              .join("، ")}
            .
          </p>
          <div dir="ltr" style={{ width: "100%" }} aria-hidden="true">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 12, left: 8, bottom: 0 }}
              barCategoryGap="26%"
            >
              <XAxis
                type="number"
                reversed
                hide
                domain={[0, "dataMax"]}
              />
              <YAxis
                type="category"
                dataKey="city"
                orientation="right"
                width={110}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-text)", fontSize: 12 }}
              />

              <Tooltip
                cursor={{ fill: "var(--color-foreground)", fillOpacity: 0.04 }}
                contentStyle={CHART_TOOLTIP_STYLE}
                itemStyle={{ color: "var(--color-text)" }}
                formatter={(value) => [
                  `${formatToman(Number(value))} تومان`,
                  "درآمد",
                ]}
              />

              <Bar dataKey="revenue" radius={7} maxBarSize={26}>
                {data.map((datum, index) => (
                  <Cell
                    key={datum.city}
                    fill={
                      index === 0 ? CHART_COLORS.primary : CHART_COLORS.primaryDark
                    }
                    fillOpacity={index === 0 ? 1 : 0.62}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          </div>
        </>
      )}
    </CardDashContainer>
  );
}
