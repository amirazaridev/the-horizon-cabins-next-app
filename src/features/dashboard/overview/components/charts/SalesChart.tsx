"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { eachDayOfInterval, format, startOfWeek } from "date-fns";
import { format as formatJalali } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";

import { formatCurrency } from "@/libs/utils/format";
import CardDashContainer from "../../../shared/components/CardDashContainer";
import type { Booking } from "../../data/mock-data";

interface SalesChartProps {
  bookings: Booking[];
  from: Date;
  to: Date;
}

interface ChartPoint {
  label: string;
  totalSales: number;
  extrasSales: number;
}

export default function SalesChart({ bookings, from, to }: SalesChartProps) {
  const totalSales = bookings.reduce((acc, b) => acc + b.totalPrice, 0);
  const data: ChartPoint[] = (() => {
    const days = eachDayOfInterval({ start: from, end: to });
    const groupByWeek = days.length > 31;

    const buckets = new Map<string, ChartPoint>();

    days.forEach((day) => {
      const d = groupByWeek ? startOfWeek(day) : day;
      const key = format(d, "yyyy-MM-dd");
      if (!buckets.has(key)) {
        buckets.set(key, {
          label: formatJalali(d, "d MMMM", { locale: faIR }),
          totalSales: 0,
          extrasSales: 0,
        });
      }
    });

    bookings.forEach((b) => {
      const d = new Date(`${b.startDate}T00:00:00`);
      const key = format(groupByWeek ? startOfWeek(d) : d, "yyyy-MM-dd");
      const bucket = buckets.get(key);
      if (!bucket) return;
      bucket.totalSales += b.totalPrice;
      bucket.extrasSales += b.extrasPrice;
    });

    return [...buckets.values()];
  })();

  return (
    <CardDashContainer className="flex h-full w-full flex-col gap-5 p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-text font-semibold">روند درآمد</h3>
          <p className="text-text-gray text-sm">درآمد رزروها در بازه انتخابی</p>
        </div>
        <div className="text-left">
          <p className="text-text text-lg font-extrabold">
            {formatCurrency(totalSales)}
          </p>
          <p className="text-text-gray text-xs">تومان</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="totalSalesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-primary-400)"
                stopOpacity={0.35}
              />
              <stop
                offset="100%"
                stopColor="var(--color-primary-400)"
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient
              id="extrasSalesGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="var(--color-emerald-500)"
                stopOpacity={0.3}
              />
              <stop
                offset="100%"
                stopColor="var(--color-emerald-500)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            horizontal
            vertical={false}
            stroke="var(--color-border)"
          />

          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-text-gray)", fontSize: 11 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={42}
            tick={{ fill: "var(--color-text-gray)", fontSize: 11 }}
            tickFormatter={(v) => `${Math.round(Number(v) / 1_000_000)}م`}
          />

          <Tooltip
            cursor={{
              stroke: "var(--color-border-strong)",
              strokeDasharray: "4 4",
            }}
            contentStyle={{
              borderRadius: 10,
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              direction: "rtl",
            }}
            labelStyle={{ color: "var(--color-text)" }}
            formatter={(value) => [`${formatCurrency(Number(value))} تومان`]}
          />

          <Area
            dataKey="totalSales"
            type="monotone"
            stroke="var(--color-primary-400)"
            strokeWidth={2.5}
            fill="url(#totalSalesGradient)"
            name="کل فروش"
            dot={false}
            activeDot={{
              r: 6,
              fill: "var(--color-primary-400)",
              stroke: "var(--color-surface)",
              strokeWidth: 3,
            }}
          />
          <Area
            dataKey="extrasSales"
            type="monotone"
            stroke="var(--color-emerald-500)"
            strokeWidth={2}
            fill="url(#extrasSalesGradient)"
            name="فروش افزونه"
            dot={false}
            activeDot={{
              r: 5,
              fill: "var(--color-emerald-500)",
              stroke: "var(--color-surface)",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-6">
        <LegendItem color="var(--color-primary-400)" label="کل فروش" />
        <LegendItem color="var(--color-emerald-500)" label="فروش افزونه" />
      </div>
    </CardDashContainer>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-text text-sm">{label}</span>
    </div>
  );
}
