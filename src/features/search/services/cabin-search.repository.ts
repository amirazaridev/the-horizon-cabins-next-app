/**
 * repository جستجوی اقامتگاه — لایه‌ی کلاینت.
 *
 * ═══════════════════════════════════════════════════════════════════
 *  نقطه‌ی واحد دسترسی UI به داده‌ی جستجو  ←  همین فایل
 * ═══════════════════════════════════════════════════════════════════
 *
 * هیچ کامپوننتی (SearchPreview, CabinCard, …) نمی‌داند داده از کجا می‌آید؛
 * همه فقط `cabinSearchRepository.search(...)` را صدا می‌زنند.
 *
 * زنجیره‌ی کامل:
 *   UI → cabinSearchRepository (اینجا، کلاینت)
 *      → GET /api/search/cabins  (Route Handler، سرور)
 *      → searchCabinsFromApi     (آداپتور API، server-only)
 *      → queryCabins             (getCabins)
 *      → API بک‌اند
 *
 * داده‌ی ماک کاملاً حذف شده است؛ تنها منبع نتیجه‌ها API است.
 */

import type { CabinDto } from "@/features/cabins/types/cabin.types";
import { mapCabin } from "@/features/cabins/utils/mapCabin";
import {
  SEARCH_PREVIEW_LIMIT,
  type CabinSearchResult,
  type SearchFilters,
} from "../types/search.types";
import { serializeSearchFilters } from "../utils/search-params";

/** مسیر داخلی پروکسی؛ تنها جایی که ساخته می‌شود همین فایل است */
export const CABIN_SEARCH_ENDPOINT = "/api/search/cabins";

export interface CabinSearchRepository {
  /**
   * جستجوی اقامتگاه.
   *
   * @param filters فیلترهای هسته‌ی سرچ (همان `SearchFilters` دامنه)
   * @param limit   حداکثر تعداد کارت برگشتی (پیش‌فرض: ۶ کارت پیش‌نمایش)
   */
  search(filters: SearchFilters, limit?: number): Promise<CabinSearchResult>;
}

/** شکل پاسخ JSON مسیر داخلی — تاریخ‌ها بعد از JSON رشته‌اند */
type SearchResponseDto = {
  cabins: CabinDto[];
  total: number;
};

export const cabinSearchRepository: CabinSearchRepository = {
  async search(filters, limit = SEARCH_PREVIEW_LIMIT) {
    const params = new URLSearchParams(serializeSearchFilters(filters));
    params.set("limit", String(limit));

    const res = await fetch(`${CABIN_SEARCH_ENDPOINT}?${params}`, {
      headers: { accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error("دریافت نتایج جستجو ناموفق بود.");
    }

    const json = (await res.json()) as SearchResponseDto;

    return {
      cabins: (json.cabins ?? []).map(mapCabin),
      total: json.total ?? 0,
    };
  },
};
