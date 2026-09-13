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

import CardDashContainer from "../../../components/CardDashContainer";
import type { Booking, Cabin } from "../../data/mock-data";

interface OccupancyChartProps {
  bookings: Booking[];
  cabins: Cabin[];
  numDays: number;
}

export default function OccupancyChart({
  bookings,
  cabins,
  numDays,
}: OccupancyChartProps) {
  const data = useMemo(
    () =>
      cabins
        .map((cabin) => {
          const nights = bookings
            .filter((b) => b.cabinId === cabin.id)
            .reduce((acc, b) => acc + b.numNights, 0);
          return {
            name: cabin.name,
            occupancy: Math.min(100, Math.round((nights / numDays) * 100)),
          };
        })
        .sort((a, b) => b.occupancy - a.occupancy),
    [bookings, cabins, numDays],
  );

  const max = Math.max(...data.map((d) => d.occupancy), 1);

  return (
    <CardDashContainer className="flex h-full w-full flex-col gap-4 p-5">
      <div>
        <h3 className="text-text font-semibold">نرخ اشغال سوییت‌ها</h3>
        <p className="text-text-gray text-sm">
          درصد شب‌های رزرو شده در بازه انتخابی
        </p>
      </div>

      {/* dir="ltr" اینجا عمداً هست: جلوگیری از برعکس‌شدن text-anchor داخل SVG به‌خاطر RTL بودن صفحه */}
      <div dir="ltr" style={{ width: "100%" }}>
        <ResponsiveContainer
          width="100%"
          height={Math.max(240, data.length * 34)}
        >
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
            barCategoryGap="28%"
          >
            <XAxis type="number" domain={[0, 100]} reversed hide />
            <YAxis
              type="category"
              dataKey="name"
              orientation="right"
              width={125}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-text)", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "var(--color-foreground)", fillOpacity: 0.04 }}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                direction: "rtl",
              }}
              itemStyle={{ color: "var(--color-text)" }}
              formatter={(value) => [`${value}٪`, "اشغال"]}
            />
            <Bar dataKey="occupancy" radius={7} barSize={15}>
              {data.map((d) => (
                <Cell
                  key={d.name}
                  fill={
                    d.occupancy === max
                      ? "var(--color-primary-400)"
                      : "var(--color-indigo-400)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardDashContainer>
  );
}
