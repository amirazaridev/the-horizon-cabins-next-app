import "server-only";

import { authFetch } from "@/libs/api/authFetch";
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
 * ⚠️ `GET /cabins` فیلد `cityId` را حذف می‌کند (فقط `city` را می‌دهد)، پس
 * این‌جا `cityId` را از `city.id` بازمی‌سازیم تا شکل `DashboardCabin` کامل
 * شود.
 */
export async function fetchDashboardFilterOptions(): Promise<DashboardFilterOptions> {
  const [citiesRes, cabinsRes] = await Promise.all([
    authFetch("locations/cities", {
      cache: "force-cache",
      next: { revalidate: 300, tags: ["cities-data"] },
    }),
    authFetch("cabins?limit=100", {
      cache: "force-cache",
      next: { revalidate: 300, tags: ["cabins-data"] },
    }),
  ]);

  if (!citiesRes.ok || !cabinsRes.ok) {
    throw new Error("دریافت گزینه‌های فیلتر داشبورد ناموفق بود.");
  }

  const citiesJson = (await citiesRes.json()) as {
    data?: { cities?: DashboardCity[] };
  };
  const cabinsJson = (await cabinsRes.json()) as {
    data?: { cabins?: (DashboardCabin & { city?: { id: number } })[] };
  };

  const cabins = cabinsJson.data?.cabins ?? [];

  return {
    cities: citiesJson.data?.cities ?? [],
    cabins: cabins.map((cabin) => ({
      ...cabin,
      cityId: cabin.city?.id ?? 0,
    })),
  };
}
