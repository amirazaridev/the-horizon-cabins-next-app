/** کلیدهای فیلتر در URL (برای clearFilters) */

import { parsePriceRange } from "@/libs/utils/price-range";
import { safeParseNumber } from "./safeParseNumber";

/**
 * کلیدهای فیلترهای پیشرفته‌ی `/cabins` — همان‌هایی که دکمه‌ی
 * «حذف فیلترها» پاک می‌کند.
 *
 * توجه: مقصد، تاریخ، تعداد نفرات و بازه‌ی بودجه حالا در نوار جستجوی همین
 * صفحه هستند؛ پس اینجا نیستند تا «حذف فیلترها» جستجوی کاربر را پاک نکند.
 * (کلیدهای جستجو در `SEARCH_PARAM_KEYS` فهرست شده‌اند.)
 */
export const CABIN_FILTER_KEYS = ["bedrooms", "amenities"] as const;

export type CabinFilters = {
  guests?: number;
  bedrooms?: number;
  amenities?: string[];
  /** بازه‌ی بودجه‌ی سرچ (`lo-hi`) که مستقیماً به API پاس داده می‌شود */
  price?: [number, number];
  cityId?: number;
  category?: string;
  /** منطقه‌ی انتخاب‌شده در سرچ (`north` و …) */
  region?: string;
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

  return {
    guests: safeParseNumber(one(sp.guests), 1, 30),
    bedrooms: safeParseNumber(one(sp.bedrooms), 1, 20),
    amenities: amenities?.length ? amenities : undefined,
    price: parsePriceRange(one(sp.price)),
    category,
    cityId: safeParseNumber(one(sp.city), 1, Number.MAX_SAFE_INTEGER),
    region: regionRaw && /^[a-z]+$/.test(regionRaw) ? regionRaw : undefined,
  };
}

export function finalNightPrice(cabin: {
  regularPrice: number;
  discount: number;
}): number {
  return cabin.regularPrice - cabin.discount;
}

/**
 * قالب فشرده‌ی قیمت — پیاده‌سازی به `@/libs/utils/format` منتقل شد تا
 * کامپوننت‌های مشترک `components/ui` هم بتوانند بدون وابستگی به فیچر
 * از آن استفاده کنند. این re-export برای سازگاری با importهای قبلی است.
 */
export { formatPriceShort } from "@/libs/utils/format";
