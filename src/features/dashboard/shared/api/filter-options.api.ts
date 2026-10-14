import "server-only";

import { authFetch } from "@/libs/api/authFetch";

/** کش/تگ مشترک گزینه‌های فیلتر — یکسان بین همه‌ی مصرف‌کننده‌ها. */
const FILTER_OPTIONS_CACHE = {
  cache: "force-cache",
  next: { revalidate: 300 },
} as const;

/** یک شهر خام از `GET /locations/cities` (زیرمجموعه‌ی فیلدهای لازم). */
export interface RawCityOption {
  id: number;
  name: string;
}

/** یک اقامتگاه خام از `GET /cabins` — فرم کامل به‌همراه `city` تودرتو. */
export interface RawCabinOption {
  id: number;
  name: string;
  /** ⚠️ `GET /cabins` فیلد `cityId` را حذف می‌کند و فقط `city` را می‌دهد. */
  city?: { id: number; name: string };
}

export interface RawFilterOptions<
  TCity extends RawCityOption,
  TCabin extends RawCabinOption,
> {
  cities: TCity[];
  cabins: TCabin[];
}

export async function fetchFilterOptions<
  TCity extends RawCityOption = RawCityOption,
  TCabin extends RawCabinOption = RawCabinOption,
>(): Promise<RawFilterOptions<TCity, TCabin>> {
  const [citiesRes, cabinsRes] = await Promise.all([
    authFetch("locations/cities", {
      ...FILTER_OPTIONS_CACHE,
      next: { ...FILTER_OPTIONS_CACHE.next, tags: ["cities-data"] },
    }),
    authFetch("cabins?limit=100", {
      ...FILTER_OPTIONS_CACHE,
      next: { ...FILTER_OPTIONS_CACHE.next, tags: ["cabins-data"] },
    }),
  ]);

  if (!citiesRes.ok || !cabinsRes.ok) {
    throw new Error("دریافت گزینه‌های فیلتر ناموفق بود.");
  }

  const citiesJson = (await citiesRes.json()) as {
    data?: { cities?: TCity[] };
  };
  const cabinsJson = (await cabinsRes.json()) as {
    data?: { cabins?: TCabin[] };
  };

  return {
    cities: citiesJson.data?.cities ?? [],
    cabins: cabinsJson.data?.cabins ?? [],
  };
}
