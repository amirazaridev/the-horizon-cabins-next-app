"use client";

import { useState, type ReactNode } from "react";

import type { RawSearchParams } from "@/hooks/useUrlQuery";
import { SearchBar } from "@/features/search";
import type { City } from "@/features/cabins/types/city.types";
import type { Region } from "@/features/search/types/search.types";

import CabinsFilterBar from "./filters/CabinsFilterBar";
import CabinsMapPanel from "./CabinsMapPanel";
import CabinsMobileMapSheet from "./CabinsMobileMapSheet";

type Props = {
  cities: City[];
  /** مناطق واقعی از API — برای گروه‌بندی شهرها در سرچ و فیلتر */
  regions: Region[];
  amenities: string[];
  resultCount: number;
  /** searchParams خام سرور — برای نوار جستجوی بالای صفحه */
  searchParams: RawSearchParams;
  /** افق رزرو (روز) از تنظیمات عمومی — سقف تقویم جستجو */
  bookingWindowDays?: number;
  children: ReactNode;
};

export default function CabinsExplorer({
  cities,
  regions,
  amenities,
  resultCount,
  searchParams,
  bookingWindowDays,
  children,
}: Props) {
  const [mapVisible, setMapVisible] = useState(true);

  return (
    <>
      {/*
        نوار جستجو در جریان عادی صفحه است (sticky نیست) تا با FilterBar
        چسبان رقابت نکند و ویوپورت را اشغال نکند.
      */}
      <SearchBar
        cities={cities}
        regions={regions}
        searchParams={searchParams}
        bookingWindowDays={bookingWindowDays}
      />

      <CabinsFilterBar
        amenities={amenities}
        resultCount={resultCount}
        mapVisible={mapVisible}
        onToggleMap={() => setMapVisible((value) => !value)}
      />

      <div className="w-full">
        {mapVisible && (
          <div className="mx-auto block max-w-[1800px] px-3 pt-3 sm:px-4 md:pt-4 lg:hidden">
            <CabinsMobileMapSheet resultCount={resultCount} />
          </div>
        )}

        <div
          className={`${mapVisible ? "lg:grid-cols-[minmax(0,1fr)_minmax(360px,40%)]" : "max-w-7xl"} mx-auto grid items-start gap-6 px-3 py-6 sm:px-4 md:py-7 lg:gap-6 lg:px-6 lg:py-8 2xl:gap-8`}
        >
          <main className=" ">
            <header className="mb-6 text-right">
              <h1 className="text-text text-2xl font-extrabold tracking-tight sm:text-3xl">
                مجموعه سوئیت‌ها
              </h1>

              <div className="text-text-gray mt-2 flex items-center justify-start gap-2 text-sm">
                <span>
                  {resultCount.toLocaleString("fa-IR")} اقامتگاه برای مشاهده
                </span>
              </div>
            </header>

            <div className="min-w-0">{children}</div>
          </main>

          {mapVisible && (
            <aside
              aria-label="نقشه اقامتگاه‌ها"
              className="sticky top-37.5 hidden min-w-0 lg:block"
            >
              <div className="">
                <CabinsMapPanel
                  framed={false}
                  className="h-[80vh] min-h-120 w-full"
                />
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}