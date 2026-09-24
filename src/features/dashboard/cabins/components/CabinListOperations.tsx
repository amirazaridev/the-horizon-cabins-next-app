import { type ReactNode } from "react";
import { getCabins } from "@/features/cabins/api";
import { buildCabinFilterOptions } from "@/features/cabins/utils/cabin-filters";
import CabinDashboardFilters from "./CabinDashboardFilters";

export default async function CabinListOperations(): Promise<ReactNode> {
  const cabins = await getCabins();
  const options = buildCabinFilterOptions(cabins);

  return <CabinDashboardFilters options={options} />;
}
