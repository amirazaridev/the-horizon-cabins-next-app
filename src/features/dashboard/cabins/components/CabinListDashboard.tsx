import CabinCard from "@/features/cabins/components/CabinCard";
import { getCabins } from "@/features/cabins/api";
import CabinCardMenu from "./CabinCardMenu";
import {
  applyCabinsOperations,
  type CabinsSearchParams,
} from "../lib/operations";
import CabinNotFound from "@/features/cabins/components/CabinNotFound";

interface CabinListDashboardProps {
  searchParams: Promise<CabinsSearchParams>;
}

export default async function CabinListDashboard({
  searchParams,
}: CabinListDashboardProps) {
  const params = await searchParams;
  const cabins = applyCabinsOperations(await getCabins(), params);

  if (cabins.length === 0) {
    return <CabinNotFound />;
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {cabins.map((cabin) => (
        <CabinCard
          key={cabin.id}
          cabin={cabin}
          variant="dashboard"
          animation="none"
        >
          <CabinCardMenu cabinId={cabin.id} />
        </CabinCard>
      ))}
    </div>
  );
}
