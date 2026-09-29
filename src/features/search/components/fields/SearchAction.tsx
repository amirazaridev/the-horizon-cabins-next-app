"use client";

import { SearchIcon } from "lucide-react";

type Props = {
  label: string;
  disabled?: boolean;
  disabledHint?: string;
  onClick: () => void;
  className?: string;
};

/**
 * دکمه‌ی نهایی سرچ (دسکتاپ).
 * قبلاً یک `Link` بود؛ حالا اکشن است چون «اعمال» در لندینگ باعث ناوبری
 * نمی‌شود و فقط پیش‌نمایش را فعال می‌کند.
 */
export default function SearchAction({
  label,
  disabled = false,
  disabledHint = "برای جستجو، حداقل یک مورد را انتخاب کنید",
  onClick,
  className = "",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={disabled ? disabledHint : undefined}
      className={`bg-primary-400 hover:bg-primary-500 flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold text-black transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-primary-400 md:mx-1 ${className}`}
    >
      {label}
      <SearchIcon size={18} />
    </button>
  );
}
