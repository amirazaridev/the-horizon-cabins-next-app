/**
 * سرویس مقصد — تنها نقطه‌ی دسترسی UI به داده‌ی مقصد.
 *
 * امروز روی داده‌ی ماک (`data/destinations.mock.ts`) کار می‌کند و
 * لیست شهرها را از API موجود (`City[]`) می‌گیرد.
 * فردا می‌توان همین امضاها را با یک منبع دیگر پیاده کرد.
 */

import type { City } from "@/features/cabins/types/city.types";
import { REGIONS, regionAllCitiesLabel } from "../constants/regions";
import {
  groupCitiesByRegion,
  regionOfCityName,
  type CityGroup,
} from "../data/destinations.mock";
import type { Destination, Region, RegionId } from "../types/search.types";

export type DestinationSearchResult = {
  regions: Region[];
  groups: CityGroup[];
  others: City[];
};

/** فیلتر کردن مناطق و شهرها بر اساس عبارت جستجو */
export function searchDestinations(
  cities: City[],
  query: string,
): DestinationSearchResult {
  const term = query.trim();

  if (!term) {
    const { groups, others } = groupCitiesByRegion(cities);
    return { regions: REGIONS, groups, others };
  }

  const regions = REGIONS.filter((region) => region.name.includes(term));

  const matchedCities = cities.filter((city) => city.name.includes(term));

  const groups: CityGroup[] = [];
  const others: City[] = [];

  for (const city of matchedCities) {
    const regionId = regionOfCityName(city.name);
    const region = regionId
      ? REGIONS.find((item) => item.id === regionId)
      : undefined;

    if (!region) {
      others.push(city);
      continue;
    }

    const existing = groups.find((group) => group.region.id === region.id);
    if (existing) existing.cities.push(city);
    else groups.push({ region, cities: [city] });
  }

  return { regions, groups, others };
}

/** ساخت مقصد «منطقه» از شناسه‌ی معنایی */
export function regionDestination(regionId: RegionId): Destination | null {
  const region = REGIONS.find((item) => item.id === regionId);
  if (!region) return null;
  return { type: "region", id: region.id, name: region.name };
}

/** برچسب کمکی هر منطقه برای نمایش تعداد شهر */
export function regionHint(regionId: RegionId, cities: City[]): string {
  const count = cities.filter(
    (city) => regionOfCityName(city.name) === regionId,
  ).length;

  const region = REGIONS.find((item) => item.id === regionId);
  const allLabel = region ? regionAllCitiesLabel(region.name) : "همه شهرها";

  return count > 0
    ? `${allLabel} · ${count.toLocaleString("fa-IR")} شهر`
    : allLabel;
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
