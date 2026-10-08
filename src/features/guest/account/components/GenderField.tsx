"use client";

import type { ReactNode } from "react";
import { useController, type Control } from "react-hook-form";

import { FOCUS_RING } from "@/components/ui/Filter/focus-ring";
import { GENDER_OPTIONS, type AccountFormValues } from "../schemas/account.schema";

type Props = {
  control: Control<AccountFormValues>;
  name: "gender";
  label: string;
  className?: string;
};

/**
 * انتخاب جنسیت به‌شکل «کنترل قطعه‌ای» (segmented control).
 *
 * ⚠️ چرا به‌جای `<select>`؟ چون فقط دو گزینه دارد و نمایش هم‌زمان آن‌ها یک
 * کلیک (باز‌کردن لیست) را حذف می‌کند؛ همچنین قاب بیرونی عیناً هم‌شکل `Input`
 * طراحی شده (برچسب بالا، ارتفاع ~۵۰px) تا در گرید فرم یکدست بنشیند.
 *
 * ⚠️ اگر مقدار فیلد `""` باشد (هیچ جنسیتی ثبت نشده) هیچ دکمه‌ای active
 * نمی‌شود؛ گزینه‌ی «نامشخص» عمداً وجود ندارد.
 *
 * ⚠️ از `aria-pressed` روی دکمه‌های گروه استفاده می‌شود (نه نقش radio) تا
 * بدون پیاده‌سازی ناوبری کلیدیِ الگوی radio، رفتار صفحه‌خوان درست بماند.
 */
export default function GenderField({ control, name, label, className = "" }: Props): ReactNode {
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <div className={className}>
      <div
        className={`rounded-xl border bg-transparent px-2 pt-1 pb-1.5 transition-all duration-300 ${
          error
            ? "border-danger-strong/60 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
            : "border-foreground/10 hover:border-foreground/20 focus-within:border-primary-400/60"
        }`}
      >
        <span
          className={`mb-1 block px-1.5 text-[10px] leading-none font-medium ${
            error ? "text-danger/70" : "text-text/30"
          }`}
        >
          {label}
        </span>

        <div ref={ref} role="group" aria-label={label} className="flex gap-1">
          {GENDER_OPTIONS.map((option) => {
            const isActive = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => onChange(option.value)}
                onBlur={onBlur}
                className={`${FOCUS_RING} flex-1 cursor-pointer rounded-lg px-2 py-1.5 text-xs leading-none font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-primary-400 shadow-primary-400/25 text-black shadow-md"
                    : "text-text-gray hover:bg-foreground/5 hover:text-text"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="text-danger mt-2 flex items-start gap-1.5 text-xs leading-relaxed"
        >
          <span className="bg-danger mt-1.5 inline-block size-1 shrink-0 rounded-full" />
          {error.message}
        </p>
      ) : null}
    </div>
  );
}
