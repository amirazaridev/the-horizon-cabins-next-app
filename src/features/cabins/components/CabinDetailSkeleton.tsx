import type { ReactNode } from "react";

import Skeleton from "@/components/ui/Skeleton";

/** یک خط متن: ظرفی هم‌ارتفاع line-height متن واقعی + میله‌ای نازک‌تر در مرکز */
function Line({
  lineClassName,
  barClassName,
}: {
  lineClassName: string;
  barClassName: string;
}): ReactNode {
  return (
    <div className={`flex items-center ${lineClassName}`}>
      <Skeleton className={`rounded-full ${barClassName}`} />
    </div>
  );
}

/**
 * اسکلتون هم‌ساختار صفحه‌ی جزئیات اقامتگاه (`CabinDetail`).
 *
 * همان نسبت‌های گالری (`aspect-square` → `sm:aspect-video` →
 * `lg:aspect-21/9`)، همان گرید بندانگشتی‌ها، همان گرید مشخصات
 * (`grid-cols-2 lg:grid-cols-4`) و همان `min-h-105` پنل تاریخ؛ پس عبور از
 * حالت لودینگ به محتوا هیچ جهشی در چیدمان ایجاد نمی‌کند.
 */
export default function CabinDetailSkeleton(): ReactNode {
  return (
    <div>
      {/* گالری */}
      <div className="border-foreground/5 relative overflow-hidden rounded-3xl border">
        <Skeleton className="aspect-square w-full sm:aspect-video lg:aspect-21/9" />

        {/* هدر روی گالری (GalleryHeader) */}
        <div className="absolute right-5 bottom-5 left-5 flex flex-wrap items-end justify-between gap-4 sm:right-8 sm:bottom-8 sm:left-8">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-7 w-28 rounded-full" />
            <Skeleton className="h-9 w-56 rounded-full sm:h-10 sm:w-72 md:h-12" />
          </div>
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
      </div>

      {/* بندانگشتی‌های گالری */}
      <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="aspect-video w-full rounded-xl" />
        ))}
      </div>

      {/* مشخصات (SpecsGrid) */}
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="border-foreground/5 bg-surface-raised/50 rounded-2xl border p-8 text-center"
          >
            <Skeleton className="mx-auto mb-3 size-6 rounded-md" />
            <Line lineClassName="h-8 justify-center" barClassName="h-5 w-16" />
            <Line
              lineClassName="mt-1 h-5 justify-center"
              barClassName="h-3.5 w-20"
            />
          </div>
        ))}
      </div>

      <div className="mt-12 space-y-10">
        {/* توضیحات (CabinDescription) */}
        <div>
          <Line lineClassName="mb-4 h-7" barClassName="h-5 w-40" />
          <div className="flex flex-col gap-2">
            <Line lineClassName="h-8" barClassName="h-4 w-full" />
            <Line lineClassName="h-8" barClassName="h-4 w-11/12" />
            <Line lineClassName="h-8" barClassName="h-4 w-3/4" />
          </div>

          <Line lineClassName="mt-10 mb-5 h-7" barClassName="h-5 w-24" />
          <div className="flex flex-wrap gap-2.5">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </div>

        {/* پنل تاریخ + پنل رزرو */}
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="border-foreground/10 bg-surface/60 min-h-105 overflow-hidden rounded-3xl border lg:col-span-3">
            <div className="border-foreground/5 flex items-center gap-3 border-b px-6 py-4">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="h-5 w-36 rounded-full" />
            </div>
            <div className="p-6">
              <Skeleton className="h-56 w-full rounded-2xl" />
            </div>
          </div>

          <div className="border-foreground/10 bg-surface/60 min-h-105 rounded-3xl border p-6 lg:col-span-2">
            <Line lineClassName="mb-6 h-6" barClassName="h-4 w-28" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <div className="mt-5 flex flex-col gap-3">
              <Skeleton className="h-5 w-4/5 rounded-full" />
              <Skeleton className="h-5 w-3/5 rounded-full" />
              <Skeleton className="h-5 w-2/3 rounded-full" />
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
