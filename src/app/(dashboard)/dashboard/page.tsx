import { Suspense } from "react";

import MainPageLayout from "@/features/dashboard/overview/MainPageLayout";
import OverviewSkeleton from "@/features/dashboard/overview/components/OverviewSkeleton";
import { fetchDashboardFilterOptions } from "@/features/dashboard/overview/services/dashboard-api.server";

export const metadata = { title: "صفحه اصلی" };

async function page() {
  const { cities, cabins } = await fetchDashboardFilterOptions();

  return (
    <div>
      <Suspense fallback={<OverviewSkeleton />}>
        <MainPageLayout cities={cities} cabins={cabins} />
      </Suspense>
    </div>
  );
}

export default page;
