"use client";

import type { City } from "@/features/cabins/types/city.types";
import LastSearchChip from "@/features/search/components/LastSearchChip";
import Search from "@/features/search/components/Search";
import { useLandingSearchController } from "@/features/search/hooks/useLandingSearchController";
import { usePersistLastSearch } from "@/features/search/hooks/useLastSearch";
import type { Region } from "@/features/search/types/search.types";

type Props = {
  cities: City[];
  //* مناطق واقعی از API
  regions: Region[];
  //* افق رزرو (روز) از تنظیمات عمومی — سقف تقویم جستجو
  bookingWindowDays?: number;
};

//* سرچ هیرو لندینگ. این لایه‌ی نازک لازم است چون `Hero` یک Server Component است و نمی‌تواند مستقیم به استور کلاینت وصل شود؛ ضمناً «آخرین جستجو» را ذخیره می‌کند و چیپ آن را نشان می‌دهد.
export default function HeroSearch({
  cities,
  regions,
  bookingWindowDays,
}: Props) {
  const controller = useLandingSearchController();

  usePersistLastSearch(controller.applied);

  return (
    <div className="flex flex-col gap-3 relative max-w-sm lg:max-w-5xl mx-auto">
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
