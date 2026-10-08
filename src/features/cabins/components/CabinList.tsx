import CabinCard from "@/features/cabins/components/CabinCard";
import CabinNotFound from "./CabinNotFound";
import { Pagination } from "@/components/ui/Pagination";
import type { SearchParamsInput } from "@/libs/utils/pagination";
import type { Cabin } from "../types/cabin.types";
import type { PaginationMeta } from "@/types/api-response";

interface CabinListProps {
  cabins: Cabin[];
  meta: PaginationMeta;
  searchParams: SearchParamsInput;
  className?: string;
}

export default function CabinList({
  cabins,
  meta,
  searchParams,
  className = "",
}: CabinListProps) {
  if (!cabins.length) {
    return <CabinNotFound />;
  }

  return (
    <>
      <div
        className={`grid grid-cols-1 gap-5 px-3 sm:grid-cols-2 lg:grid-cols-3 ${className} `}
      >
        {cabins.map((cabin) => (
          <CabinCard
            key={cabin.id}
            cabin={cabin}
            href={`/cabins/${cabin.id}`}
            animation="hover"
            /* قلب علاقه‌مندی فقط روی کارت صفحه‌ی «اقامتگاه‌ها». */
            showFavorite
          />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={meta.currentPage}
          totalPages={meta.totalPages}
          basePath="/cabins"
          searchParams={searchParams}
          dir="rtl"
          scroll={false}
        />
      </div>
    </>
  );
}
