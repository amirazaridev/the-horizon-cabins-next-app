"use client";

import { Loader2, SearchIcon } from "lucide-react";

type Props = {
  label: string;
  disabled?: boolean;
  /** در حال اعمال جستجو (ناوبری/درخواست) */
  pending?: boolean;
  disabledHint?: string;
  onClick: () => void;
  className?: string;
};

/**
 * دکمه‌ی نهایی سرچ (دسکتاپ).
 * قبلاً یک `Link` بود؛ حالا اکشن است چون «اعمال» در لندینگ باعث ناوبری
 * نمی‌شود و فقط پیش‌نمایش را فعال می‌کند.
 *
 * در حالت pending محتوا `invisible` می‌شود و spinner روی همان مرکز
 * می‌نشیند تا **عرض دکمه تغییر نکند** (جلوگیری از پرش چیدمان).
 */
export default function SearchAction({
  label,
  disabled = false,
  pending = false,
  disabledHint = "برای جستجو، حداقل یک مورد را انتخاب کنید",
  onClick,
  className = "",
}: Props) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || pending}
        aria-busy={pending}
        title={disabled ? disabledHint : undefined}
        className={`bg-primary-400 hover:bg-primary-500 focus-visible:ring-primary-400 focus-visible:ring-offset-background relative flex h-12 shrink-0 items-center justify-center rounded-xl px-6 text-sm font-bold text-black transition-all duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-primary-400 md:mx-1 ${className}`}
      >
        <span
          className={`flex items-center justify-center gap-2 ${pending ? "invisible" : ""}`}
        >
          {label}
          <SearchIcon size={18} />
        </span>

        {pending && (
          <span className="absolute inset-0 grid place-items-center">
            <Loader2
              aria-hidden="true"
              className="size-5 animate-spin motion-reduce:animate-none"
            />
          </span>
        )}
      </button>

      {/* اعلام وضعیت برای screen reader */}
      <span aria-live="polite" className="sr-only">
        {pending ? "در حال جستجو…" : ""}
      </span>
    </>
  );
}
