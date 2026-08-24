import CabinCard from "@/components/ui/CabinCard";
import { getCabins, filterCabins } from "../lib/data-service";
import { notFound } from "next/navigation";

interface CabinListProps {
  filter: string;
}

export default async function CabinList({ filter }: CabinListProps) {
  const cabins = await getCabins();
  const filteredCabin = filterCabins(cabins, filter);

  if (!filteredCabin.length) {
    return notFound();
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {filteredCabin.map((cabin) => (
        <CabinCard
          key={cabin.id}
          name={cabin.name}
          price={cabin.price}
          discount={cabin.discount}
          capacity={cabin.maxCapacity}
          image={cabin.image}
          imageAlt={cabin.name}
          features={cabin.features}
          size={`${cabin.size} متر مربع`}
          href={`/cabins/${cabin.id}`}
          animation="hover"
        />
      ))}
    </div>
  );
}
