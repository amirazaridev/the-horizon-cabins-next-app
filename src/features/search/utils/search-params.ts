/**
 * سریال‌سازی و پارس فیلترهای هسته‌ی جستجو ↔ URL.
 *
 * تنها منبع حقیقت برای نام پارامترها همین فایل است؛ هیچ کامپوننتی
 * نباید خودش query بسازد یا بخواند.
 *
 * قرارداد پارامترها:
 *   city      = شناسه‌ی عددی شهر           (مثل city=12)
 *   region    = شناسه‌ی معنایی منطقه        (مثل region=north)
 *   checkIn   = yyyy-MM-dd
 *   checkOut  = yyyy-MM-dd
 *   guests    = عدد صحیح
 *   price     = بازه‌ی بودجه‌ی هر شب       (مثل price=1000000-8000000)
 *
 * `price` همان قرارداد موجود پروژه است و مستقیماً به پارامتر price ای‌پی‌آی
 * نگاشت می‌شود. چون فیلتر «بازه قیمت» از فیلتربار `/cabins` حذف شد،
 * این پارامتر حالا تنها به بودجه‌ی سرچ تعلق دارد و دو مفهوم موازی نداریم.
 */

import {
  formatDateParam,
  parseDateParam,
} from "@/features/cabins/utils/cabin-date";
import { safeParseNumber } from "@/features/cabins/utils/safeParseNumber";
import { formatPriceRange, parsePriceRange } from "@/libs/utils/price-range";
import { getRegion, isRegionId } from "../constants/regions";
import {
  EMPTY_SEARCH_FILTERS,
  type CabinSearchQuery,
  type Destination,
  type SearchFilters,
} from "../types/search.types";

export const SEARCH_PARAM_KEYS = [
  "city",
  "region",
  "checkIn",
  "checkOut",
  "guests",
  "price",
] as const;

type RawSearchParams = Record<string, string | string[] | undefined>;
type ParseInput = RawSearchParams | URLSearchParams | undefined;

function readParam(input: ParseInput, key: string): string | null {
  if (!input) return null;

  if (input instanceof URLSearchParams) {
    return input.get(key);
  }

  const raw = input[key];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value ?? null;
}

/* ------------------------------------------------------------------ */
/* فیلتر → URL                                                        */
/* ------------------------------------------------------------------ */

/** فقط مقادیر غیرخالی نوشته می‌شوند تا URL تمیز بماند */
export function serializeSearchFilters(
  filters: SearchFilters,
): Record<string, string> {
  const out: Record<string, string> = {};

  const { destination } = filters;

  if (destination?.type === "city") {
    out.city = String(destination.id);
  } else if (destination?.type === "region") {
    out.region = destination.id;
  }

  if (filters.checkIn) out.checkIn = formatDateParam(filters.checkIn);
  if (filters.checkOut) out.checkOut = formatDateParam(filters.checkOut);
  if (filters.guests != null) out.guests = String(filters.guests);
  if (filters.budget) {
    out.price = formatPriceRange(filters.budget.min, filters.budget.max);
  }

  return out;
}

export function searchFiltersToQueryString(filters: SearchFilters): string {
  return new URLSearchParams(serializeSearchFilters(filters)).toString();
}

/**
 * نسخه‌ی مناسب «به‌روزرسانی URL»: کلیدهای خالی هم با `null` برمی‌گردند
 * تا مقدار قدیمی‌شان از URL پاک شود (وگرنه حذف بودجه در URL باقی می‌ماند).
 */
export function serializeSearchFiltersForUpdate(
  filters: SearchFilters,
): Record<string, string | null> {
  const present = serializeSearchFilters(filters);
  const updates: Record<string, string | null> = {};
  for (const key of SEARCH_PARAM_KEYS) {
    updates[key] = present[key] ?? null;
  }
  return updates;
}

/** لینک آماده برای ناوبری (پیش‌فرض: /cabins) */
export function searchFiltersToHref(
  filters: SearchFilters,
  basePath = "/cabins",
): string {
  const query = searchFiltersToQueryString(filters);
  return query ? `${basePath}?${query}` : basePath;
}

/* ------------------------------------------------------------------ */
/* URL → فیلتر                                                        */
/* ------------------------------------------------------------------ */

/** پارس امن: هر مقدار نامعتبر نادیده گرفته می‌شود (URL دست‌کاری‌شده) */
export function parseSearchFilters(input: ParseInput): SearchFilters {
  const cityRaw = readParam(input, "city");
  const regionRaw = readParam(input, "region");

  let destination: Destination | null = null;

  if (regionRaw && isRegionId(regionRaw)) {
    const region = getRegion(regionRaw);
    destination = {
      type: "region",
      id: regionRaw,
      name: region?.name ?? regionRaw,
    };
  } else {
    const cityId = safeParseNumber(
      cityRaw ?? undefined,
      1,
      Number.MAX_SAFE_INTEGER,
    );
    if (cityId !== undefined) {
      destination = { type: "city", id: cityId, name: "" };
    }
  }

  const priceRange = parsePriceRange(readParam(input, "price"));

  return {
    destination,
    checkIn: parseDateParam(readParam(input, "checkIn")),
    checkOut: parseDateParam(readParam(input, "checkOut")),
    guests:
      safeParseNumber(readParam(input, "guests") ?? undefined, 1, 30) ?? null,
    budget: priceRange ? { min: priceRange[0], max: priceRange[1] } : null,
  };
}

/* ------------------------------------------------------------------ */
/* کمکی‌ها                                                            */
/* ------------------------------------------------------------------ */

export function hasAnySearchFilter(filters: SearchFilters): boolean {
  return (
    filters.destination !== null ||
    filters.checkIn !== null ||
    filters.checkOut !== null ||
    filters.guests !== null ||
    filters.budget !== null
  );
}

export function countActiveSearchFilters(filters: SearchFilters): number {
  let count = 0;
  if (filters.destination) count += 1;
  if (filters.checkIn || filters.checkOut) count += 1;
  if (filters.guests !== null) count += 1;
  if (filters.budget !== null) count += 1;
  return count;
}

/** تبدیل به قرارداد ورودی repository (تاریخ‌ها رشته‌ای می‌شوند) */
export function toCabinSearchQuery(
  filters: SearchFilters,
  limit?: number,
): CabinSearchQuery {
  return {
    destination: filters.destination,
    checkIn: filters.checkIn ? formatDateParam(filters.checkIn) : null,
    checkOut: filters.checkOut ? formatDateParam(filters.checkOut) : null,
    guests: filters.guests,
    budget: filters.budget,
    limit,
  };
}

export function isEmptySearchFilters(filters: SearchFilters): boolean {
  return !hasAnySearchFilter(filters);
}

export { EMPTY_SEARCH_FILTERS };
