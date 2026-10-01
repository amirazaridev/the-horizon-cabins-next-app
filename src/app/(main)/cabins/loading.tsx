import type { ReactNode } from "react";

import Skeleton from "@/components/ui/Skeleton";
import CabinCardsSkeleton from "@/features/cabins/components/CabinCardsSkeleton";
import { DEFAULT_CABINS_LIMIT } from "@/constants/cabins";

/**
 * اسکلتون مسیر `/cabins`.
 *
 * همان قالب صفحه‌ی واقعی: نوار جستجو، نوار فیلتر چسبان، سرصفحه‌ی لیست،
 * گرید کارت‌ها و ستون نقشه — تا عبور از حالت لودینگ هیچ جهشی ایجاد نکند.
 */
export default function Loading(): ReactNode {
  return (
    <section className="bg-background min-h-screen">
      {/* نوار جستجو */}
      <div className="bg-background-2 border-foreground/10 border-b">
        <div className="mx-auto max-w-[1800px] px-3 py-3 sm:px-4 lg:px-6">
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      </div>

      {/* نوار فیلتر */}
      <div className="border-foreground/10 bg-background/90 border-b backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1800px] items-center gap-2 px-3 py-2.5 sm:px-4 lg:px-6">
          <Skeleton className="h-12 min-w-0 flex-1 rounded-2xl" />
          <Skeleton className="hidden h-12 w-40 shrink-0 rounded-2xl md:block" />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1800px] items-start gap-6 px-3 py-6 sm:px-4 md:py-7 lg:grid-cols-[minmax(0,1fr)_minmax(360px,40%)] lg:gap-6 lg:px-6 lg:py-8 2xl:gap-8">
        <main className="min-w-0">
          <header className="mb-6 text-right">
            <Skeleton className="mr-auto h-8 w-40 rounded-full sm:h-9" />
            <Skeleton className="mt-2 mr-auto h-5 w-56 rounded-full" />
          </header>

          <CabinCardsSkeleton
            count={DEFAULT_CABINS_LIMIT}
            gridClassName="grid grid-cols-1 gap-5 px-3 sm:grid-cols-2 lg:grid-cols-3"
          />
        </main>

        <aside className="sticky top-37.5 hidden min-w-0 lg:block">
          <Skeleton className="h-[80vh] min-h-120 w-full rounded-3xl" />
        </aside>
      </div>
    </section>
  );
}
