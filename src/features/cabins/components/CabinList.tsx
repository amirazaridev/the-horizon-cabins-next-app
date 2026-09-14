import CabinCard from "@/features/cabins/components/CabinCard";
import { getCabins, filterCabins } from "../lib/data-service";
import CabinNotFound from "./CabinNotFound";

interface CabinListProps {
  filter: string;
}

export default async function CabinList({ filter }: CabinListProps) {
  const cabins = await getCabins();
  const filteredCabin = filterCabins(cabins, filter);

  if (!filteredCabin?.length) {
    return <CabinNotFound />
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 px-10">
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
