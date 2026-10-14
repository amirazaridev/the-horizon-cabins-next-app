import "server-only";

import { queryCabins } from "@/features/cabins/api/getCabins";
import { regionIdFromSlug } from "@/features/search/constants/regions";
import { SEARCH_PREVIEW_LIMIT } from "@/features/search/constants/search-limits";
import type {
  CabinSearchQuery,
  CabinSearchResult,
} from "@/features/search/types/search.types";
import { formatPriceRange } from "@/libs/utils/price-range";

//* `total` از `meta.totalItems` می‌آید — تعداد کل پس از فیلتر، نه طول آرایه‌ی محدودشده؛ همان چیزی که CTA «مشاهده همه N اقامتگاه» لازم دارد.
export async function searchCabinsFromApi(
  query: CabinSearchQuery,
): Promise<CabinSearchResult> {
  const { destination, guests, budget, limit, checkIn, checkOut } = query;

  //* «دارای اقامت» = **هر دو** تاریخ موجود. بک‌اند فقط یکی از دو تاریخ را با ۴۰۰ رد می‌کند، پس با بازه‌ی ناقص هیچ تاریخی نمی‌فرستیم و بودجه در حالت «هر شب» می‌ماند.
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
