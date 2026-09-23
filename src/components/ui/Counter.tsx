"use client";

import type { ReactNode } from "react";
import { Minus, Plus } from "lucide-react";

type Props = {
  /** مقدار فعلی */
  value: number;
  onChange: (value: number) => void;
  /** حد پایین (پیش‌فرض ۰) */
  min?: number;
  /** حد بالا (پیش‌فرض ۱۰) */
  max?: number;
  /** گام تغییر (پیش‌فرض ۱) */
  step?: number;
  /** عنوان سمت راست */
  label?: string;
  /** توضیح زیر عنوان */
  hint?: string;
  /** آیکن کنار عنوان */
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
};

/**
 * شمارنده‌ی افزایشی/کاهشی قابل استفاده در هر جایی (مثل تعداد مهمان).
 * دکمه‌ها در دو سرِ حدِ مجاز غیرفعال می‌شوند.
 */
export default function Counter({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  label,
  hint,
  icon,
  disabled = false,
  className = "",
}: Props) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));
  const canDecrease = !disabled && value > min;
  const canIncrease = !disabled && value < max;

  const buttonClass =
    "grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-200 active:scale-90 disabled:pointer-events-none disabled:opacity-40";
  const idleButton =
    "border-foreground/15 text-text hover:border-primary-400 hover:bg-primary-400/10 hover:text-primary-500";

  return (
    <div
      className={`border-foreground/10 bg-surface flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 ${className}`}
    >
      {(label || hint || icon) && (
        <div className="flex min-w-0 items-center gap-3">
          {icon && (
            <span aria-hidden="true" className="text-primary-400 shrink-0">
              {icon}
            </span>
          )}
          <span className="min-w-0">
            {label && (
              <span className="text-text block truncate text-sm font-bold">
                {label}
              </span>
            )}
            {hint && (
              <span className="text-text-gray block truncate text-xs">
                {hint}
              </span>
            )}
          </span>
        </div>
      )}

      <div
        role="group"
        aria-label={label ?? "شمارنده"}
        className="flex shrink-0 items-center gap-3"
      >
        <button
          type="button"
          onClick={() => onChange(clamp(value - step))}
          disabled={!canDecrease}
          aria-label="کاهش"
          className={`${buttonClass} ${idleButton}`}
        >
          <Minus className="size-4" />
        </button>

        <span
          aria-live="polite"
          className="text-text grid min-w-8 place-items-center text-sm font-extrabold tabular-nums"
        >
          {value?.toLocaleString("fa-IR")}
        </span>

        <button
          type="button"
          onClick={() => onChange(clamp(value + step))}
          disabled={!canIncrease}
          aria-label="افزایش"
          className={`${buttonClass} ${idleButton}`}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
