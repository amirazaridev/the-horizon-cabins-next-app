import { Suspense, type ReactNode } from "react";
import AddCabin from "@/features/dashboard/cabins/components/AddCabin";
import CabinListOperations from "@/features/dashboard/cabins/components/CabinListOperations";
import CabinListDashboard from "@/features/dashboard/cabins/components/CabinListDashboard";
import Spinner from "@/components/ui/Spinner";

export const metadata = { title: "سوییت‌ها" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CabinsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ReactNode> {
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
          <CabinListOperations />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        }
      >
        <CabinListDashboard searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
