import { Metadata } from "next";
import { Suspense } from "react";

import CabinList from "@/features/cabins/components/CabinList";
import CabinCardsSkeleton from "@/features/cabins/components/CabinCardsSkeleton";
import CabinsExplorer from "@/features/cabins/components/CabinsExplorer";

import {
  getAmenities,
  getCities,
  getRegions,
  queryCabins,
} from "@/features/cabins/api";
import { parseCabinFilters } from "@/features/cabins/utils/cabin-filters";
import { regionIdFromSlug, toSearchRegions } from "@/features/search/constants/regions";
import { parseLimitParam, parsePageParam } from "@/libs/utils/pagination";

export const metadata: Metadata = {
  title: "اقامتگاه‌ها",
  description:
    "مجموعه کامل سوئیت‌ها و اقامتگاه‌های لوکس در طبیعت ایران؛ از سوئیت‌های چوبی جنگل‌های هیرکانی تا اقامتگاه‌های ساحلی خزر.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CabinsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const filters = parseCabinFilters(sp);

  const page = parsePageParam(sp);
  const limit = parseLimitParam(sp.limit);

  const [{ cabins, meta }, cities, apiRegions, amenities] = await Promise.all([
    queryCabins({
      page,
      limit,
      category: filters.category,
      guests: filters.guests,
      bedrooms: filters.bedrooms,
      amenities: filters.amenities?.join(","),
      // بازه‌ی بودجه‌ی سرچ، همان قرارداد `lo-hi` فیلتر قیمت است
      price: filters.price
        ? `${filters.price[0]}-${filters.price[1]}`
        : undefined,
      city: filters.cityId,
      // بک‌اند پارامتر عددی `regionId` را می‌پذیرد، نه اسلاگِ `region`
      regionId: regionIdFromSlug(filters.region),
    }),
    getCities(),
    getRegions(),
    getAmenities(),
  ]);

  const regions = toSearchRegions(apiRegions);

  return (
    <section className="bg-background min-h-screen">
      <CabinsExplorer
        cities={cities}
        regions={regions}
        amenities={amenities}
        resultCount={meta.totalItems}
        searchParams={sp}
      >
        <Suspense
          fallback={
            <CabinCardsSkeleton
              count={limit}
              gridClassName="grid grid-cols-1 gap-5 px-3 sm:grid-cols-2 lg:grid-cols-3"
            />
          }
          key={JSON.stringify(filters) + page + limit}
        >
          <CabinList cabins={cabins} meta={meta} searchParams={sp} />
        </Suspense>
      </CabinsExplorer>
    </section>
  );
}
