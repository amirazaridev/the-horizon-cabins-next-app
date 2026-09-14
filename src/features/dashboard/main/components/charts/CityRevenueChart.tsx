"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import CardDashContainer from "../../../components/CardDashContainer";
import { CABINS, type Booking } from "../../data/mock-data";
import { formatCurrency } from "@/libs/utils/format";

export default function CityRevenueChart({
  bookings,
}: {
  bookings: Booking[];
}) {
  const data = useMemo(() => {
    const map = new Map<string, number>();
    bookings.forEach((b) => {
      const city = CABINS.find((c) => c.id === b.cabinId)?.city ?? "نامشخص";
      map.set(city, (map.get(city) ?? 0) + b.totalPrice);
    });
    return [...map.entries()]
      .map(([city, revenue]) => ({ city, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [bookings]);

  const total = data.reduce((acc, c) => acc + c.revenue, 0);

  return (
    <CardDashContainer className="flex h-full w-full flex-col gap-4 p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-text font-semibold">درآمد به تفکیک شهر</h3>
          <p className="text-text-gray text-sm">سهم هر شهر از درآمد بازه</p>
        </div>
        <div className="text-left">
          <p className="text-text text-sm font-bold">{formatCurrency(total)}</p>
          <p className="text-text-gray text-xs">تومان</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
          barCategoryGap="30%"
        >
          <defs>
            <linearGradient
              id="cityRevenueGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="var(--color-primary-400)" />
              <stop
                offset="100%"
                stopColor="var(--color-primary-600)"
                stopOpacity={0.6}
              />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="city"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-text-gray)", fontSize: 11 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={40}
            tick={{ fill: "var(--color-text-gray)", fontSize: 11 }}
            tickFormatter={(v) => `${Math.round(Number(v) / 1_000_000)}م`}
          />

          <Tooltip
            cursor={{ fill: "var(--color-foreground)", fillOpacity: 0.04 }}
            contentStyle={{
              borderRadius: 10,
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              direction: "rtl",
            }}
            formatter={(value) => [
              `${formatCurrency(Number(value))} تومان`,
              "درآمد",
            ]}
          />

          <Bar
            dataKey="revenue"
            radius={[8, 8, 2, 2]}
            fill="url(#cityRevenueGradient)"
            maxBarSize={44}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardDashContainer>
  );
}
