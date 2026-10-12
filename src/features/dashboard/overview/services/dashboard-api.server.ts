import "server-only";

import { fetchFilterOptions } from "../../shared/api/filter-options.api";
import type {
  DashboardCabin,
  DashboardCity,
} from "../types/dashboard.types";
import type { DashboardFilterOptions } from "../data/dashboard.repository";

/**
 * خواندن گزینه‌های فیلتر داشبورد از بک‌اند — **سرور-ساید**.
 *
 * صفحه‌ی `dashboard/page.tsx` (Server Component) این تابع را صدا می‌زند تا
 * dropdown شهر/اقامتگاه مستقل از بازه‌ی تاریخ آماده باشد.
 *
 * ⭐ واکشی خام شهر/اقامتگاه در `../../shared/api/filter-options.api` است
 * (مشترک با سرویس صفحه‌ی رزروها)؛ این‌جا فقط نگاشت به شکل دامنه‌ی داشبورد.
 *
 * ⚠️ `GET /cabins` فیلد `cityId` را حذف می‌کند (فقط `city` را می‌دهد)، پس
 * این‌جا `cityId` را از `city.id` بازمی‌سازیم تا شکل `DashboardCabin` کامل
 * شود.
 */

/** اقامتگاه همان‌طور که از `GET /cabins` می‌آید — بدون `cityId`. */
type CabinFromApi = Omit<DashboardCabin, "cityId">;

export async function fetchDashboardFilterOptions(): Promise<DashboardFilterOptions> {
  const { cities, cabins } = await fetchFilterOptions<
    DashboardCity,
    CabinFromApi
  >();

  return {
    cities,
    cabins: cabins.map((cabin) => ({
      ...cabin,
      cityId: cabin.city?.id ?? 0,
    })),
  };
}
