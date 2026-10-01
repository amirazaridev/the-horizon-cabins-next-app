/**
 * سرویس مقصد — تنها نقطه‌ی دسترسی UI به داده‌ی مقصد.
 *
 * لیست شهرها و مناطق از API می‌آید (`getCities` / `getRegions`) و این لایه
 * فقط منطق جستجو/گروه‌بندی را روی آن‌ها اجرا می‌کند. هیچ داده‌ی ماکی
 * (مثل نگاشت دستی «نام شهر → منطقه») در فرانت‌اند باقی نمانده است.
 */

import type { City } from "@/features/cabins/types/city.types";
import {
  REGION_IDS,
  regionAllCitiesLabel,
  regionHint as regionHintOf,
  regionName,
} from "../constants/regions";
import { groupCitiesByRegion, type CityGroup } from "../utils/city-groups";
import type { Destination, Region, RegionId } from "../types/search.types";

export type DestinationSearchResult = {
  regions: Region[];
  groups: CityGroup[];
  others: City[];
};

/** شناسه‌ی عددی منطقه از اسلاگ */
function regionNumericId(regionId: RegionId): number {
  return REGION_IDS[regionId];
}

/**
 * فیلتر کردن مناطق و شهرها بر اساس عبارت جستجو.
 *
 * بدون عبارت: همه‌ی مناطق (به ترتیب `displayOrder` بک‌اند) با شهرهایشان.
 * با عبارت: منطقه‌هایی که نامشان شامل عبارت است + شهرهای منطبق.
 */
export function searchDestinations(
  cities: City[],
  regions: Region[],
  query: string,
): DestinationSearchResult {
  const term = query.trim();

  if (!term) {
    const { groups, others } = groupCitiesByRegion(cities, regions);
    return { regions, groups, others };
  }

  const matchedRegions = regions.filter((region) => region.name.includes(term));
  const matchedCities = cities.filter((city) => city.name.includes(term));

  const groups: CityGroup[] = [];
  const others: City[] = [];

  for (const city of matchedCities) {
    const region = regions.find(
      (item) => regionNumericId(item.id) === city.regionId,
    );

    if (!region) {
      others.push(city);
      continue;
    }

    const existing = groups.find((group) => group.region.id === region.id);
    if (existing) existing.cities.push(city);
    else groups.push({ region, cities: [city] });
  }

  return { regions: matchedRegions, groups, others };
}

/** ساخت مقصد «منطقه» از اسلاگ */
export function regionDestination(regionId: RegionId): Destination | null {
  return { type: "region", id: regionId, name: regionName(regionId) };
}

/** برچسب کمکی هر منطقه برای نمایش تعداد شهر */
export function regionHint(regionId: RegionId, regions: Region[]): string {
  const region = regions.find((item) => item.id === regionId);
  const allLabel = regionAllCitiesLabel(region?.name ?? regionName(regionId));
  const count = region?.citiesCount ?? 0;

  return count > 0
    ? `${allLabel} · ${count.toLocaleString("fa-IR")} شهر`
    : allLabel;
}

/** توضیح کوتاه منطقه (فقط نمایشی — از نگاشت ثابت فرانت‌اند) */
export function regionSubtitle(regionId: RegionId): string | undefined {
  return regionHintOf(regionId);
}

/** پیدا کردن شهر متناظر با یک مقصد شهر در لیست شهرهای API */
export function findCity(
  cities: City[],
  destination: Destination | null,
): City | undefined {
  if (!destination || destination.type !== "city") return undefined;
  return (
    cities.find((city) => city.id === destination.id) ??
    cities.find((city) => city.name === destination.name)
  );
}
