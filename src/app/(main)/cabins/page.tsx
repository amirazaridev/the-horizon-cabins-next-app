import { Metadata } from "next";
import { Suspense } from "react";

import CabinList from "@/features/cabins/components/CabinList";
import CabinsExplorer from "@/features/cabins/components/CabinsExplorer";
import Spinner from "@/components/ui/Spinner";

import { getAmenities, getCities, queryCabins } from "@/features/cabins/api";
import { parseCabinFilters } from "@/features/cabins/utils/cabin-filters";
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

  const [{ cabins, meta }, cities, amenities] = await Promise.all([
    queryCabins({
      page,
      limit,
      category: filters.category,
      guests: filters.guests,
      bedrooms: filters.bedrooms,
      amenities: filters.amenities?.join(","),
      // بازه‌ی قیمت اولویت دارد؛ وگرنه سقف بودجه‌ی سرچ اصلی به بازه ترجمه می‌شود
      price: filters.price
        ? `${filters.price[0]}-${filters.price[1]}`
        : filters.maxPrice != null
          ? `0-${filters.maxPrice}`
          : undefined,
      city: filters.cityId,
      region: filters.region,
    }),
    getCities(),
    getAmenities(),
  ]);

  return (
    <section className="bg-background min-h-screen">
      <CabinsExplorer
        cities={cities}
        amenities={amenities}
        resultCount={meta.totalItems}
        searchParams={sp}
      >
        <Suspense
          fallback={<Spinner size="lg" label="درحال بارگزاری ..." fullWidth />}
          key={JSON.stringify(filters) + page + limit}
        >
          <CabinList cabins={cabins} meta={meta} searchParams={sp} />
        </Suspense>
      </CabinsExplorer>
    </section>
  );
}