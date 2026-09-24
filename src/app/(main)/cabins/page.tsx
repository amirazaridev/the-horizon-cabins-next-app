import { Metadata } from "next";
import { Suspense } from "react";

import CabinList from "@/features/cabins/components/CabinList";
import CabinsExplorer from "@/features/cabins/components/CabinsExplorer";
import Spinner from "@/components/ui/Spinner";

import { getCabins } from "@/features/cabins/api";
import {
  applyCabinFilters,
  buildCabinFilterOptions,
  parseCabinFilters,
} from "@/features/cabins/utils/cabin-filters";

export const metadata: Metadata = {
  title: "سوئیت‌های لوکس | هورایزن کابینز",
  description:
    "مجموعه کامل سوئیت‌ها و اقامتگاه‌های لوکس در طبیعت ایران؛ از سوئیت‌های چوبی جنگل‌های هیرکانی تا اقامتگاه‌های ساحلی خزر.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CabinsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = parseCabinFilters(await searchParams);

  const cabins = await getCabins();
  const filterOptions = buildCabinFilterOptions(cabins);
  const resultCount = applyCabinFilters(cabins, filters).length;

  return (
    <section className="bg-background min-h-screen">
      <CabinsExplorer resultCount={resultCount} filterOptions={filterOptions}>
        <Suspense
          fallback={<Spinner size="lg" label="درحال بارگزاری ..." fullWidth />}
          key={JSON.stringify(filters)}
        >
          <CabinList filters={filters} />
        </Suspense>
      </CabinsExplorer>
    </section>
  );
}
