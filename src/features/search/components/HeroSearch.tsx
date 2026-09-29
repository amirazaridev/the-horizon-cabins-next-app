"use client";

import type { City } from "@/features/cabins/types/city.types";
import { useLandingSearchController } from "../hooks/useLandingSearchController";
import { usePersistLastSearch } from "../hooks/useLastSearch";
import LastSearchChip from "./LastSearchChip";
import Search from "./Search";

/**
 * سرچ هیرو لندینگ.
 *
 * این لایه‌ی نازک لازم است چون `Hero` یک Server Component است و
 * نمی‌تواند مستقیماً به استور کلاینت (Zustand) وصل شود.
 *
 * همچنین «آخرین جستجو» را در حافظه ذخیره می‌کند و چیپ آن را زیر نوار
 * جستجو نشان می‌دهد.
 */
export default function HeroSearch({ cities }: { cities: City[] }) {
  const controller = useLandingSearchController();

  usePersistLastSearch(controller.applied);

  return (
    <div className="flex flex-col gap-3">
      <Search cities={cities} controller={controller} variant="hero" />
      <LastSearchChip cities={cities} controller={controller} />
    </div>
  );
}
