import type { City } from "@/features/cabins/types/city.types";
import { REGION_IDS } from "@/features/search/constants/regions";
import type { Region } from "@/features/search/types/search.types";

//* گروه‌بندی شهرها بر اساس منطقه — کاملاً داده‌محور (`city.regionId` از بک‌اند).
//* هیچ نگاشت «نام شهر → منطقه» در فرانت‌اند وجود ندارد؛ شهر جدید بک‌اند خودکار جای درستش می‌نشیند.

export type CityGroup = {
  region: Region;
  cities: City[];
};

export type GroupedCities = {
  groups: CityGroup[];
  //* شهرهایی که `regionId` آن‌ها با هیچ منطقه‌ی شناخته‌شده‌ای تطبیق نداد
  others: City[];
};

//* ترتیب گروه‌ها از ترتیب `regions` می‌آید (خودش `displayOrder` بک‌اند) و شهرهای داخل هر گروه بر اساس نام فارسی مرتب می‌شوند.
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
