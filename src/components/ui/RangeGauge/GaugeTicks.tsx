"use client";

import type { GaugeTick } from "./types";

type Props = {
  ticks: GaugeTick[];
  /** طول بازه — مبنای تبدیل موقعیت به درصد. */
  span: number;
};

/**
 * تیک‌های راهنمای زیر ترک.
 *
 * ⚠️ مبدأ ترک سمت راست است (RTL)، پس موقعیت با `right` تنظیم می‌شود تا
 * تیک‌ها با دستگیره‌ها هم‌راستا شوند.
 */
export default function GaugeTicks({ ticks, span }: Props) {
  if (!ticks.length || span <= 0) return null;

  return (
    <div dir="rtl" className="relative mt-2 h-7">
      {ticks.map((tick) => {
        const percent = (tick.position / span) * 100;

        return (
          <div
            key={tick.key}
            className="absolute top-0 translate-x-1/2"
            style={{ right: `${percent}%` }}
          >
            <span className="bg-border-strong block h-1.5 w-px" />
            <span className="text-text-gray mt-1.5 block text-xs whitespace-nowrap">
              {tick.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
