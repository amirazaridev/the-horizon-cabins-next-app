import type { CabinsQueryParams, Cabin } from "@/features/cabins/types/cabin.types";
import { parseCabinFilters } from "@/features/cabins/utils/cabin-filters";
import { parseLimitParam, parsePageParam } from "@/libs/utils/pagination";

export type CabinsSearchParams = Record<string, string | string[] | undefined>;

/** کلیدهایی که در URL داشبورد معنا دارند و با «حذف فیلترها» پاک میشوند */
export const DASHBOARD_FILTER_KEYS = [
  "guests",
  "bedrooms",
  "amenities",
  "price",
  "city",
  "category",
  "sortBy",
] as const;

export const DASHBOARD_SORT_OPTIONS = [
  { value: "name-asc", label: "نام (صعودی)" },
  { value: "name-desc", label: "نام (نزولی)" },
  { value: "regularPrice-asc", label: "مبلغ (ارزانترین)" },
  { value: "regularPrice-desc", label: "مبلغ (گرانترین)" },
  { value: "maxCapacity-asc", label: "ظرفیت (کمترین)" },
  { value: "maxCapacity-desc", label: "ظرفیت (بیشترین)" },
] as const;

export type CabinSortValue = (typeof DASHBOARD_SORT_OPTIONS)[number]["value"];

const faCollator = new Intl.Collator("fa");

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** مقدار تکررشده یک پارامتر کوئری را بهصورت رشته برمیگرداند */
export function getParam(params: CabinsSearchParams, key: string): string {
  const value = params[key];
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

/** مقدار sortBy فقط در صورتی پذیرفته میشود که یکی از گزینههای معتبر باشد */
export function parseSortParam(
  params: CabinsSearchParams,
): CabinSortValue | undefined {
  const raw = one(params.sortBy);
  if (!raw) return undefined;

  return DASHBOARD_SORT_OPTIONS.some((option) => option.value === raw)
    ? (raw as CabinSortValue)
    : undefined;
}

/**
 * تبدیل searchParams صفحه به پارامترهای کوئریِ API.
 *
 * تمام فیلترها (شهر، ظرفیت، خواب، امکانات، قیمت، دسته‌بندی) سمت بکند اعمال
 * میشوند — دیگر نیازی به فیلتر کردن محلی روی کل لیست نیست.
 */
export function buildCabinsQuery(
  params: CabinsSearchParams,
): CabinsQueryParams {
  const filters = parseCabinFilters(params);

  return {
    page: parsePageParam(params),
    limit: parseLimitParam(params.limit),
    category: filters.category,
    guests: filters.guests,
    bedrooms: filters.bedrooms,
    amenities: filters.amenities?.join(","),
    price: filters.price ? `${filters.price[0]}-${filters.price[1]}` : undefined,
    city: filters.cityId,
  };
}

/**
 * مرتبسازی محلی روی آیتمهای همین صفحه.
 *
 * بکند پارامتر sort را پشتیبانی نمیکند، بنابراین ترتیب فقط در محدودهٔ صفحهٔ
 * فعلی معتبر است. برای مرتبسازی روی کل مجموعه باید sort به بکند اضافه شود.
 */
export function sortCabins(
  cabins: Cabin[],
  sortBy?: CabinSortValue,
): Cabin[] {
  if (!sortBy) return cabins;

  const sorted = [...cabins];

  switch (sortBy) {
    case "name-asc":
      return sorted.sort((a, b) => faCollator.compare(a.name, b.name));
    case "name-desc":
      return sorted.sort((a, b) => faCollator.compare(b.name, a.name));
    case "regularPrice-asc":
      return sorted.sort((a, b) => a.regularPrice - b.regularPrice);
    case "regularPrice-desc":
      return sorted.sort((a, b) => b.regularPrice - a.regularPrice);
    case "maxCapacity-asc":
      return sorted.sort((a, b) => a.maxCapacity - b.maxCapacity);
    case "maxCapacity-desc":
      return sorted.sort((a, b) => b.maxCapacity - a.maxCapacity);
    default:
      return sorted;
  }
}
