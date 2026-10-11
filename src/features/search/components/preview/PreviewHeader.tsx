"use client";

import { X } from "lucide-react";

import Eyebrow from "@/components/ui/Eyebrow";

type Props = {
  title: string;
  subtitle?: string;
  //* پاک‌کردن کامل جستجو (draft + applied)
  onReset: () => void;
};

//* هدر بخش «پیش‌نمایش جستجو» — ابرو، تیتر، زیرعنوان و دکمه‌ی حذف جستجو.
export default function PreviewHeader({ title, subtitle, onReset }: Props) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <Eyebrow className="text-text-gray mb-2">نتیجه‌ی جستجوی شما</Eyebrow>
        <h2 className="text-text text-xl font-extrabold tracking-tight sm:text-2xl md:text-[30px]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-text-gray mt-2 text-xs leading-6 sm:text-sm">
            {subtitle}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="text-text-gray hover:text-danger hover:bg-danger/10 flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition-colors"
      >
        <X className="size-4" />
        حذف جستجو
      </button>
    </header>
  );
}
