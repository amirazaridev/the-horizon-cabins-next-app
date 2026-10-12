"use client";

import { PencilLine, Search as SearchIcon } from "lucide-react";

import {
  MOBILE_SEARCH_CHANGE_LABEL,
  MOBILE_SEARCH_RESULTS_LABEL,
  MOBILE_SEARCH_TITLE,
} from "@/features/search/constants/search-mobile-texts";

type Props = {
  isHero: boolean;
  //* خلاصه‌ی خام (بدون متن جانشین) — برای تفکیک رنگ وقتی خالی است
  summaryRaw: string;
  //* خلاصه‌ی نهایی (با متن جانشین در صورت خالی بودن)
  summary: string;
};

//* تریگر موبایل نوار جستجو. دو نما: لندینگ (پرسش «مقصد، بودجه و تاریخ سفرت رو بگو» + خلاصه‌ی فیلترها + ذره‌بین) و `/cabins` (برچسب «جستجوی شما» + خلاصه + دکمه‌ی صریح «تغییر جستجو»).
//* `w-full` روی ریشه‌ی هر دو شاخه تضمین می‌کند دکمه تا لبه‌ی کانتینر والد (خودِ `Search`) کشیده شود.
export default function SearchMobileTrigger({
  isHero,
  summaryRaw,
  summary,
}: Props) {
  if (isHero) {
    return (
      <span className="flex w-full min-w-80 items-center gap-3 py-2 ps-4.5 pe-2">
        <span className="flex min-w-0 flex-1 flex-col gap-1 text-start">
          <span className="text-text truncate text-[15px] leading-6 font-extrabold">
            {MOBILE_SEARCH_TITLE}
          </span>
          <span
            className={`truncate text-[13px] leading-5 font-medium ${
              summaryRaw ? "text-text-gray" : "text-text-gray/80"
            }`}
          >
            {summary}
          </span>
        </span>
        <span className="bg-primary-400 grid size-12 shrink-0 place-items-center rounded-full text-black shadow-md shadow-black/20">
          <SearchIcon className="size-5.5" />
        </span>
      </span>
    );
  }

  return (
    <span className="flex w-full min-w-0 items-center gap-3 py-2 ps-4 pe-2">
      <span className="flex min-w-0 flex-1 flex-col gap-1 text-start">
        <span className="text-text-gray truncate text-[11px] leading-4 font-semibold">
          {MOBILE_SEARCH_RESULTS_LABEL}
        </span>
        <span className="text-text truncate text-[13px] leading-5 font-bold">
          {summary}
        </span>
      </span>
      <span className="border-primary-400/40 bg-primary-400/10 text-text flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold whitespace-nowrap">
        {MOBILE_SEARCH_CHANGE_LABEL}
        <PencilLine className="size-3.5" />
      </span>
    </span>
  );
}
