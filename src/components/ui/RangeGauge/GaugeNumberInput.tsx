"use client";

import type { ChangeEvent, KeyboardEvent } from "react";

type Props = {
  /** متن کنار فیلد — «از» یا «تا». */
  label: string;
  ariaLabel: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

/**
 * ورودی عددی یک سر بازه.
 *
 * ⚠️ پیش از این همین بلوک ۱۳ خطی دو بار («از» و «تا») در `RangeGauge`
 * تکرار شده بود.
 */
export default function GaugeNumberInput({
  label,
  ariaLabel,
  value,
  onChange,
  onBlur,
  onKeyDown,
}: Props) {
  return (
    <label className="flex flex-1 items-center gap-2">
      <span className="text-text-gray text-xs">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        dir="ltr"
        aria-label={ariaLabel}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className="border-border bg-background focus:border-primary-400 w-full rounded-xl border px-3 py-2 text-center text-sm font-semibold focus:outline-none"
      />
    </label>
  );
}
