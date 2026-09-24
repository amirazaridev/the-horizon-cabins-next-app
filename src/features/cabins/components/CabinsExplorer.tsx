"use client";

import { useState, type ReactNode } from "react";

import type { CabinFilterOptions } from "../utils/cabin-filters";
import CabinsFilterBar from "./filters/CabinsFilterBar";
import CabinsMapPanel from "./CabinsMapPanel";
import CabinsMobileMapSheet from "./CabinsMobileMapSheet";

type Props = {
  resultCount: number;
  filterOptions: CabinFilterOptions;
  children: ReactNode;
};

export default function CabinsExplorer({
  resultCount,
  filterOptions,
  children,
}: Props) {
  const [mapVisible, setMapVisible] = useState(true);

  return (
    <>
      <CabinsFilterBar
        options={filterOptions}
        resultCount={resultCount}
        mapVisible={mapVisible}
        onToggleMap={() => setMapVisible((value) => !value)}
      />

      <div className="w-full">
        {/* MOBILE MAP*/}
        {mapVisible && (
          <div className="mx-auto block max-w-[1800px] px-3 pt-3 sm:px-4 md:pt-4 lg:hidden">
            <CabinsMobileMapSheet resultCount={resultCount} />
          </div>
        )}

        {/* DESKTOP CONTENT */}
        <div
          className={`${mapVisible ? "lg:grid-cols-[minmax(0,1fr)_minmax(360px,40%)]" : "max-w-7xl"} mx-auto grid items-start gap-6 px-3 py-6 sm:px-4 md:py-7 lg:gap-6 lg:px-6 lg:py-8 2xl:gap-8`}
        >
          {/* RIGHT SIDE */}
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

          {/* LEFT SIDE — MAP */}
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
