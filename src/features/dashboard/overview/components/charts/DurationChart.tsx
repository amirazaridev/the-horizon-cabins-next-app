"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "@/contexts/ThemeContext";

import CardDashContainer from "@/components/ui/CardDashContainer";
import { WidgetEmpty } from "../WidgetStates";
import { durationDistribution } from "../../lib/metrics/analytics";
import { formatNights, formatPercentValue } from "../../lib/metrics/format";
import type { DateRange } from "../../lib/metrics/range";
import {
  CHART_TOOLTIP_STYLE,
  DURATION_COLORS_DARK,
  DURATION_COLORS_LIGHT,
} from "../../config/chart-theme";
import type { DashboardBooking } from "../../types/dashboard.types";

interface DurationChartProps {
  bookings: DashboardBooking[];
  range: DateRange;
}

/**
 * خلاصه‌ی توزیع مدت اقامت.
 *
 * ⭐ باکت‌ها **تک‌منبع**اند: از `durationDistribution()` می‌آیند، نه
 * منطق تکراری داخل کامپوننت. پس برچسب‌ها و مرزهای سطل‌ها همه‌جا یکی است.
 */
export default function DurationChart({ bookings, range }: DurationChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const palette = isDark ? DURATION_COLORS_DARK : DURATION_COLORS_LIGHT;

  const buckets = useMemo(
    () => durationDistribution(bookings, range),
    [bookings, range],
  );

  const data = useMemo(
    () =>
      buckets
        .map((bucket, index) => ({
          duration: bucket.label,
          value: bucket.count,
          percent: bucket.share === null ? 0 : Math.round(bucket.share * 100),
          color: palette[index % palette.length],
        }))
        .filter((item) => item.value > 0),
    [buckets, palette],
  );

  const totalStays = useMemo(
    () => buckets.reduce((sum, bucket) => sum + bucket.count, 0),
    [buckets],
  );

  const averageNights = useMemo(
    () =>
      totalStays === 0
        ? 0
        : buckets.reduce((sum, bucket) => {
            // نقطه‌ی میانی هر سطل به‌عنوان نماینده (مثل قبل)
            const mid =
              bucket.max === null ? bucket.min : (bucket.min + bucket.max) / 2;
            return sum + mid * bucket.count;
          }, 0) / totalStays,
    [buckets, totalStays],
  );

  return (
    <CardDashContainer className="flex w-full flex-col gap-y-4 p-5">
      <div className="font-semibold">
        <h3 className="text-text">خلاصه مدت اقامت</h3>
      </div>

      <p className="sr-only">
        {data.length === 0
          ? "اقامتی برای بازهٔ انتخابی ثبت نشده است."
          : `میانگین مدت اقامت ${formatNights(averageNights, 1)} است. توزیع: ${data
              .map((item) => `${item.duration} ${formatPercentValue(item.percent)}`)
              .join("، ")}.`}
      </p>

      {data.length === 0 ? (
        <WidgetEmpty
          label="اقامتی برای بازهٔ انتخابی ثبت نشده"
          description="با تغییر بازه یا فیلترها، توزیع مدت اقامت نمایش داده می‌شود."
          className="h-[280px]"
        />
      ) : (
        <>
          <div className="relative" dir="ltr" aria-hidden="true">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data}
                  nameKey="duration"
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={78}
                  outerRadius={100}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={4}
                  cornerRadius={8}
                  stroke="none"
                >
                  {data.map((item) => (
                    <Cell fill={item.color} key={item.duration} />
                  ))}
                </Pie>
                <Tooltip
                  wrapperStyle={{ zIndex: 50 }}
                  contentStyle={CHART_TOOLTIP_STYLE}
                  formatter={(value, name, props) => [
                    `${props.payload.percent.toLocaleString(
                      "fa-IR",
                    )}٪ (${Number(value).toLocaleString("fa-IR")})`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-text text-2xl font-bold tabular-nums">
                {formatNights(averageNights, 1)}
              </span>
              <span className="text-text-gray text-xs">میانگین اقامت</span>
            </div>
          </div>

          <div className="flex flex-col gap-y-3">
            {data.map((item) => (
              <div
                key={item.duration}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-text text-sm">{item.duration}</span>
                </div>
                <span className="text-text text-sm font-semibold tabular-nums">
                  {formatPercentValue(item.percent)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </CardDashContainer>
  );
}
