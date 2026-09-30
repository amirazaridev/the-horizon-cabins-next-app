/**
 * کدگذاری/کدگشایی «مقصد» به یک رشته‌ی واحد.
 *
 * چرا؟ چون `CityPanel` مشترک با `string | null` کار می‌کند و ما دو نوع
 * مقصد داریم (شهر / منطقه). پس با یک پیشوند ساده از هم جدا می‌شوند:
 *   city:12      → شهر با شناسه‌ی ۱۲
 *   region:north → همه‌ی شهرهای شمال
 */

import type { City } from "@/features/cabins/types/city.types";
import { isRegionId, regionName } from "../constants/regions";
import type { Destination } from "../types/search.types";

export const CITY_VALUE_PREFIX = "city:";
export const REGION_VALUE_PREFIX = "region:";

export function encodeDestination(
  destination: Destination | null,
): string | null {
  if (!destination) return null;
  return destination.type === "city"
    ? `${CITY_VALUE_PREFIX}${destination.id}`
    : `${REGION_VALUE_PREFIX}${destination.id}`;
}

export function decodeDestination(value: string | null): Destination | null {
  if (!value) return null;

  if (value.startsWith(REGION_VALUE_PREFIX)) {
    const slug = value.slice(REGION_VALUE_PREFIX.length);
    if (!isRegionId(slug)) return null;
    return { type: "region", id: slug, name: regionName(slug) };
  }

  if (value.startsWith(CITY_VALUE_PREFIX)) {
    const id = Number(value.slice(CITY_VALUE_PREFIX.length));
    if (!Number.isFinite(id)) return null;
    return { type: "city", id, name: "" };
  }

  return null;
}

/** همان decode، ولی نام شهر را از لیست شهرهای API پر می‌کند */
export function decodeDestinationWithName(
  value: string | null,
  cities: City[] = [],
): Destination | null {
  const destination = decodeDestination(value);
  if (!destination) return null;
  if (destination.type === "region") return destination;

  const city = cities.find((item) => item.id === destination.id);
  return city ? { type: "city", id: city.id, name: city.name } : destination;
}
