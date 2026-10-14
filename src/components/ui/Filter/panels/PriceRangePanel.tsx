"use client";

import { useRef } from "react";

import RangeGauge, {
  type GaugeRange,
  type RangeGaugeApi,
} from "@/components/ui/RangeGauge";
import { formatPriceShort } from "@/libs/utils/format";

/** محدوده‌ی مشترک اسلایدر قیمت/بودجه (تومان) */
export const PRICE_RANGE_MIN = 1_000_000;
export const PRICE_RANGE_MAX = 30_000_000;
export const PRICE_RANGE_STEP = 100_000;

export type PriceRangeValue = {
  min: number;
  max: number;
};

type Props = {
  /** بازه‌ی فعلی؛ `null` یعنی بدون محدودیت (بازه‌ی کامل) */
  value: PriceRangeValue | null;
  onChange: (value: PriceRangeValue | null) => void;
  /** بعد از اعمال یا حذف صدا زده می‌شود (معمولاً برای بستن پنل) */
  onDone?: () => void;
  onApply?: (value: PriceRangeValue | null) => void;
  commitFullRange?: boolean;
  /** توضیح بالای اسلایدر */
  hint?: string;
  applyLabel?: string;
  clearLabel?: string;
  min?: number;
  max?: number;
  step?: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function PriceRangePanel({
  value,
  onChange,
  onDone,
  onApply,
  commitFullRange = false,
  hint,
  applyLabel = "اعمال",
  clearLabel = "حذف فیلتر",
  min = PRICE_RANGE_MIN,
  max = PRICE_RANGE_MAX,
  step = PRICE_RANGE_STEP,
}: Props) {
  const gaugeRef = useRef<RangeGaugeApi | null>(null);
  const isFiltered = value !== null;

  const gaugeValue: GaugeRange | null = value
    ? {
        start: clamp(value.min, min, max),
        end: clamp(value.max, min, max),
      }
    : null;

  const commit = (next: GaugeRange) => {
    const isFullRange = next.start <= min && next.end >= max;

    const normalized: PriceRangeValue | null =
      isFullRange && !commitFullRange
        ? null
        : {
            min: next.start <= min ? min : next.start,
            max: next.end >= max ? max : next.end,
          };

    onChange(normalized);
    onDone?.();
    onApply?.(normalized);
  };

  return (
    <div className="space-y-4">
      {hint && <p className="text-text-gray text-xs leading-6">{hint}</p>}

      <RangeGauge
        minValue={min}
        maxValue={max}
        value={gaugeValue}
        step={step}
        formatValue={formatPriceShort}
        startAriaLabel="حداقل قیمت هر شب"
        endAriaLabel="حداکثر قیمت هر شب"
        // اعمال فقط با دکمه انجام می‌شود، نه با رها کردن موس
        commitOn="apply"
        onCommit={commit}
        onReady={(api) => {
          gaugeRef.current = api;
        }}
        showInputs
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => gaugeRef.current?.submit()}
          className="bg-primary-400 text-text hover:bg-primary-500 flex-1 rounded-xl py-2.5 text-sm font-bold transition-colors active:scale-[0.98]"
        >
          {applyLabel}
        </button>

        {isFiltered && (
          <button
            type="button"
            onClick={() => {
              gaugeRef.current?.reset();
              onChange(null);
              onDone?.();
            }}
            className="border-border text-text-gray hover:text-text flex-1 rounded-xl border py-2.5 text-sm font-bold transition-colors"
          >
            {clearLabel}
          </button>
        )}
      </div>
    </div>
  );
}
