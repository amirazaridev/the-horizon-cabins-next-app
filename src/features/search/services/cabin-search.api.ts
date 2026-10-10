/**
 * آداپتور API واقعی جستجوی اقامتگاه — لایه‌ی سرور.
 *
 * ⚠️ این ماژول فقط سمت سرور اجرا می‌شود: `apiFetch` با `server-only` علامت
 * خورده و `API_URL` هم یک متغیر محیطی سروری است. مصرف‌کننده‌ی این فایل فقط
 * Route Handler است:
 *
 *     GET /api/search/cabins?city=1&guests=4&checkIn=2026-10-15&checkOut=2026-10-18
 *     → src/app/api/search/cabins/route.ts → searchCabinsFromApi()
 *
 * کلاینت هرگز این فایل را import نمی‌کند؛ از `cabin-search.repository.ts`
 * (که همان مسیر داخلی را صدا می‌زند) عبور می‌کند.
 *
 * نگاشت فیلترهای هسته → پارامترهای API:
 *   destination.type === "city"   → city=<id>
 *   destination.type === "region" → regionId=<id>   (اسلاگ به شناسه‌ی عددی ترجمه می‌شود)
 *   guests                        → guests
 *   checkIn / checkOut            → startDate / endDate   (میلادی `yyyy-MM-dd`)
 *   budget (بدون تاریخ)           → price=<min>-<max>      (بودجه‌ی هر شب)
 *   budget (با تاریخ)             → totalPrice=<min>-<max> (بودجه‌ی کل سفر)
 *   limit                         → limit            (تعداد کارت پیش‌نمایش)
 *
 * ⭐ وقتی تاریخ می‌فرستیم، بک‌اند علاوه بر فیلترها فقط ویلاهای **آزاد** در آن
 * بازه را برمی‌گرداند و `pricing.mode === "stay"` (شامل `totalPrice` = جمع
 * قیمت شب‌های اقامت) را کنار هر ویلا می‌گذارد.
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
  const { destination, guests, budget, limit, checkIn, checkOut } = query;

  /*
   * «دارای اقامت» یعنی **هر دو** تاریخ موجود باشند. بک‌اند فقط یکی از دو
   * تاریخ را با ۴۰۰ رد می‌کند، پس با بازه‌ی ناقص هیچ تاریخی نمی‌فرستیم و
   * بودجه هم در حالت «هر شب» می‌ماند (تصمیم پروژه).
   */
  const hasStay = checkIn !== null && checkOut !== null;

  const { cabins, meta } = await queryCabins({
    city: destination?.type === "city" ? destination.id : undefined,
    regionId:
      destination?.type === "region"
        ? regionIdFromSlug(destination.id)
        : undefined,
    guests: guests ?? undefined,
    startDate: hasStay ? checkIn : undefined,
    endDate: hasStay ? checkOut : undefined,
    //* بودجه با تاریخ یعنی «کل سفر»؛ بدون تاریخ یعنی «هر شب».
    price:
      budget && !hasStay ? formatPriceRange(budget.min, budget.max) : undefined,
    totalPrice:
      budget && hasStay ? formatPriceRange(budget.min, budget.max) : undefined,
    limit: limit ?? SEARCH_PREVIEW_LIMIT,
    page: 1,
  });

  return { cabins, total: meta.totalItems };
}
