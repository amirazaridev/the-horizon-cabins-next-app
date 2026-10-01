import { Suspense, type ReactNode } from "react";

import AddCabin from "@/features/dashboard/cabins/components/AddCabin";
import CabinListOperations from "@/features/dashboard/cabins/components/CabinListOperations";
import CabinListDashboard from "@/features/dashboard/cabins/components/CabinListDashboard";
import CabinCardsSkeleton from "@/features/cabins/components/CabinCardsSkeleton";
import type { CabinsSearchParams } from "@/features/dashboard/cabins/lib/operations";
import { parseLimitParam } from "@/libs/utils/pagination";

export const metadata = { title: "مدیریت اقامتگاهها" };

type SearchParams = Promise<CabinsSearchParams>;

export default async function CabinsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ReactNode> {
  const sp = await searchParams;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-text text-2xl font-bold sm:text-3xl">سوییت‌ها</h2>
          <p className="text-text-gray mt-1 text-sm">
           مدیریت اقامتگاه‌ها و قیمت‌گذاری
          </p>
        </div>
        <AddCabin />
      </div>

      <div className="mt-6">
        <Suspense fallback={null}>
          <CabinListOperations searchParams={sp} />
        </Suspense>
      </div>

      <Suspense
        key={JSON.stringify(sp)}
        fallback={
          <CabinCardsSkeleton
            count={parseLimitParam(sp.limit)}
            variant="dashboard"
            gridClassName="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
          />
        }
      >
        <CabinListDashboard searchParams={sp} />
      </Suspense>
    </div>
  );
}
