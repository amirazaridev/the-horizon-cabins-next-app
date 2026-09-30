import { type ReactNode } from "react";
import { getAmenities, getCities, getRegions } from "@/features/cabins/api";
import { toSearchRegions } from "@/features/search/constants/regions";
import type { CabinsSearchParams } from "../lib/operations";
import CabinDashboardFilters from "./CabinDashboardFilters";

interface CabinListOperationsProps {
  searchParams: CabinsSearchParams;
}

export default async function CabinListOperations({
  searchParams,
}: CabinListOperationsProps): Promise<ReactNode> {
  const [cities, apiRegions, amenities] = await Promise.all([
    getCities(),
    getRegions(),
    getAmenities(),
  ]);

  return (
    <CabinDashboardFilters
      cities={cities}
      regions={toSearchRegions(apiRegions)}
      amenities={amenities}
      searchParams={searchParams}
    />
  );
}
