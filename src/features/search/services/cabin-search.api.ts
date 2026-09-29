/**
 * آداپتور API واقعی برای جستجوی اقامتگاه — آماده برای فردا.
 *
 * ⚠️ این فایل عمداً در هیچ کامپوننتی import نشده است، چون `apiFetch`
 * با `server-only` علامت خورده و فقط باید سمت سرور اجرا شود.
 *
 * نحوه‌ی فعال‌سازی (یک خط):
 *   1) در `services/cabin-search.repository.ts` مقدار
 *      `cabinSearchRepository` را به این پیاده‌سازی وصل کنید،
 *      اما چون این ماژول server-only است، آن را از یک Server Action /
 *      Route Handler صدا بزنید و نتیجه را به کلاینت بدهید.
 *   2) یا endpoint جستجو را با یک `fetch` سبکِ کلاینت‌محور پیاده کنید
 *      و همانجا `mapCabin` را روی پاسخ اعمال کنید.
 *
 * نگاشت فیلترهای هسته → پارامترهای فعلی API:
 *   destination.type === "city"   → city=<id>
 *   destination.type === "region" → فعلاً پشتیبانی نمی‌شود (نیازمند endpoint)
 *   guests                        → guests
 *   budget                        → price=<min>-<max>
 */

import { queryCabins } from "@/features/cabins/api/getCabins";
import { formatPriceRange } from "@/libs/utils/price-range";
import type {
  CabinSearchQuery,
  CabinSearchResult,
} from "../types/search.types";
import type { CabinSearchRepository } from "./cabin-search.repository";

export function createApiCabinSearchRepository(): CabinSearchRepository {
  return {
    async search(query: CabinSearchQuery): Promise<CabinSearchResult> {
      const { destination, guests, budget, limit } = query;

      const { cabins, meta } = await queryCabins({
        city: destination?.type === "city" ? destination.id : undefined,
        guests: guests ?? undefined,
        price: budget ? formatPriceRange(budget.min, budget.max) : undefined,
        limit: limit ?? 6,
        page: 1,
      });

      return { cabins, total: meta.totalItems, source: "api" };
    },
  };
}

export const apiCabinSearchRepository: CabinSearchRepository =
  createApiCabinSearchRepository();
