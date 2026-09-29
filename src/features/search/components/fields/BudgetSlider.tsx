"use client";

import { useId } from "react";

type Props = {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
  ariaLabel: string;
};

/**
 * اسلایدر تک‌دستگیره‌ی «حداکثر بودجه».
 *
 * عمداً از `<input type="range">` بومی استفاده می‌کند (بدون هیچ کتابخانه):
 *  - دسترس‌پذیری و ناوبری با کلید به‌صورت رایگان درست کار می‌کند،
 *  - `dir="rtl"` باعث می‌شود پر شدن از سمت راست انجام شود،
 *  - هیچ تغییری روی `RangeGauge` مشترک (که اسلایدر «بازه» است) لازم نشد.
 *
 * این کامپوننت فقط UI است؛ draft/apply را والد مدیریت می‌کند.
 */
export default function BudgetSlider({
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  ariaLabel,
}: Props) {
  const id = useId();
  const span = Math.max(max - min, 1);
  const percent = ((value - min) / span) * 100;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-text-gray text-xs font-medium"
        >
          سقف بودجه‌ی هر شب
        </label>
        <span
          aria-live="polite"
          className="text-text text-sm font-extrabold tabular-nums"
        >
          {formatValue(value)}
        </span>
      </div>

      <div className="relative flex h-11 items-center" dir="rtl">
        <span
          aria-hidden="true"
          className="bg-foreground/10 absolute inset-x-0 h-2 rounded-full"
        />
        <span
          aria-hidden="true"
          className="bg-primary-400 absolute h-2 rounded-full transition-[width] duration-75"
          style={{ right: 0, width: `${percent}%` }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={ariaLabel}
          aria-valuetext={formatValue(value)}
          onChange={(event) => onChange(Number(event.target.value))}
          className="relative z-10 h-11 w-full cursor-pointer appearance-none rounded-full bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40 [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-500 [&::-moz-range-thumb]:bg-surface [&::-moz-range-thumb]:shadow-md [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:bg-surface [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>

      <div className="text-text-gray flex items-center justify-between text-[10px]">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}
