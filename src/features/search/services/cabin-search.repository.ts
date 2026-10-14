import type { CabinDto } from "@/features/cabins/types/cabin.types";
import { mapCabin } from "@/features/cabins/utils/mapCabin";
import { SEARCH_PREVIEW_LIMIT } from "@/features/search/constants/search-limits";
import type {
  CabinSearchResult,
  SearchFilters,
} from "@/features/search/types/search.types";
import { serializeSearchFilters } from "@/features/search/utils/search-params";

//* مسیر داخلی پروکسی؛ تنها جایی که ساخته می‌شود همین فایل است
export const CABIN_SEARCH_ENDPOINT = "/api/search/cabins";

export interface CabinSearchRepository {
  //* فیلترهای هسته‌ی سرچ + حداکثر تعداد کارت برگشتی (پیش‌فرض: ۶ کارت پیش‌نمایش)
  search(filters: SearchFilters, limit?: number): Promise<CabinSearchResult>;
}

//* شکل پاسخ JSON مسیر داخلی — تاریخ‌ها بعد از JSON رشته‌اند
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
