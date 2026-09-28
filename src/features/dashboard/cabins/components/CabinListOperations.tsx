import { type ReactNode } from "react";
import { getAmenities, getCities } from "@/features/cabins/api";
import type { CabinsSearchParams } from "../lib/operations";
import CabinDashboardFilters from "./CabinDashboardFilters";

interface CabinListOperationsProps {
  searchParams: CabinsSearchParams;
}

export default async function CabinListOperations({
  searchParams,
}: CabinListOperationsProps): Promise<ReactNode> {
  const [cities, amenities] = await Promise.all([getCities(), getAmenities()]);

  return (
    <CabinDashboardFilters
      cities={cities}
      amenities={amenities}
      searchParams={searchParams}
    />
  );
}
