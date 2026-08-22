import CabinCard from "@/components/ui/CabinCard";
import { getCabins, filterCabins } from "../lib/data-service";

interface CabinListProps {
  filter: string;
}

export default async function CabinList({ filter }: CabinListProps) {
  const cabins = await getCabins();
  const filteredCabin = filterCabins(cabins, filter);

  if (!filteredCabin.length) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 text-6xl">🏔️</div>
        <h3 className="mb-2 text-xl font-semibold text-white">
          کابینی یافت نشد
        </h3>
        <p className="text-white/50">
          برای این دسته‌بندی کابینی موجود نیست. فیلتر را تغییر دهید.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {filteredCabin.map((cabin) => (
        <CabinCard
          key={cabin.id}
          name={cabin.name}
          price={`$${cabin.price}`}
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
