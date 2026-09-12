import type { ReactElement } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import CardDashContainer from "../../../components/CardDashContainer";

const COLORS = {
  indigo: {
    tile: "bg-[linear-gradient(135deg,#818cf8,#6366f1)]",
    glow: "bg-indigo-500/10",
  },
  emerald: {
    tile: "bg-[linear-gradient(135deg,#34d399,#059669)]",
    glow: "bg-emerald-500/10",
  },
  sky: {
    tile: "bg-[linear-gradient(135deg,#38bdf8,#0284c7)]",
    glow: "bg-sky-500/10",
  },
  amber: {
    tile: "bg-[linear-gradient(135deg,#fbbf24,#d97706)]",
    glow: "bg-amber-500/10",
  },
} as const;

interface StatProps {
  title: string;
  value: string;
  delta?: number | null;
  icon: ReactElement;
  color: keyof typeof COLORS;
}

export default function Stat({ title, value, delta, icon, color }: StatProps) {
  const isPositive = (delta ?? 0) >= 0;

  return (
    <CardDashContainer className="relative overflow-hidden p-5">
      {/* هاله رنگی گوشه کارت */}
      <div
        className={`${COLORS[color].glow} pointer-events-none absolute -top-10 -left-10 size-35 rounded-full blur-2xl`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-text-muted text-sm">{title}</span>
          <span className="text-text text-2xl font-extrabold tracking-tight">
            {value}
          </span>
          {delta !== null && delta !== undefined && (
            <span
              className={`flex items-center gap-1 text-xs font-semibold ${
                isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownLeft className="size-3.5" />
              )}
              {Math.abs(delta)}٪
              <span className="text-text-gray font-normal">نسبت به دوره قبل</span>
            </span>
          )}
        </div>

        <div
          className={`${COLORS[color].tile} grid size-11.5 shrink-0 place-items-center rounded-xl text-white shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </CardDashContainer>
  );
}