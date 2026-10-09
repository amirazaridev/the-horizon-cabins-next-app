/**
 * Route Handler جستجوی اقامتگاه — پروکسی داخلی به API بک‌اند.
 *
 *     GET /api/search/cabins?city=1&guests=4&checkIn=2026-10-15&checkOut=2026-10-18&totalPrice=15000000-30000000&limit=6
 *
 * چرا Route Handler و نه fetch مستقیم در کلاینت؟
 *  - `apiFetch` با `server-only` علامت خورده و `API_URL` یک متغیر محیطی
 *    سروری است؛ پس کلاینت نه می‌تواند و نه باید مستقیم به بک‌اند بزند.
 *  - با این پروکسی، آدرس بک‌اند و کلیدها هرگز به باندل مرورگر نمی‌رسند و
 *    درگیر CORS هم نمی‌شویم.
 *
 * قرارداد پارامترها همان `search-params.ts` است (`city`, `region`, `checkIn`,
 * `checkOut`, `guests`, `price`/`totalPrice`, `limit`)؛ این فایل هیچ نام
 * پارامتری را از خودش نمی‌سازد. پارامترهای ناشناخته/نامعتبر توسط
 * `parseSearchFilters` بی‌اثر می‌شوند.
 *
 * پاسخ: `{ cabins: CabinDto[], total: number }` — تاریخ‌ها به‌صورت ISO
 * رشته‌ای می‌شوند (طبیعت JSON)، پس مصرف‌کننده‌ی کلاینت آن‌ها را با
 * `mapCabin` دوباره به `Date` برمی‌گرداند.
 */

import { type NextRequest } from "next/server";

import { safeParseNumber } from "@/features/cabins/utils/safeParseNumber";
import { searchCabinsFromApi } from "@/features/search/services/cabin-search.api";
import { SEARCH_PREVIEW_LIMIT } from "@/features/search/types/search.types";
import {
  parseSearchFilters,
  toCabinSearchQuery,
} from "@/features/search/utils/search-params";

/** سقف سخت‌گیرانه برای `limit` تا کسی نتواند کل دیتاست را از این مسیر بکشد */
const MAX_LIMIT = 24;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const filters = parseSearchFilters(searchParams);
  const limit =
    safeParseNumber(
      searchParams.get("limit") ?? undefined,
      1,
      MAX_LIMIT,
    ) ?? SEARCH_PREVIEW_LIMIT;

  try {
    const result = await searchCabinsFromApi(
      toCabinSearchQuery(filters, limit),
    );

    return Response.json(result);
  } catch {
    return Response.json(
      { message: "دریافت نتایج جستجو ناموفق بود." },
      { status: 502 },
    );
  }
}
