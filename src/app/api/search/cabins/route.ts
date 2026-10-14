import { type NextRequest } from "next/server";

import { safeParseNumber } from "@/features/cabins/utils/safeParseNumber";
import { searchCabinsFromApi } from "@/features/search/services/cabin-search.api";
import { SEARCH_PREVIEW_LIMIT } from "@/features/search/constants/search-limits";
import {
  parseSearchFilters,
  toCabinSearchQuery,
} from "@/features/search/utils/search-params";

//* سقف سخت‌گیرانه برای `limit` تا کسی نتواند کل دیتاست را از این مسیر بکشد 
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
