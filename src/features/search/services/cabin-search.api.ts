/**
 * آداپتور API واقعی جستجوی اقامتگاه — لایه‌ی سرور.
 *
 * ⚠️ این ماژول فقط سمت سرور اجرا می‌شود: `apiFetch` با `server-only` علامت
 * خورده و `API_URL` هم یک متغیر محیطی سروری است. مصرف‌کننده‌ی این فایل فقط
 * Route Handler است:
 *
 *     GET /api/search/cabins?city=1&guests=4&price=1000000-8000000&limit=6
 *     → src/app/api/search/cabins/route.ts → searchCabinsFromApi()
 *
 * کلاینت هرگز این فایل را import نمی‌کند؛ از `cabin-search.repository.ts`
 * (که همان مسیر داخلی را صدا می‌زند) عبور می‌کند.
 *
 * نگاشت فیلترهای هسته → پارامترهای API:
 *   destination.type === "city"   → city=<id>
 *   destination.type === "region" → regionId=<id>   (اسلاگ به شناسه‌ی عددی ترجمه می‌شود)
 *   guests                        → guests
 *   budget                        → price=<min>-<max>
 *   limit                         → limit            (تعداد کارت پیش‌نمایش)
 *
 * ⚠️ محدودیت شناخته‌شده: بک‌اند پارامتر تاریخ (`checkIn`/`checkOut`) ندارد.
 * ارسال آن‌ها نتیجه را تغییر نمی‌دهد، پس عمداً فرستاده نمی‌شوند و تاریخ‌ها
 * فقط در UI و خلاصه‌ی جستجو می‌مانند. وقتی بک‌اند تقویم/موجودی گرفت، فقط
 * همین‌جا دو خط اضافه می‌شود و بقیه‌ی زنجیره دست نمی‌خورد.
 */

import "server-only";

import { queryCabins } from "@/features/cabins/api/getCabins";
import { formatPriceRange } from "@/libs/utils/price-range";
import { regionIdFromSlug } from "../constants/regions";
import {
  SEARCH_PREVIEW_LIMIT,
  type CabinSearchQuery,
  type CabinSearchResult,
} from "../types/search.types";

/**
 * جستجوی اقامتگاه روی API بک‌اند.
 *
 * `total` از `meta.totalItems` می‌آید؛ یعنی «تعداد کل نتایج پس از فیلتر»
 * (نه طول آرایه‌ی برگشتی). این دقیقاً همان چیزی است که CTA پیش‌نمایش
 * («مشاهده همه N اقامتگاه») لازم دارد، در حالی که آرایه به `limit` محدود است.
 */
export async function searchCabinsFromApi(
  query: CabinSearchQuery,
): Promise<CabinSearchResult> {
  const { destination, guests, budget, limit } = query;

  const { cabins, meta } = await queryCabins({
    city: destination?.type === "city" ? destination.id : undefined,
    regionId:
      destination?.type === "region"
        ? regionIdFromSlug(destination.id)
        : undefined,
    guests: guests ?? undefined,
    price: budget ? formatPriceRange(budget.min, budget.max) : undefined,
    limit: limit ?? SEARCH_PREVIEW_LIMIT,
    page: 1,
  });

  return { cabins, total: meta.totalItems };
}
