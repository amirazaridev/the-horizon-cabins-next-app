import type { Cabin } from "@/features/cabins/types/cabin.types";

/** کلیدهای فیلتر در URL */
export const CABIN_FILTER_KEYS = [
  "guests",
  "bedrooms",
  "amenities",
  "price",
  "city",
] as const;

export type CabinFilters = {
  /** حداقل ظرفیت (maxCapacity >= guests) */
  guests?: number;
  /** حداقل اتاق‌خواب (bedrooms >= bedrooms) */
  bedrooms?: number;
  /** امکانات انتخاب‌شده؛ اقامتگاه باید همه را داشته باشد */
  amenities?: string[];
  /** بازه قیمت نهایی هر شب [از، تا] */
  price?: [number, number];
  /** شناسه شهر */
  cityId?: number;
};

export type PriceBucket = {
  label: string;
  value: [number, number];
};

export type CabinFilterOptions = {
  cities: { id: number; name: string }[];
  amenities: string[];
  priceBounds: { min: number; max: number };
  priceBuckets: PriceBucket[];
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function toInt(value: string | undefined, min: number, max: number) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) return undefined;
  return n;
}

/** خواندن فیلترها از searchParams صفحه */
export function parseCabinFilters(sp: RawSearchParams): CabinFilters {
  const one = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  const amenitiesRaw = one(sp.amenities);
  const amenities = amenitiesRaw
    ?.split(",")
    .map((a) => a.trim())
    .filter(Boolean);

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
    guests: toInt(one(sp.guests), 1, 30),
    bedrooms: toInt(one(sp.bedrooms), 1, 20),
    amenities: amenities?.length ? amenities : undefined,
    price,
    cityId: toInt(one(sp.city), 1, Number.MAX_SAFE_INTEGER),
  };
}

export function finalNightPrice(cabin: Cabin): number {
  return cabin.regularPrice - cabin.discount;
}

/** اعمال فیلترها روی لیست (سمت سرور) */
export function applyCabinFilters(
  cabins: Cabin[],
  filters: CabinFilters,
): Cabin[] {
  return cabins.filter((cabin) => {
    if (filters.guests !== undefined && cabin.maxCapacity < filters.guests)
      return false;
    if (filters.bedrooms !== undefined && cabin.bedrooms < filters.bedrooms)
      return false;
    if (
      filters.amenities?.length &&
      !filters.amenities.every((a) => cabin.amenities.includes(a))
    )
      return false;
    if (filters.cityId !== undefined && cabin.city?.id !== filters.cityId)
      return false;
    if (filters.price) {
      const p = finalNightPrice(cabin);
      if (p < filters.price[0] || p > filters.price[1]) return false;
    }
    return true;
  });
}

/** تعداد فیلترهای فعال (برای بج «سایر فیلترها»)؛ تاریخ تستی حساب نمی‌شود */
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

/** نمایش کوتاه قیمت: ۲٫۵ میلیون / ۸۰۰ هزار */
export function formatPriceShort(value: number): string {
  if (value >= 1_000_000) {
    const m = Math.round((value / 1_000_000) * 10) / 10;
    return `${faNum(m)} میلیون`;
  }
  if (value >= 1_000) return `${faNum(Math.round(value / 1_000))} هزار`;
  return faNum(value);
}

function buildPriceBuckets(min: number, max: number): PriceBucket[] {
  if (!(max > min)) return [];
  const span = max - min;
  const rawStep = span / 3;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const norm = rawStep / magnitude;
  const niceStep = (norm >= 5 ? 5 : norm >= 2 ? 2 : 1) * magnitude;

  const b1 = Math.ceil((min + rawStep) / niceStep) * niceStep;
  const b2 = Math.ceil((min + 2 * rawStep) / niceStep) * niceStep;
  const edges = [min, b1, b2, max].filter(
    (edge, i, arr) => i === 0 || edge > arr[i - 1],
  );

  const buckets: PriceBucket[] = [];
  for (let i = 0; i < edges.length - 1; i += 1) {
    const lo = edges[i];
    const hi = edges[i + 1];
    buckets.push({
      label: `${formatPriceShort(lo)} تا ${formatPriceShort(hi)}`,
      value: [lo, hi],
    });
  }
  // تک‌باکت یعنی تنوع قیمتی نداریم؛ فیلتر قیمت بی‌معنی است
  return buckets.length > 1 ? buckets : [];
}

/** ساخت آپشن‌های فیلتر از دیتای واقعی (شهرها، امکانات، بازه قیمت) */
export function buildCabinFilterOptions(cabins: Cabin[]): CabinFilterOptions {
  const cities = new Map<number, string>();
  const amenitiesSet = new Set<string>();
  let min = Number.POSITIVE_INFINITY;
  let max = 0;

  for (const cabin of cabins) {
    if (cabin.city && !cities.has(cabin.city.id)) {
      cities.set(cabin.city.id, cabin.city.name);
    }
    for (const amenity of cabin.amenities) amenitiesSet.add(amenity);
    const price = finalNightPrice(cabin);
    if (price < min) min = price;
    if (price > max) max = price;
  }

  if (!Number.isFinite(min)) min = 0;

  return {
    cities: [...cities].map(([id, name]) => ({ id, name })),
    amenities: [...amenitiesSet],
    priceBounds: { min, max },
    priceBuckets: buildPriceBuckets(min, max),
  };
}
