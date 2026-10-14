import "server-only";

import { fetchFilterOptions } from "../../shared/api/filter-options.api";
import type {
  DashboardCabin,
  DashboardCity,
} from "../types/dashboard.types";
import type { DashboardFilterOptions } from "../data/dashboard.repository";

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
