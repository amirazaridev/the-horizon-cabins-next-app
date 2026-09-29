/**
 * قرارداد repository جستجوی اقامتگاه.
 *
 * ═══════════════════════════════════════════════════════════════════
 *  نقطه‌ی واحد تعویض Mock → API  ←  همین فایل، همین خط پایین
 * ═══════════════════════════════════════════════════════════════════
 *
 *  امروز:  export const cabinSearchRepository = mockCabinSearchRepository
 *  فردا:   export const cabinSearchRepository = apiCabinSearchRepository
 *
 * هیچ کامپوننتی (SearchPreview, CabinCard, SearchBar, …) نمی‌داند داده از
 * کجا می‌آید؛ همه فقط `cabinSearchRepository.search(...)` را صدا می‌زنند.
 */

import { regionOfCityName } from "../data/destinations.mock";
import { MOCK_CABINS } from "../data/cabins.mock";
import { finalNightPrice } from "@/features/cabins/utils/cabin-filters";
import type {
  CabinSearchQuery,
  CabinSearchResult,
  Destination,
} from "../types/search.types";

export interface CabinSearchRepository {
  search(query: CabinSearchQuery): Promise<CabinSearchResult>;
}

/* ------------------------------------------------------------------ */
/* منطق تطبیق (فقط داخل آداپتور ماک — هیچ‌وقت در UI)                    */
/* ------------------------------------------------------------------ */

function matchesDestination(
  cabinCityName: string | undefined,
  destination: Destination,
): boolean {
  if (!cabinCityName) return false;

  if (destination.type === "region") {
    return regionOfCityName(cabinCityName) === destination.id;
  }

  // تطبیق با شناسه یا نام — تا قبل و بعد از اتصال API یکسان کار کند
  return cabinCityName === destination.name;
}

/** پاک‌سازی پارامترهای اختیاری */
function normalize(query: CabinSearchQuery) {
  return {
    destination: query.destination ?? null,
    guests: typeof query.guests === "number" ? query.guests : null,
    maxPrice: typeof query.maxPrice === "number" ? query.maxPrice : null,
    limit: query.limit ?? 6,
  };
}

export const mockCabinSearchRepository: CabinSearchRepository = {
  async search(query) {
    const { destination, guests, maxPrice, limit } = normalize(query);

    // ⚠️ بک‌اند فعلی موجودی/تقویم ندارد؛ پس روی تاریخ فیلتر نمی‌کنیم
    // (به‌جای ادعای الکی، فقط فیلترهای قابل‌پشتیبانی اعمال می‌شوند).
    const filtered = MOCK_CABINS.filter((cabin) => {
      if (destination && !matchesDestination(cabin.city?.name, destination)) {
        return false;
      }
      if (guests !== null && cabin.maxCapacity < guests) return false;
      if (maxPrice !== null && finalNightPrice(cabin) > maxPrice) return false;
      return true;
    });

    // تأخیر کوچک تا حالت Loading واقعی حس شود (شبیه‌سازی شبکه)
    await new Promise((resolve) => setTimeout(resolve, 320));

    return {
      cabins: filtered.slice(0, limit),
      total: filtered.length,
      source: "mock",
    };
  },
};

/**
 * آداپتور واقعی (فعال‌نشده).
 *
 * وقتی endpoint جستجو آماده شد:
 *  1) این فایل را به `cabin-search.api.ts` منتقل کنید (چون `apiFetch`
 *     با `server-only` علامت خورده و نباید در باندل کلاینت بیاید)،
 *  2) یا این پیاده‌سازی را جای `mockCabinSearchRepository` بگذارید.
 *
 * نگاشت‌های لازم در همان نقطه انجام می‌شود و UI دست نمی‌خورد.
 */
export const cabinSearchRepository: CabinSearchRepository =
  mockCabinSearchRepository;
