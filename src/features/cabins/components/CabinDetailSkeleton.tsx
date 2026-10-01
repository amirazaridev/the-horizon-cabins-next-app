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

/** کارت‌های رنگی «مشخصات» — هم‌ابعاد `CardContainer variant="default"` */
const SPEC_TILE = "border-foreground/5 bg-surface-raised/50 rounded-2xl border p-8";

/**
 * اسکلتون صفحه‌ی جزئیات اقامتگاه (`/cabins/[cabinId]`).
 *
 * ⚠️ این کامپوننت مستقل و مخصوص همین صفحه است و هیچ ربطی به اسکلتون گرید
 * اقامتگاه‌ها (`CabinCardsSkeleton`) ندارد؛ هر بلوکش آینه‌ی یکی از بخش‌های
 * واقعی `CabinDetail` است:
 *
 *   CabinGallery        → نسبت `aspect-square` → `sm:aspect-video` →
 *                         `lg:aspect-21/9` + گرادیان + دکمه‌های ناوبری
 *   بندانگشتی‌ها        → `grid-cols-4 sm:grid-cols-5 lg:grid-cols-6`
 *   SpecsGrid           → `grid-cols-2 lg:grid-cols-4` با همان پدینگ `p-8`
 *   CabinDescription    → سه بخش: درباره‌ی اقامتگاه، ویژگی‌ها، امکانات
 *   DateSelectorPanel   → `min-h-105 lg:col-span-3`
 *   BookingPanel        → `lg:col-span-2` (همان قاب گرادیانی)
 *   BookingAuthCheck    → `min-h-50 lg:col-span-5`
 *
 * پس عبور از حالت لودینگ به محتوا هیچ جهشی در چیدمان ایجاد نمی‌کند.
 */
export default function CabinDetailSkeleton(): ReactNode {
  return (
    <div>
      {/* ================= گالری (CabinGallery) ================= */}
      <div className="group border-foreground/5 relative overflow-hidden rounded-3xl border">
        <Skeleton className="aspect-square w-full sm:aspect-video lg:aspect-21/9" />

        {/* گرادیان پایین گالری — همان لایه‌ی واقعی */}
        <div
          aria-hidden="true"
          className="from-background via-background/20 pointer-events-none absolute inset-0 bg-linear-to-t to-transparent"
        />

        {/* دکمه‌های ناوبری گالری (size-9 → sm:size-11) */}
        <div className="absolute top-1/2 right-2 -translate-y-1/2 sm:right-6">
          <Skeleton className="size-9 rounded-full sm:size-11" />
        </div>
        <div className="absolute top-1/2 left-2 -translate-y-1/2 sm:left-6">
          <Skeleton className="size-9 rounded-full sm:size-11" />
        </div>

        {/* هدر روی گالری (GalleryHeader) */}
        <div className="absolute right-5 bottom-5 left-5 flex flex-wrap items-end justify-between gap-4 sm:right-8 sm:bottom-8 sm:left-8">
          <div>
            <Skeleton className="mb-3 h-7 w-28 rounded-full" />
            <Skeleton className="h-9 w-56 rounded-full sm:h-10 sm:w-72 md:h-12" />
          </div>
          <Skeleton className="h-10 w-20 rounded-full" />
        </div>
      </div>

      {/* ================= بندانگشتی‌های گالری ================= */}
      <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="aspect-video w-full rounded-xl" />
        ))}
      </div>

      {/* ================= مشخصات (SpecsGrid) ================= */}
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={`${SPEC_TILE} text-center shadow-md`}>
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
        {/* ================= توضیحات (CabinDescription) ================= */}
        <div>
          {/* درباره این اقامتگاه */}
          <Line lineClassName="mb-4 h-7" barClassName="h-5 w-40" />
          <div className="flex flex-col gap-2">
            <Line lineClassName="h-8" barClassName="h-4 w-full" />
            <Line lineClassName="h-8" barClassName="h-4 w-11/12" />
            <Line lineClassName="h-8" barClassName="h-4 w-3/4" />
          </div>

          {/* ویژگی‌ها */}
          <Line lineClassName="mt-10 mb-5 h-7" barClassName="h-5 w-24" />
          <div className="flex flex-wrap gap-2.5">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-24 rounded-full" />
            ))}
          </div>

          {/* امکانات — لیست دوستونه با آیکون */}
          <Line lineClassName="mt-10 mb-5 h-7" barClassName="h-5 w-20" />
          <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="size-6 shrink-0 rounded-full" />
                <Skeleton className="h-3.5 w-32 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* ============ پنل تاریخ + رزرو + ورود به حساب ============ */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* DateSelectorPanel */}
          <div className="border-foreground/10 bg-surface/60 flex h-full min-h-105 flex-col overflow-hidden rounded-3xl border shadow-md backdrop-blur-sm lg:col-span-3">
            <div className="border-foreground/5 flex items-center gap-3 border-b px-6 py-4">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="h-6 w-36 rounded-full" />
            </div>
            <div className="flex flex-1 items-center justify-center p-6">
              <div className="border-foreground/15 flex w-full flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-16 text-center">
                <Skeleton className="mb-4 size-12 rounded-lg" />
                <Skeleton className="h-6 w-40 rounded-full" />
                <Line
                  lineClassName="mt-2 h-6"
                  barClassName="h-3.5 w-64 max-w-full"
                />
                <Line
                  lineClassName="h-6"
                  barClassName="h-3.5 w-52 max-w-full"
                />
              </div>
            </div>
          </div>

          {/* BookingPanel — همان قاب گرادیانی `CardContainer variant="gradient"` */}
          <div className="from-primary-400/40 via-foreground/10 relative rounded-3xl bg-linear-to-br to-transparent p-px lg:col-span-2">
            <div className="bg-surface/80 relative h-full overflow-hidden rounded-3xl p-8 backdrop-blur-sm md:p-10">
              <Line lineClassName="mb-6 h-7" barClassName="h-5 w-28" />

              {/* PriceDisplay */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <Skeleton className="h-10 w-40 rounded-full" />
                  <Skeleton className="h-7 w-20 rounded-full" />
                </div>
                <Line
                  lineClassName="mt-2 h-5"
                  barClassName="h-3.5 w-48"
                />
              </div>

              {/* مزایای رزرو */}
              <div className="border-foreground/10 space-y-3 border-y py-5">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="size-4 shrink-0 rounded-full" />
                    <Skeleton className="h-3.5 w-4/5 rounded-full" />
                  </div>
                ))}
              </div>

              {/* دکمه‌های رزرو (Button size="lg" → ۵۶px) */}
              <div className="relative pt-6">
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                </div>
                <Line
                  lineClassName="mt-4 h-4 justify-center"
                  barClassName="h-3 w-56 max-w-full"
                />
              </div>
            </div>
          </div>

          {/* BookingAuthCheck */}
          <div className="bg-surface/60 border-foreground/10 flex min-h-50 flex-col overflow-hidden rounded-3xl border pb-10 shadow-md backdrop-blur-md md:flex-row-reverse md:pb-0 lg:col-span-5">
            <Skeleton className="mx-auto h-72 w-full max-w-sm shrink-0 md:h-auto md:w-1/3" />
            <div className="flex w-full flex-col gap-y-3 px-9 sm:px-17 md:px-10 md:py-10 lg:justify-center">
              <Line lineClassName="h-8 md:h-9 lg:h-10" barClassName="h-6 w-full" />
              <Line
                lineClassName="h-8 md:h-9 lg:h-10"
                barClassName="h-6 w-3/5"
              />
              <Line lineClassName="mt-1 h-5" barClassName="h-3.5 w-4/5" />
              <div className="mt-2 flex gap-x-2">
                <Skeleton className="h-14 w-44 rounded-xl" />
                <Skeleton className="h-14 w-28 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
