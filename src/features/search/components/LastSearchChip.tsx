"use client";

import { History, X } from "lucide-react";

import type { City } from "@/features/cabins/types/city.types";
import { useLastSearch } from "../hooks/useLastSearch";
import type { SearchController } from "../types/search.types";
import { hasAnySearchFilter } from "../utils/search-params";
import { buildSearchSummary } from "../utils/search-summary";

type Props = {
  cities: City[];
  controller: SearchController;
};

/**
 * چیپ «آخرین جستجو» زیر نوار جستجوی هیرو.
 *
 * فقط زمانی دیده می‌شود که جستجوی فعالی وجود نداشته باشد (بعد از ریلود
 * صفحه یا بعد از «حذف جستجو»). با کلیک روی آن، همان فیلترهای قبلی دوباره
 * اعمال می‌شوند و پیش‌نمایش باز می‌شود.
 */
export default function LastSearchChip({ cities, controller }: Props) {
  const { applied, setFilters, apply } = controller;
  const { lastSearch, dismiss } = useLastSearch();

  if (!lastSearch || hasAnySearchFilter(applied)) return null;

  const summary = buildSearchSummary({
    filters: lastSearch,
    cities,
    compact: true,
  });

  if (!summary) return null;

  return (
    <div className="flex max-w-full items-center gap-1 self-start rounded-full border border-white/15 bg-surface/80 py-1.5 ps-3.5 pe-1.5 shadow-lg shadow-black/15 backdrop-blur-md absolute -top-11.5">
      <button
        type="button"
        onClick={() => {
          setFilters(lastSearch);
          apply();
        }}
        title="اعمال آخرین جستجو"
        className="flex min-w-0 items-center gap-2 text-start"
      >
        <History className="text-primary-400 size-3.5 shrink-0" />
        <span className="text-text-gray shrink-0 text-xs font-medium">
          آخرین جستجو:
        </span>
        <span className="text-text truncate text-xs font-bold">{summary}</span>
      </button>

      <button
        type="button"
        onClick={dismiss}
        aria-label="حذف آخرین جستجو"
        className="text-text-gray hover:text-danger grid size-6 shrink-0 place-items-center rounded-full transition-colors"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
