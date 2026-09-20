import Spinner from "@/components/ui/Spinner";
import { DASHBOARD_CITIES } from "@/features/dashboard/main/data/mock-data";
import MainPageLayout from "@/features/dashboard/main/MainPageLayout";
import { Suspense } from "react";

export const metadata = { title: "داشبورد ادمین هورایزن" };

function page() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner fullWidth size="xl" />
          </div>
        }
      >
        <MainPageLayout cities={DASHBOARD_CITIES} />
      </Suspense>
    </div>
  );
}

export default page;