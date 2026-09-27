import { type ReactNode } from "react";
import { getAmenities, getCities } from "@/features/cabins/api";
import CabinDashboardFilters from "./CabinDashboardFilters";

export default async function CabinListOperations(): Promise<ReactNode> {
  const [cities, amenities] = await Promise.all([getCities(), getAmenities()]);

  return <CabinDashboardFilters cities={cities} amenities={amenities} />;
}