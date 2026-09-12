"use client"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { eachDayOfInterval, format, subDays } from "date-fns-jalali";
import { isSameDay } from "date-fns";

function SalesChart({ bookings, numDays }: any) {
  const allDays = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date(),
  });

  const data = allDays.map((date) => ({
    label: format(date, "MMMM dd"),
    totalSales: bookings
      .filter((booking) => isSameDay(date, new Date(booking.createdAt)))
      .reduce((acc, cur) => acc + cur.totalPrice, 0),
    extrasSales: bookings
      .filter((booking) => isSameDay(date, new Date(booking.createdAt)))
      .reduce((acc, cur) => acc + cur.extrasPrice, 0),
  }));

  return (
    <div className="bg-background-2 border-border shadow-shadow-soft hover:border-border-strong mt-6 flex w-full flex-col gap-y-5 rounded-2xl border p-5 transition-[transform,border-color] duration-200 hover:-translate-y-0.75">
      {/* Header */}
      <div className="">
        <h3>نمای کلی فروش</h3>
        {/* <p className="text-text-gray text-sm">
          
        </p> */}
      </div>

      <ResponsiveContainer height={300} width="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="totalSalesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-indigo-500)"
                stopOpacity={0.35}
              />
              <stop
                offset="100%"
                stopColor="var(--color-indigo-500)"
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
                stopColor="var(--color-green-500)"
                stopOpacity={0.35}
              />
              <stop
                offset="100%"
                stopColor="var(--color-green-500)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            horizontal={true}
            vertical={false}
            stroke="var(--color-border)"
          />

          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-text-gray)", fontSize: 12 }}
            dy={10}
          />

          <Tooltip
            cursor={{
              stroke: "var(--color-border-strong)",
              strokeDasharray: "4 4",
            }}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid var(--color-border)",
              background: "var(--color-background-2)",
            }}
            labelStyle={{ color: "var(--color-text)" }}
            formatter={(value, name) => [value, name]}
          />

          <Area
            dataKey="totalSales"
            type="monotone"
            stroke="var(--color-indigo-500)"
            strokeWidth={2.5}
            fill="url(#totalSalesGradient)"
            name={"کل فروش"}
            dot={{ r: 3, strokeWidth: 0, fill: "var(--color-indigo-500)" }}
            activeDot={{
              r: 6,
              fill: "var(--color-indigo-500)",
              stroke: "var(--color-background-2)",
              strokeWidth: 3,
            }}
          />
          <Area
            dataKey="extrasSales"
            type="monotone"
            stroke="var(--color-green-500)"
            strokeWidth={2.5}
            fill="url(#extrasSalesGradient)"
            name="فروش افزونه"
            dot={false}
            activeDot={{
              r: 5,
              fill: "var(--color-green-500)",
              stroke: "var(--color-background-2)",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend سفارشی */}
      <div className="flex items-center justify-center gap-x-6">
        <LegendItem color="var(--color-indigo-500)" label="کل فروش" />
        <LegendItem color="var(--color-green-500)" label="فروش افزونه" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
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

export default SalesChart;
