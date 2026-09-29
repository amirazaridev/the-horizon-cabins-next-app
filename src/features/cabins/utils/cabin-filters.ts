/** کلیدهای فیلتر در URL (برای clearFilters) */

import { safeParseNumber } from "./safeParseNumber";

// TODO : delete constants
export const CABIN_FILTER_KEYS = [
  "guests",
  "bedrooms",
  "amenities",
  "price",
  "city",
  "region",
  "checkIn",
  "checkOut",
] as const;

export type CabinFilters = {
  guests?: number;
  bedrooms?: number;
  amenities?: string[];
  price?: [number, number];
  cityId?: number;
  category?: string;
  /** منطقه‌ی انتخاب‌شده در فیلتر شهر (`north` و …) */
  region?: string;
  /** سقف بودجه‌ی سرچ اصلی؛ در صورت نبود بازه‌ی قیمت به `price` ترجمه می‌شود */
  maxPrice?: number;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

export function parseCabinFilters(sp: RawSearchParams): CabinFilters {
  const one = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  const amenitiesRaw = one(sp.amenities);
  const amenities = amenitiesRaw
    ?.split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  const category = one(sp.category);
  const regionRaw = one(sp.region);

  const priceRaw = one(sp.price);
  let price: [number, number] | undefined;
  if (priceRaw) {
    const [lo, hi] = priceRaw.split("-").map(Number);
    if (
      Number.isFinite(lo) &&
      Number.isFinite(hi) &&
      lo >= 0 &&
      hi >= lo &&
      hi > 0
    ) {
      price = [lo, hi];
    }
  }

  return {
    guests: safeParseNumber(one(sp.guests), 1, 30),
    bedrooms: safeParseNumber(one(sp.bedrooms), 1, 20),
    amenities: amenities?.length ? amenities : undefined,
    price,
    category,
    cityId: safeParseNumber(one(sp.city), 1, Number.MAX_SAFE_INTEGER),
    region: regionRaw && /^[a-z]+$/.test(regionRaw) ? regionRaw : undefined,
    maxPrice: safeParseNumber(
      one(sp.maxPrice),
      0,
      Number.MAX_SAFE_INTEGER,
    ),
  };
}

export function finalNightPrice(cabin: {
  regularPrice: number;
  discount: number;
}): number {
  return cabin.regularPrice - cabin.discount;
}

export function countActiveCabinFilters(filters: CabinFilters): number {
  let n = 0;
  if (filters.guests !== undefined) n += 1;
  if (filters.bedrooms !== undefined) n += 1;
  if (filters.amenities?.length) n += 1;
  if (filters.price) n += 1;
  if (filters.cityId !== undefined) n += 1;
  return n;
}

const faNum = (n: number) => n.toLocaleString("fa-IR");

export function formatPriceShort(value: number): string {
  if (value >= 1_000_000) {
    const m = Math.round((value / 1_000_000) * 10) / 10;
    return `${faNum(m)} میلیون`;
  }
  if (value >= 1_000) return `${faNum(Math.round(value / 1_000))} هزار`;
  return faNum(value);
}
