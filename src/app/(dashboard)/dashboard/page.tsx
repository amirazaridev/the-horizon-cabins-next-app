import Spinner from "@/components/ui/Spinner";
import MainPageLayout from "@/features/dashboard/main/MainPageLayout";
import { Suspense } from "react";

export const metadata = { title: "داشبورد ادمین هورایزن" };

function page() {
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
          <MainPageLayout />
        </Suspense>
      </div>
    </>
  );
}

export default page;
