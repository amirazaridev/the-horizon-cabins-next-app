"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { buildPreviewCtaLabel } from "@/features/search/utils/search-summary";

type Props = {
  //* تعداد کل نتایج (از متای پاسخ API، نه تعداد کارت‌های نمایش‌داده‌شده)
  total: number;
  //* مقصد دکمه — `/cabins` همراه با همان فیلترهای اعمال‌شده
  href: string;
};

//* پاورقی پیش‌نمایش — تعداد نتایج + CTA به صفحه‌ی کامل نتایج.
export default function PreviewCta({ total, href }: Props) {
  return (
    <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
      <span className="text-text-gray text-xs">
        {total.toLocaleString("fa-IR")} اقامتگاه پیدا شد
      </span>
      <Link
        href={href}
        className="bg-primary-400 hover:bg-primary-500 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-black transition-colors"
      >
        {buildPreviewCtaLabel(total)}
        <ArrowLeft className="size-4" />
      </Link>
    </div>
  );
}
