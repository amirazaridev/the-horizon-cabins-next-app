import { Suspense } from "react";

import MainPageLayout from "@/features/dashboard/overview/MainPageLayout";
import OverviewSkeleton from "@/features/dashboard/overview/components/OverviewSkeleton";
import { fetchDashboardFilterOptions } from "@/features/dashboard/overview/services/dashboard-api.server";

export const metadata = { title: "صفحه اصلی" };

/**
 * صفحه‌ی «داشبورد».
 *
 * ⚠️ گزینه‌های فیلتر (شهر/اقامتگاه) از **API بک‌اند** و سرور-ساید می‌آیند.
 * داده‌ی خودِ ویجت‌ها در کلاینت از `/api/dashboard/snapshot` (که خودش به
 * `GET /dashboard/snapshot` بک‌اند می‌زند) خوانده می‌شود.
 */
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
