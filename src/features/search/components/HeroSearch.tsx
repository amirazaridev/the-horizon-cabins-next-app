"use client";

import type { City } from "@/features/cabins/types/city.types";
import { useLandingSearchController } from "../hooks/useLandingSearchController";
import { usePersistLastSearch } from "../hooks/useLastSearch";
import type { Region } from "../types/search.types";
import LastSearchChip from "./LastSearchChip";
import Search from "./Search";

type Props = {
  cities: City[];
  /** مناطق واقعی از API */
  regions: Region[];
  /** افق رزرو (روز) از تنظیمات عمومی — سقف تقویم جستجو */
  bookingWindowDays?: number;
};

/**
 * سرچ هیرو لندینگ.
 *
 * این لایه‌ی نازک لازم است چون `Hero` یک Server Component است و
 * نمی‌تواند مستقیماً به استور کلاینت (Zustand) وصل شود.
 *
 * همچنین «آخرین جستجو» را در حافظه ذخیره می‌کند و چیپ آن را زیر نوار
 * جستجو نشان می‌دهد.
 */
export default function HeroSearch({
  cities,
  regions,
  bookingWindowDays,
}: Props) {
  const controller = useLandingSearchController();

  usePersistLastSearch(controller.applied);

  return (
    <div className="flex flex-col gap-3 relative ">
      <LastSearchChip cities={cities} controller={controller} />
      <Search
        cities={cities}
        regions={regions}
        controller={controller}
        variant="hero"
        bookingWindowDays={bookingWindowDays}
      />
    </div>
  );
}
