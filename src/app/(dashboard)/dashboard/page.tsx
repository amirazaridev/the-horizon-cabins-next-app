import { DASHBOARD_CITIES } from "@/features/dashboard/overview/data/mock-data";
import MainPageLayout from "@/features/dashboard/overview/MainPageLayout";
import OverviewSkeleton from "@/features/dashboard/overview/components/OverviewSkeleton";
import { Suspense } from "react";

export const metadata = { title: "صفحه اصلی" };

function page() {
  return (
    <div>
      <Suspense fallback={<OverviewSkeleton />}>
        <MainPageLayout cities={DASHBOARD_CITIES} />
      </Suspense>
    </div>
  );
}

export default page;
