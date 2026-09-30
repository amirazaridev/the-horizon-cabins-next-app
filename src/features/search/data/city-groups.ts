/**
 * گروه‌بندی شهرها بر اساس منطقه.
 *
 * دسته‌بندی کاملاً داده‌محور است: هر شهر `regionId` عددی دارد که از بک‌اند
 * می‌آید و با شناسه‌ی عددیِ منطقه تطبیق داده می‌شود. هیچ نگاشت «نام شهر →
 * منطقه» در فرانت‌اند وجود ندارد (نسخه‌ی قبلی این کار را با یک نقشه‌ی دستی
 * انجام می‌داد و هر شهر جدیدی که در بک‌اند اضافه می‌شد، در «سایر شهرها»
 * می‌افتاد).
 */

import type { City } from "@/features/cabins/types/city.types";
import { REGION_IDS } from "../constants/regions";
import type { Region } from "../types/search.types";

export type CityGroup = {
  region: Region;
  cities: City[];
};

export type GroupedCities = {
  groups: CityGroup[];
  /** شهرهایی که `regionId` آن‌ها با هیچ منطقه‌ی شناخته‌شده‌ای تطبیق نداد */
  others: City[];
};

/**
 * شهرها را بر اساس `regionId` کنار هم می‌گذارد.
 *
 * ترتیب گروه‌ها از ترتیب `regions` می‌آید (که خودش ترتیب `displayOrder`
 * بک‌اند است) و شهرهای داخل هر گروه بر اساس نام فارسی مرتب می‌شوند.
 */
export function groupCitiesByRegion(
  cities: City[],
  regions: Region[],
): GroupedCities {
  const buckets = new Map<number, City[]>();
  const others: City[] = [];

  const knownIds = new Set(regions.map((region) => REGION_IDS[region.id]));

  for (const city of cities) {
    if (!knownIds.has(city.regionId)) {
      others.push(city);
      continue;
    }

    const bucket = buckets.get(city.regionId);
    if (bucket) bucket.push(city);
    else buckets.set(city.regionId, [city]);
  }

  const groups: CityGroup[] = [];

  for (const region of regions) {
    const bucket = buckets.get(REGION_IDS[region.id]);
    if (!bucket || bucket.length === 0) continue;

    groups.push({
      region: { ...region, citiesCount: bucket.length },
      cities: [...bucket].sort((a, b) => a.name.localeCompare(b.name, "fa")),
    });
  }

  return { groups, others };
}
