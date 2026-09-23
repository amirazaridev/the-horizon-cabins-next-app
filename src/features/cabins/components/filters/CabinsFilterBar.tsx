"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Map as MapIcon,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";

import FilterButton from "./FilterButton";
import DatePanel from "./panels/DatePanel";
import GuestsPanel from "./panels/GuestsPanel";
import MoreFiltersSheet from "./MoreFiltersSheet";
import CabinsDesktopFilters from "./CabinsDesktopFilters";
import { useCabinQuery } from "./useCabinQuery";

import { formatDateRangeLabel } from "../../lib/cabin-date";
import type { CabinFilterOptions } from "../../lib/cabin-filters";

type MobilePanelId = "date" | "guests";

const PANEL_TITLES: Record<MobilePanelId, string> = {
  date: "تاریخ سفر",
  guests: "تعداد نفرات",
};

const fa = (n: number | string) => Number(n).toLocaleString("fa-IR");

type Props = {
  options: CabinFilterOptions;
  resultCount: number;
  mapVisible: boolean;
  onToggleMap: () => void;
};

/**
 * Filter bar صفحه cabins
 *
 * Desktop (lg به بالا):
 * - فیلترها با FilterCard عمومی (پاپ‌اور شناور نزدیک دکمه)
 * - منطق در CabinsDesktopFilters — controlled از URL
 *
 * Mobile / Tablet (زیر lg):
 * - همان bottom-sheet قبلی + شیت «سایر فیلترها»
 * - پنل‌ها مستقیم با useCabinQuery به URL وصل‌اند
 *
 * لی‌آوت sticky و MapToggle مشترک و دست‌نخورده مانده‌اند.
 */
export default function CabinsFilterBar({
  options,
  resultCount,
  mapVisible,
  onToggleMap,
}: Props) {
  const { searchParams } = useCabinQuery();

  const [openPanel, setOpenPanel] = useState<MobilePanelId | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  const closePanel = () => {
    setOpenPanel(null);
  };

  const togglePanel = (id: MobilePanelId) => {
    setOpenPanel((prev) => (prev === id ? null : id));
  };

  /**
   * Escape برای بستن پنل
   * در موبایل body scroll قفل می‌شود.
   */
  useEffect(() => {
    if (!openPanel && !moreOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePanel();
        setMoreOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);

    const isMobile = window.matchMedia("(max-width: 1023.5px)").matches;

    const previousOverflow = document.body.style.overflow;

    if (isMobile && (openPanel || moreOpen)) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [openPanel, moreOpen]);

  /**
   * URL Filters (برای دکمه‌های موبایل)
   */
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");

  const amenities =
    searchParams
      .get("amenities")
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  const price = searchParams.get("price");
  const city = searchParams.get("city");
  const bedrooms = searchParams.get("bedrooms");

  const dateSummary = formatDateRangeLabel(checkIn, checkOut);
  const dateActive = checkIn !== null || checkOut !== null;

  /**
   * تعداد فیلترهای فعال (برای بج «سایر فیلترها»)
   */
  const activeCount = [guests, bedrooms, amenities.length, price, city].filter(
    Boolean,
  ).length;

  return (
    <div className="sticky top-18 z-50 w-full">
      <div className="border-foreground/10 bg-background/90 border-b backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1800px] items-center gap-2 px-3 py-2.5 sm:px-4 lg:px-6">
          {/* =====================================================
              MOBILE FILTER BUTTONS (bottom-sheet)
              ===================================================== */}
          <div className="bg-surface/80 border-foreground/10 flex min-w-0 flex-1 scrollbar-none items-center gap-2 overflow-x-auto rounded-2xl border p-1.5 shadow-sm backdrop-blur-md lg:hidden [&::-webkit-scrollbar]:hidden">
            {/* تاریخ */}
            <FilterButton
              label="تاریخ سفر"
              summary={dateSummary}
              active={dateActive}
              open={openPanel === "date"}
              onClick={() => togglePanel("date")}
              icon={<CalendarDays className="text-primary-400 size-4" />}
            />

            {/* نفرات */}
            <FilterButton
              label="تعداد نفرات"
              summary={guests ? `${fa(guests)} نفر` : undefined}
              active={guests !== null}
              open={openPanel === "guests"}
              onClick={() => togglePanel("guests")}
              icon={<Users className="text-primary-400 size-4" />}
            />

            {/* سایر فیلترها */}
            <FilterButton
              label="سایر فیلترها"
              badge={activeCount}
              open={moreOpen}
              onClick={() => {
                setOpenPanel(null);
                setMoreOpen(true);
              }}
              icon={<SlidersHorizontal className="text-primary-400 size-4" />}
            />
          </div>

          {/* =====================================================
              DESKTOP FILTERS (FilterCard) — فقط lg به بالا
              ===================================================== */}
          <CabinsDesktopFilters options={options} className="hidden lg:flex" />

          {/* =====================================================
              MAP TOGGLE
              ===================================================== */}
          <MapToggle visible={mapVisible} onToggle={onToggleMap} />
        </div>
      </div>

      {/* =========================================================
          MOBILE FILTER PANEL (bottom-sheet) — فقط زیر lg
          ========================================================= */}
      {openPanel && (
        <>
          {/* Overlay */}
          <div
            aria-hidden="true"
            onClick={closePanel}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
          />

          {/* Panel */}
          <div
            role="dialog"
            aria-label={PANEL_TITLES[openPanel]}
            className="bg-surface fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-3xl p-5 shadow-2xl lg:hidden"
          >
            {/* Mobile drag indicator */}
            <div
              aria-hidden="true"
              className="bg-foreground/15 mx-auto mb-3 h-1.5 w-12 rounded-full"
            />

            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-text text-base font-extrabold">
                {PANEL_TITLES[openPanel]}
              </p>

              <button
                type="button"
                onClick={closePanel}
                aria-label="بستن پنل"
                className="text-text hover:bg-foreground/5 flex size-9 items-center justify-center rounded-full transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* ===================================================
                PANEL CONTENT
                =================================================== */}

            {openPanel === "date" && <DatePanel onDone={closePanel} />}

            {openPanel === "guests" && <GuestsPanel />}

            {/* Mobile Apply Button */}
            <button
              type="button"
              onClick={closePanel}
              className="bg-primary-400 mt-4 w-full rounded-xl py-3 text-sm font-bold text-black transition-transform active:scale-95"
            >
              مشاهده {resultCount.toLocaleString("fa-IR")} نتیجه
            </button>
          </div>
        </>
      )}

      {/* =========================================================
          MORE FILTERS SHEET
          ========================================================= */}
      <MoreFiltersSheet
        options={options}
        resultCount={resultCount}
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
      />
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
