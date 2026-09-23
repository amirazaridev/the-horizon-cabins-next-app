"use client";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "@/contexts/ThemeContext";
import CardDashContainer from "../../../shared/components/CardDashContainer";

interface DurationDatum {
  duration: string;
  value: number;
  color: string;
}

interface Stay {
  numNights: number;
}

interface DurationChartProps {
  confirmedStays?: Stay[];
}

const startDataLight: DurationDatum[] = [
  { duration: "۱ شب", value: 0, color: "#ef4444" },
  { duration: "۲ شب", value: 0, color: "#f97316" },
  { duration: "۳ شب", value: 0, color: "#eab308" },
  { duration: "۴ تا ۵ شب", value: 0, color: "#84cc16" },
  { duration: "۶ تا ۷ شب", value: 0, color: "#22c55e" },
  { duration: "۸ تا ۱۴ شب", value: 0, color: "#14b8a6" },
  { duration: "۱۵ تا ۲۱ شب", value: 0, color: "#3b82f6" },
  { duration: "۲۱+ شب", value: 0, color: "#a855f7" },
];

const startDataDark: DurationDatum[] = [
  { duration: "۱ شب", value: 0, color: "#b91c1c" },
  { duration: "۲ شب", value: 0, color: "#c2410c" },
  { duration: "۳ شب", value: 0, color: "#a16207" },
  { duration: "۴ تا ۵ شب", value: 0, color: "#4d7c0f" },
  { duration: "۶ تا ۷ شب", value: 0, color: "#15803d" },
  { duration: "۸ تا ۱۴ شب", value: 0, color: "#0f766e" },
  { duration: "۱۵ تا ۲۱ شب", value: 0, color: "#1d4ed8" },
  { duration: "۲۱+ شب", value: 0, color: "#7e22ce" },
];

function incArrayValue(arr: DurationDatum[], field: string): DurationDatum[] {
  return arr.map((obj) =>
    obj.duration === field ? { ...obj, value: obj.value + 1 } : obj,
  );
}

function prepareData(
  startData: DurationDatum[],
  stays: Stay[],
): DurationDatum[] {
  const data = stays
    .reduce((arr, cur) => {
      const num = cur.numNights;
      if (num === 1) return incArrayValue(arr, "۱ شب");
      if (num === 2) return incArrayValue(arr, "۲ شب");
      if (num === 3) return incArrayValue(arr, "۳ شب");
      if ([4, 5].includes(num)) return incArrayValue(arr, "۴ تا ۵ شب");
      if ([6, 7].includes(num)) return incArrayValue(arr, "۶ تا ۷ شب");
      if (num >= 8 && num <= 14) return incArrayValue(arr, "۸ تا ۱۴ شب");
      if (num >= 15 && num <= 21) return incArrayValue(arr, "۱۵ تا ۲۱ شب");
      if (num > 21) return incArrayValue(arr, "۲۱+ شب");
      return arr;
    }, startData)
    .filter((obj) => obj.value > 0);

  return data;
}

function DurationChart({ confirmedStays = [] }: DurationChartProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const data = prepareData(
    isDarkMode ? startDataDark : startDataLight,
    confirmedStays,
  );

  const total = confirmedStays.length || 1;

  const translatedData = data.map((item) => ({
    ...item,
    percent: `${Math.round((item.value / total) * 100)}`,
  }));

  const averageNights = confirmedStays.length
    ? confirmedStays.reduce((sum, s) => sum + s.numNights, 0) /
      confirmedStays.length
    : 0;

  const formattedAverage = averageNights.toLocaleString("fa-IR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <CardDashContainer className="flex max-h-110 w-full flex-col gap-y-4 p-5">
      {/* Header */}
      <div className="font-semibold">
        <h3>خلاصه مدت اقامت</h3>
      </div>

      <div className="relative">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={translatedData}
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
              {translatedData.map((el) => (
                <Cell fill={el.color} key={el.duration} />
              ))}
            </Pie>
            <Tooltip
              wrapperStyle={{ zIndex: 50 }}
              formatter={(value, name, props) => [
                `${props.payload.percent}%`,
                name,
              ]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid var(--color-background-2)",
                background: "var(--color-background)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-text text-2xl font-bold">
            {formattedAverage}
          </span>
          <span className="text-text-muted text-xs">میانگین شب</span>
        </div>
      </div>

      <div className="flex flex-col gap-y-3">
        {translatedData.map((item) => (
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
            <span className="text-text text-sm font-semibold">
              {item.percent}%
            </span>
          </div>
        ))}
      </div>
    </CardDashContainer>
  );
}

export default DurationChart;
