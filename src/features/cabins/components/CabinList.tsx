import CabinCard from "@/features/cabins/components/CabinCard";
import { getCabins } from "../api";
import { applyCabinFilters, type CabinFilters } from "../lib/cabin-filters";
import CabinNotFound from "./CabinNotFound";

interface CabinListProps {
  filters: CabinFilters;
  className?: string;
}

export default async function CabinList({
  filters,
  className = "",
}: CabinListProps) {
  const cabins = await getCabins();
  const filteredCabin = applyCabinFilters(cabins, filters);

  if (!filteredCabin.length) {
    return <CabinNotFound />;
  }

  return (
    <div
      className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 px-3 ${className} `}
    >
      {filteredCabin.map((cabin) => (
        <CabinCard
          key={cabin.id}
          cabin={cabin}
          href={`/cabins/${cabin.id}`}
          animation="hover"
        />
      ))}
    </div>
  );
}
