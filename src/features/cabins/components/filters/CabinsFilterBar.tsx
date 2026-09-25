"use client";

import { Map as MapIcon } from "lucide-react";

import CabinsDesktopFilters from "./CabinsDesktopFilters";
import type { CabinFilterOptions } from "../../utils/cabin-filters";

type Props = {
  options: CabinFilterOptions;
  resultCount: number;
  mapVisible: boolean;
  onToggleMap: () => void;
};

/**
 * نوار فیلتر صفحه cabins.
 * ریسپانسیو داخل FilterCard مدیریت می‌شود:
 * دسکتاپ = popover روی هر دکمه، موبایل (زیر md) = تک‌دکمه «فیلترها» + شیت آکاردئونی.
 */
export default function CabinsFilterBar({
  options,
  resultCount,
  mapVisible,
  onToggleMap,
}: Props) {
  return (
    <div className="sticky top-18 z-50 w-full">
      <div className="border-foreground/10 bg-background/90 border-b backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1800px] items-center gap-2 px-3 py-2.5 sm:px-4 lg:px-6">
          <CabinsDesktopFilters
            options={options}
            resultCount={resultCount}
            className="flex"
          />

          <MapToggle visible={mapVisible} onToggle={onToggleMap} />
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
   MAP TOGGLE
   =============================================================== */

function MapToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={visible}
      aria-label={visible ? "مخفی کردن نقشه" : "نمایش نقشه"}
      onClick={onToggle}
      className="bg-surface/85 border-foreground/10 hidden shrink-0 items-center gap-2.5 rounded-2xl border px-3 py-2.5 shadow-sm backdrop-blur-md transition-all active:scale-95 sm:px-4 md:flex"
    >
      {/* Switch */}
      <span
        aria-hidden="true"
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
          visible ? "bg-primary-400" : "bg-foreground/15"
        } `}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all duration-200 ${
            visible ? "right-0.5" : "right-[22px]"
          } `}
        />
      </span>

      {/* Icon */}
      <MapIcon className="text-primary-400 size-4" />

      {/* Label */}
      <span className="text-text hidden text-sm font-bold whitespace-nowrap sm:inline">
        نمایش نقشه
      </span>
    </button>
  );
}
