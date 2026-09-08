import CabinCard from "@/features/cabins/components/CabinCard";
import { getCabins, filterCabins } from "../lib/data-service";
import { notFound } from "next/navigation";

interface CabinListProps {
  filter: string;
}

export default async function CabinList({ filter }: CabinListProps) {
  const cabins = await getCabins();
  const filteredCabin = filterCabins(cabins, filter);

  if (!filteredCabin?.length) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 text-6xl">🏔️</div>
        <h3 className="text-text mb-2 text-xl font-semibold">
          اقامتگاهی یافت نشد
        </h3>
        <p className="text-text-gray">
          برای این دسته‌بندی اقامتگاهی موجود نیست. فیلتر را تغییر دهید.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
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
