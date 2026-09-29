import type { Region, RegionId } from "../types/search.types";

/**
 * هفت منطقه‌ی اصلی مقصد.
 * ترتیب آرایه همان ترتیب نمایش در UI است.
 */
export const REGIONS: Region[] = [
  { id: "north", name: "شمال ایران", hint: "جنگل، دریا و کوهستان" },
  { id: "south", name: "جنوب ایران", hint: "ساحل، جزیره و خلیج" },
  { id: "northeast", name: "شمال‌شرق ایران", hint: "خراسان و کویر شمالی" },
  { id: "northwest", name: "شمال‌غرب ایران", hint: "آذربایجان و اردبیل" },
  { id: "center", name: "مرکز ایران", hint: "تهران، اصفهان و کویر" },
  { id: "east", name: "شرق ایران", hint: "سیستان، خراسان جنوبی و طبس" },
  { id: "west", name: "غرب ایران", hint: "کردستان، لرستان و کرمانشاه" },
];

export const REGIONS_BY_ID: Record<RegionId, Region> = REGIONS.reduce(
  (acc, region) => {
    acc[region.id] = region;
    return acc;
  },
  {} as Record<RegionId, Region>,
);

export function getRegion(regionId: RegionId | string): Region | undefined {
  return REGIONS_BY_ID[regionId as RegionId];
}

export function isRegionId(value: string | null | undefined): value is RegionId {
  if (!value) return false;
  return REGIONS.some((region) => region.id === value);
}

/**
 * برچسب «همه شهرهای …» برای یک منطقه.
 * مثال: «شمال ایران» → «همه شهرهای شمال»
 */
export function regionAllCitiesLabel(regionName: string): string {
  return `همه شهرهای ${regionName.replace(" ایران", "").trim()}`;
}
