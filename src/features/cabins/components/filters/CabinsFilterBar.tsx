"use client";

import { useEffect, useState } from "react";
import {
  BedDouble,
  CalendarDays,
  Map as MapIcon,
  MapPin,
  SlidersHorizontal,
  Sparkles,
  Users,
  Wallet,
  X,
} from "lucide-react";

import FilterButton from "./FilterButton";
import DatePanel from "./panels/DatePanel";
import GuestsPanel from "./panels/GuestsPanel";
import BedroomsPanel from "./panels/BedroomsPanel";
import AmenitiesPanel from "./panels/AmenitiesPanel";
import PricePanel from "./panels/PricePanel";
import CityPanel from "./panels/CityPanel";
import MoreFiltersSheet from "./MoreFiltersSheet";
import { useCabinQuery } from "./useCabinQuery";

import {
  formatPriceShort,
  type CabinFilterOptions,
} from "../../lib/cabin-filters";

type PanelId = "date" | "guests" | "bedrooms" | "amenities" | "price" | "city";

const PANEL_TITLES: Record<PanelId, string> = {
  date: "تاریخ سفر",
  guests: "تعداد نفرات",
  bedrooms: "تعداد خواب",
  amenities: "امکانات اقامتگاه",
  price: "بازه قیمت هر شب",
  city: "شهر / مقصد",
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
 * Desktop:
 * - sticky دقیقاً زیر navbar
 * - فیلترها به صورت horizontal scroll در صورت کمبود فضا
 * - نمایش نقشه در سمت مقابل فیلترها
 * - پنل فیلترها دقیقاً زیر خود نوار باز می‌شوند
 *
 * Mobile / Tablet:
 * - فیلترها responsive و horizontal scroll
 * - پنل‌ها به شکل bottom sheet
 * - نمایش نقشه با MapToggle کنترل می‌شود
 */
export default function CabinsFilterBar({
  options,
  resultCount,
  mapVisible,
  onToggleMap,
}: Props) {
  const { searchParams } = useCabinQuery();

  const [openPanel, setOpenPanel] = useState<PanelId | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  const closePanel = () => {
    setOpenPanel(null);
  };

  const togglePanel = (id: PanelId) => {
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
   * URL Filters
   */
  const guests = searchParams.get("guests");

  const bedrooms = searchParams.get("bedrooms");

  const amenities =
    searchParams
      .get("amenities")
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  const price = searchParams.get("price");

  const city = searchParams.get("city");

  /**
   * تعداد فیلترهای فعال
   */
  const activeCount = [guests, bedrooms, amenities.length, price, city].filter(
    Boolean,
  ).length;

  /**
   * City summary
   */
  const cityName = city
    ? options.cities.find((item) => String(item.id) === city)?.name
    : undefined;

  /**
   * Price summary
   */
  const priceSummary = (() => {
    if (!price) return undefined;

    const [lo, hi] = price.split("-").map(Number);

    if (!Number.isFinite(lo) || !Number.isFinite(hi)) {
      return undefined;
    }

    const bucket = options.priceBuckets.find(
      (item) => item.value[0] === lo && item.value[1] === hi,
    );

    return (
      bucket?.label ?? `${formatPriceShort(lo)} تا ${formatPriceShort(hi)}`
    );
  })();

  const showPrice = options.priceBuckets.length > 0;

  const showCity = options.cities.length > 0;

  return (
    <div className="sticky top-18 z-50 w-full">
      <div className="border-foreground/10 bg-background/90 border-b backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1800px] items-center gap-2 px-3 py-2.5 sm:px-4 lg:px-6">
          {/* =====================================================
              FILTER BUTTONS
              ===================================================== */}
          <div className="bg-surface/80 border-foreground/10 flex min-w-0 flex-1 scrollbar-none items-center gap-2 overflow-x-auto rounded-2xl border p-1.5 shadow-sm backdrop-blur-md [&::-webkit-scrollbar]:hidden">
            {/* تاریخ */}
            <FilterButton
              label="تاریخ سفر"
              icon={<CalendarDays className="text-primary-400 size-4" />}
              open={openPanel === "date"}
              onClick={() => togglePanel("date")}
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

            {/* سایر فیلترها - موبایل */}
            <FilterButton
              label="سایر فیلترها"
              badge={activeCount}
              open={moreOpen}
              onClick={() => {
                setOpenPanel(null);
                setMoreOpen(true);
              }}
              icon={<SlidersHorizontal className="text-primary-400 size-4" />}
              className="lg:hidden"
            />

            {/* تعداد خواب */}
            <FilterButton
              label="تعداد خواب"
              summary={bedrooms ? `${fa(bedrooms)} خوابه` : undefined}
              active={bedrooms !== null}
              open={openPanel === "bedrooms"}
              onClick={() => togglePanel("bedrooms")}
              icon={<BedDouble className="text-primary-400 size-4" />}
              className="hidden lg:flex"
            />

            {/* امکانات */}
            <FilterButton
              label="امکانات"
              summary={
                amenities.length ? `${fa(amenities.length)} مورد` : undefined
              }
              active={amenities.length > 0}
              open={openPanel === "amenities"}
              onClick={() => togglePanel("amenities")}
              icon={<Sparkles className="text-primary-400 size-4" />}
              className="hidden lg:flex"
            />

            {/* قیمت */}
            {showPrice && (
              <FilterButton
                label="بازه قیمت"
                summary={priceSummary}
                active={price !== null}
                open={openPanel === "price"}
                onClick={() => togglePanel("price")}
                icon={<Wallet className="text-primary-400 size-4" />}
                className="hidden lg:flex"
              />
            )}

            {/* شهر */}
            {showCity && (
              <FilterButton
                label="شهر / مقصد"
                summary={cityName}
                active={city !== null}
                open={openPanel === "city"}
                onClick={() => togglePanel("city")}
                icon={<MapPin className="text-primary-400 size-4" />}
                className="hidden lg:flex"
              />
            )}
          </div>

          {/* =====================================================
              MAP TOGGLE
              ===================================================== */}
          <MapToggle visible={mapVisible} onToggle={onToggleMap} />
        </div>
      </div>

      {/* =========================================================
          FILTER PANEL
          ========================================================= */}
      {openPanel && (
        <>
          {/* Overlay */}
          <div
            aria-hidden="true"
            onClick={closePanel}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:bg-transparent lg:backdrop-blur-none"
          />

          {/* Panel */}
          <div
            role="dialog"
            aria-label={PANEL_TITLES[openPanel]}
            className="bg-surface lg:border-foreground/10 fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-3xl p-5 shadow-2xl lg:absolute lg:top-full lg:right-auto lg:bottom-auto lg:left-0 lg:mt-2 lg:max-h-[70vh] lg:w-[400px] lg:rounded-3xl lg:border"
          >
            {/* Mobile drag indicator */}
            <div
              aria-hidden="true"
              className="bg-foreground/15 mx-auto mb-3 h-1.5 w-12 rounded-full lg:hidden"
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
                className="text-text hover:bg-foreground/5 hidden size-9 items-center justify-center rounded-full transition-colors lg:flex"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* ===================================================
                PANEL CONTENT
                =================================================== */}

            {openPanel === "date" && <DatePanel onDone={closePanel} />}

            {openPanel === "guests" && <GuestsPanel />}

            {openPanel === "bedrooms" && <BedroomsPanel />}

            {openPanel === "amenities" && <AmenitiesPanel options={options} />}

            {openPanel === "price" && <PricePanel options={options} />}

            {openPanel === "city" && <CityPanel options={options} />}

            {/* Mobile Apply Button */}
            <button
              type="button"
              onClick={closePanel}
              className="bg-primary-400 mt-4 w-full rounded-xl py-3 text-sm font-bold text-black transition-transform active:scale-95 lg:hidden"
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
