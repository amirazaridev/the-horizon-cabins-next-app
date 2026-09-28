import CabinCard from "@/features/cabins/components/CabinCard";
import { queryCabins } from "@/features/cabins/api";
import CabinCardMenu from "./CabinCardMenu";
import {
  buildCabinsQuery,
  parseSortParam,
  sortCabins,
  type CabinsSearchParams,
} from "../lib/operations";
import CabinNotFound from "@/features/cabins/components/CabinNotFound";
import { Pagination } from "@/components/ui/Pagination";

interface CabinListDashboardProps {
  searchParams: CabinsSearchParams;
}

export default async function CabinListDashboard({
  searchParams,
}: CabinListDashboardProps) {
  // فیلترها در بکند اعمال میشوند؛ فقط مرتبسازی بهصورت محلی انجام میشود
  const { cabins, meta } = await queryCabins(buildCabinsQuery(searchParams));
  const sortedCabins = sortCabins(cabins ?? [], parseSortParam(searchParams));

  if (sortedCabins.length === 0) {
    return <CabinNotFound />;
  }

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {sortedCabins.map((cabin) => (
          <CabinCard
            key={cabin.id}
            cabin={cabin}
            variant="dashboard"
            animation="none"
          >
            <CabinCardMenu cabinId={cabin.id} cabinName={cabin.name} />
          </CabinCard>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={meta.currentPage}
          totalPages={meta.totalPages}
          basePath="/dashboard/cabins"
          searchParams={searchParams}
          dir="rtl"
          scroll={false}
        />
      </div>
    </>
  );
}
