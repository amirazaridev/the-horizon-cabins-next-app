import type { ReactNode } from "react";

interface LegendItemProps {
  color: string;
  label: string;
  /** نشانگر خط‌چین (برای سری مقایسه). */
  dashed?: boolean;
  /** نشانگر مربعی به‌جای دایره‌ای. */
  square?: boolean;
}

/**
 * آیتم راهنمای نمودارها — دایره/مربع/خط‌چین.
 *
 * ⭐ پیش‌تر در `RevenueTrendChart` (با `dashed`) و `OccupancyAdrChart`
 * (با `square`) دوبار پیاده شده بود؛ اکنون یک نسخه‌ی واحد است.
 */
export default function LegendItem({
  color,
  label,
  dashed,
  square,
}: LegendItemProps): ReactNode {
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
          className={`size-2.5 shrink-0 ${square ? "rounded-sm" : "rounded-full"}`}
          style={{ backgroundColor: color }}
        />
      )}
      <span className="text-text text-sm">{label}</span>
    </div>
  );
}
