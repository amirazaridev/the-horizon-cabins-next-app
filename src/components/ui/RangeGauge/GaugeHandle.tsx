"use client";

import type { CSSProperties, KeyboardEvent } from "react";

type Props = {
  handle: "start" | "end";
  value: number;
  /** موقعیت افقی دستگیره (چون ترک RTL است، با `right` تنظیم می‌شود). */
  offset: CSSProperties;
  min: number;
  max: number;
  ariaLabel: string;
  formatValue: (value: number) => string;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
};

/**
 * دستگیرهٔ اسلایدر (کمینه یا بیشینه).
 *
 * ⚠️ پیش از این همین بلوک ۱۸ خطی دو بار (برای `start` و `end`) در
 * `RangeGauge` کپی شده بود و فقط در `data-gauge-handle`، برچسب‌های
 * دسترس‌پذیری، `style` و `z-index` تفاوت داشتند.
 */
export default function GaugeHandle({
  handle,
  value,
  offset,
  min,
  max,
  ariaLabel,
  formatValue,
  onKeyDown,
}: Props) {
  return (
    <div
      role="slider"
      tabIndex={0}
      data-gauge-handle={handle}
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={formatValue(value)}
      onKeyDown={onKeyDown}
      className={`border-primary-500 bg-surface focus:ring-primary-400/30 absolute top-1/2 size-5 -translate-y-1/2 translate-x-1/2 rounded-full border-2 shadow-md transition-shadow focus:ring-4 focus:outline-none ${
        handle === "start" ? "z-20" : "z-30"
      }`}
      style={offset}
    >
      <span className="bg-primary-400 absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
    </div>
  );
}
