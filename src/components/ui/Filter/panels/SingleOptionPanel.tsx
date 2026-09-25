"use client";

import type { ReactNode } from "react";
import OptionRow from "../OptionRow";

export type SingleOptionItem = {
  value: string;
  label: string;
  hint?: string;
  icon?: ReactNode;
};

type Props = {
  options: SingleOptionItem[];
  value: string | null;
  onChange: (next: string | null) => void;
  /** سطر اول با مقدار null (مثلاً «هر تعداد» / «پیش‌فرض») */
  allOption?: { label: string; hint?: string; icon?: ReactNode };
  emptyMessage?: string;
  className?: string;
};

/**
 * پنل انتخاب تکی از بین یک لیست گزینه — reusable برای
 * نفرات، خواب، بازه قیمت، مرتب‌سازی و موارد مشابه.
 */
export default function SingleOptionPanel({
  options,
  value,
  onChange,
  allOption,
  emptyMessage = "گزینه‌ای برای نمایش وجود ندارد.",
  className = "",
}: Props) {
  if (!options.length && !allOption) {
    return (
      <p className="text-text-gray py-4 text-center text-sm">{emptyMessage}</p>
    );
  }

  return (
    <div
      className={`flex max-h-72 flex-col gap-2 overflow-y-auto ps-0.5 ${className}`}
    >
      {allOption && (
        <OptionRow
          label={allOption.label}
          hint={allOption.hint}
          icon={allOption.icon}
          selected={value === null}
          onSelect={() => onChange(null)}
        />
      )}
      {options.map((option) => (
        <OptionRow
          key={option.value}
          label={option.label}
          hint={option.hint}
          icon={option.icon}
          selected={value === option.value}
          onSelect={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}
