import Spinner from "@/components/ui/Spinner";
import { getCities } from "@/features/cabins/api/getCities";
import MainPageLayout from "@/features/dashboard/main/MainPageLayout";
import { Suspense } from "react";

export const metadata = { title: "داشبورد ادمین هورایزن" };

async function page() {
  const cities = await getCities();

  return (
    <>
      <div>
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center">
              <Spinner fullWidth size="xl" />
            </div>
          }
        >
          <MainPageLayout cities={cities} />
        </Suspense>
      </div>
    </>
  );
}

export default page;
