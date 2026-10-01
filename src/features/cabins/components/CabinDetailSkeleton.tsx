import type { ReactNode } from "react";

import Container from "@/components/ui/Container";
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

/** قاب هر سکشن — آینه‌ی `SectionShell`: جداکننده + سرتیتر + بدنه */
function SectionSkeleton({
  children,
  titleWidth = "w-40",
  hintWidth,
}: {
  children: ReactNode;
  titleWidth?: string;
  hintWidth?: string;
}): ReactNode {
  return (
    <section className="border-foreground/10 border-t pt-10">
      <div className="mb-5">
        <Line lineClassName="h-7" barClassName={`h-5 ${titleWidth}`} />
        {hintWidth && (
          <Line lineClassName="mt-1 h-5" barClassName={`h-3.5 ${hintWidth}`} />
        )}
      </div>
      {children}
    </section>
  );
}

/** کارت‌های «مشخصات» — هم‌ابعاد `CardContainer variant="default"` */
const SPEC_TILE =
  "border-foreground/5 bg-surface-raised/50 rounded-2xl border p-8";

/** قاب پنل‌ها — هم‌ابعاد قاب‌های واقعی سکشن‌ها */
const PANEL_FRAME =
  "border-foreground/10 bg-surface/60 overflow-hidden rounded-3xl border shadow-md";

/**
 * اسکلتون صفحه‌ی جزئیات اقامتگاه (`/cabins/[cabinId]`).
 *
 * ⚠️ این کامپوننت مستقل و مخصوص همین صفحه است و هیچ ربطی به اسکلتون گرید
 * اقامتگاه‌ها (`CabinCardsSkeleton`) ندارد؛ هر بلوکش آینه‌ی یکی از بخش‌های
 * واقعی `CabinDetail` است — با همان گرید، همان ارتفاع‌های رزرو‌شده و همان
 * کلاس‌های قاب:
 *
 *   CabinGallery        → `aspect-square` → `sm:aspect-video` →
 *                         `lg:aspect-21/9` + گرادیان + دکمه‌های ناوبری +
 *                         شمارنده‌ی تصویر + هدر روی گالری
 *   بندانگشتی‌ها        → `grid-cols-4 sm:grid-cols-5 lg:grid-cols-6`
 *   StickyTabs          → نوار تب با دکمه‌های `h-11`
 *   سکشن‌ها             → `border-t pt-10` با سرتیتر یکسان
 *   SpecsGrid           → `grid-cols-2 lg:grid-cols-4` با همان پدینگ `p-8`
 *   SpecsGrid           → `grid-cols-2 lg:grid-cols-4` با همان پدینگ `p-8`
 *   AmenitiesSection    → `sm:grid-cols-2` + دکمه‌ی «مشاهده‌ی همه»
 *   CabinDatePicker     → دو فیلد ورود/خروج + تقویم دوقلو + دکمه‌ی حذف
 *   RulesSection        → `md:grid-cols-2`
 *   MapSection          → `aspect-16/9`
 *   ReviewsSection      → خلاصه‌ی امتیاز + `md:grid-cols-2` کارت نظر
 *   BookingAside        → `lg:grid-cols-[minmax(0,1fr)_25rem]`
 *   MobileBookingBar    → نوار ثابت پایین (`lg:hidden`)
 *
 * پس عبور از حالت لودینگ به محتوا هیچ جهشی در چیدمان ایجاد نمی‌کند.
 */
export default function CabinDetailSkeleton(): ReactNode {
  return (
    <>
      {/* ================= گالری (CabinGallery) ================= */}
      <Container variant="cabin-detail">
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

          {/* شمارنده‌ی تصویر */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <Skeleton className="h-7 w-14 rounded-full" />
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

        {/* بندانگشتی‌های گالری */}
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="aspect-video w-full rounded-xl" />
          ))}
        </div>
      </Container>

      {/* ================= نوار تب چسبان (StickyTabs) ================= */}
      <div className="border-foreground/10 bg-background-2/90 sticky top-[var(--hz-navbar-h)] z-30 border-b backdrop-blur-xl">
        <Container variant="cabin-detail">
          <div className="flex gap-1.5 overflow-hidden py-2">
            {[72, 84, 76, 68, 88, 72, 76, 64].map((width, index) => (
              <Skeleton
                key={index}
                className="h-11 shrink-0 rounded-xl"
                style={{ width }}
              />
            ))}
          </div>
        </Container>
      </div>

      {/* ================= بدنه ================= */}
      <Container variant="cabin-detail">
        <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-start lg:gap-8">
          <div className="space-y-10">
            {/* ---------- توضیحات (CabinDescription) ---------- */}
            <SectionSkeleton titleWidth="w-40" hintWidth="w-32">
              <div className="flex flex-col gap-2">
                <Line lineClassName="h-8" barClassName="h-4 w-full" />
                <Line lineClassName="h-8" barClassName="h-4 w-11/12" />
                <Line lineClassName="h-8" barClassName="h-4 w-3/4" />
                <Line lineClassName="h-8" barClassName="h-4 w-1/3" />
              </div>
            </SectionSkeleton>

            {/* ---------- مشخصات (SpecsGrid) ---------- */}
            <SectionSkeleton titleWidth="w-44" hintWidth="w-56">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className={`${SPEC_TILE} text-center shadow-md`}>
                    <Skeleton className="mx-auto mb-3 size-6 rounded-md" />
                    <Line
                      lineClassName="h-8 justify-center"
                      barClassName="h-5 w-16"
                    />
                    <Line
                      lineClassName="mt-1 h-5 justify-center"
                      barClassName="h-3.5 w-20"
                    />
                  </div>
                ))}
              </div>
            </SectionSkeleton>

            {/* ---------- امکانات (AmenitiesSection) ---------- */}
            <SectionSkeleton titleWidth="w-40" hintWidth="w-16">
              <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="size-6 shrink-0 rounded-full" />
                    <Skeleton className="h-3.5 w-32 rounded-full" />
                  </div>
                ))}
              </div>
              <Skeleton className="mt-5 h-11 w-56 rounded-xl" />
            </SectionSkeleton>

            {/* ---------- نرخ و تاریخ (CabinDatePicker) ---------- */}
            <SectionSkeleton titleWidth="w-52" hintWidth="w-72">
              <div className={`${PANEL_FRAME} flex flex-col`}>
                <div className="border-foreground/5 flex items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-5 rounded-md" />
                    <Skeleton className="h-6 w-36 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-14 rounded-full" />
                </div>

                <div className="p-4 sm:p-6">
                  {/* دو فیلد ورود/خروج */}
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div
                        key={index}
                        className="border-foreground/10 bg-background-2 rounded-2xl border px-4 py-3"
                      >
                        <Skeleton className="h-4 w-20 rounded-full" />
                        <Skeleton className="mt-2 h-5 w-24 rounded-full" />
                      </div>
                    ))}
                  </div>

                  {/* راهنمای مرحله‌ی انتخاب */}
                  <Skeleton className="mt-4 h-4 w-56 max-w-full rounded-full" />

                  {/* تقویم — موبایل تک‌ماه، دسکتاپ دوماه کنار هم */}
                  <div className="border-border bg-surface mt-4 grid gap-4 rounded-2xl border p-3 sm:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, month) => (
                      <div
                        key={month}
                        className={month === 1 ? "hidden sm:block" : ""}
                      >
                        <Skeleton className="mx-auto h-4 w-24 rounded-full" />
                        <div className="mt-3 grid grid-cols-7 gap-1">
                          {Array.from({ length: 7 }).map((__, day) => (
                            <Skeleton key={day} className="h-6 w-full rounded-full" />
                          ))}
                        </div>
                        <div className="mt-1 grid grid-cols-7 gap-1">
                          {Array.from({ length: 42 }).map((__, day) => (
                            <Skeleton
                              key={day}
                              className="aspect-square w-full rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* دکمه‌ی «حذف تاریخ» */}
                  <Skeleton className="mt-4 h-11 w-full rounded-xl" />
                </div>

                <div className="border-foreground/5 border-t px-5 py-3 sm:px-6">
                  <Line lineClassName="h-8" barClassName="h-3.5 w-full" />
                </div>
              </div>

              {/* BookingAuthCheck */}
              <div className="bg-surface/60 border-foreground/10 mt-5 flex min-h-50 flex-col overflow-hidden rounded-3xl border pb-10 shadow-md backdrop-blur-md md:flex-row-reverse md:pb-0">
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
            </SectionSkeleton>

            {/* ---------- قوانین (RulesSection) ---------- */}
            <SectionSkeleton titleWidth="w-40" hintWidth="w-64">
              <div className="grid gap-5 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className={`${SPEC_TILE} shadow-md ${
                      index > 1 ? "md:col-span-2" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="size-9 shrink-0 rounded-xl" />
                      <Skeleton className="h-5 w-36 rounded-full" />
                    </div>
                    <div className="mt-4 space-y-3">
                      {Array.from({ length: 2 }).map((__, row) => (
                        <div key={row} className="flex gap-3">
                          <Skeleton className="mt-1 size-4 shrink-0 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-40 rounded-full" />
                            <Skeleton className="h-3.5 w-full rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SectionSkeleton>

            {/* ---------- نقشه (MapSection) ---------- */}
            <SectionSkeleton titleWidth="w-44">
              <Skeleton className="border-foreground/10 aspect-16/9 w-full rounded-3xl border border-dashed" />
            </SectionSkeleton>

            {/* ---------- نظرات (ReviewsSection) ---------- */}
            <SectionSkeleton titleWidth="w-40" hintWidth="w-52">
              <div className={`${SPEC_TILE} shadow-md`}>
                <div className="grid gap-8 lg:grid-cols-[minmax(0,15rem)_1fr]">
                  <div className="flex flex-col items-center gap-3">
                    <Skeleton className="h-12 w-20 rounded-xl" />
                    <Skeleton className="h-5 w-28 rounded-full" />
                    <Skeleton className="h-4 w-36 rounded-full" />
                  </div>
                  <div className="space-y-2.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Skeleton className="h-4 w-14 shrink-0 rounded-full" />
                        <Skeleton className="h-2 min-w-0 flex-1 rounded-full" />
                        <Skeleton className="h-4 w-6 shrink-0 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="border-foreground/10 bg-surface rounded-3xl border p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <Skeleton className="size-11 shrink-0 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-28 rounded-full" />
                        <Skeleton className="h-3.5 w-20 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-20 shrink-0 rounded-full" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <Skeleton className="h-4 w-full rounded-full" />
                      <Skeleton className="h-4 w-11/12 rounded-full" />
                      <Skeleton className="h-4 w-2/3 rounded-full" />
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Skeleton className="h-7 w-24 rounded-full" />
                      <Skeleton className="h-7 w-20 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </SectionSkeleton>
          </div>

          {/* ---------- aside رزرو دسکتاپ (BookingAside) ---------- */}
          {/*
            آینه‌ی چیدمان فشرده‌ی `BookingSummary`:
            عنوان text-base → بلوک مبلغ → دو فیلد تاریخ → شمارنده‌ی نفرات →
            قاب «جزییات حساب» → دکمه‌ها. پدینگ `p-5` (نه `p-8 md:p-10`) و
            بدون باکس «مزایای رزرو» که حذف شد.
          */}
          <aside className="hidden lg:sticky lg:top-[calc(var(--hz-navbar-h)+var(--hz-tabs-h)+1rem)] lg:block lg:self-start">
            <div className="from-primary-400/40 via-foreground/10 relative rounded-3xl bg-linear-to-br to-transparent p-px">
              <div className="bg-surface/80 relative h-full overflow-hidden rounded-3xl p-5 backdrop-blur-sm">
                <div className="flex flex-col gap-3.5">
                  {/* عنوان شرطی («نرخ هر شب» / «صورت‌حساب») */}
                  <Line lineClassName="h-6" barClassName="h-4 w-24" />

                  {/* بلوک مبلغ (PriceDisplay) */}
                  <div>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <Skeleton className="h-8 w-32 rounded-full" />
                      <Skeleton className="h-4 w-8 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Line lineClassName="mt-1 h-4" barClassName="h-3 w-20" />
                  </div>

                  {/* دو فیلد تاریخ */}
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div
                        key={index}
                        className="border-foreground/10 bg-background-2 rounded-xl border px-3 py-2"
                      >
                        <Skeleton className="h-3 w-14 rounded-full" />
                        <Skeleton className="mt-1.5 h-4 w-20 rounded-full" />
                      </div>
                    ))}
                  </div>

                  {/* شمارنده‌ی نفرات */}
                  <div className="border-foreground/10 bg-surface flex items-center justify-between gap-4 rounded-2xl border px-4 py-3">
                    <Skeleton className="h-4 w-24 rounded-full" />
                    <Skeleton className="h-9 w-28 rounded-full" />
                  </div>

                  {/* قاب «جزییات حساب» */}
                  <div className="border-foreground/10 overflow-hidden rounded-2xl border">
                    <div className="border-foreground/10 flex items-center justify-between gap-2 border-b px-3.5 py-2.5">
                      <Skeleton className="h-4 w-20 rounded-full" />
                      <Skeleton className="h-4 w-10 rounded-full" />
                    </div>
                    <div className="space-y-2.5 px-3.5 py-3">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-3"
                        >
                          <Skeleton className="h-3.5 w-24 rounded-full" />
                          <Skeleton className="h-3.5 w-16 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* دکمه‌ها */}
                  <div className="flex flex-col gap-2.5">
                    <Skeleton className="h-14 w-full rounded-xl" />
                    <Skeleton className="h-14 w-full rounded-xl" />
                    <Line
                      lineClassName="h-4 justify-center"
                      barClassName="h-3 w-48 max-w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>

      {/* ================= نوار ثابت رزرو موبایل (MobileBookingBar) ================= */}
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div className="border-foreground/10 bg-surface/95 hz-safe-b border-t px-4 pt-3 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="mt-2 h-3.5 w-40 rounded-full" />
            </div>
            <Skeleton className="h-14 w-36 shrink-0 rounded-xl" />
          </div>
        </div>
      </div>
    </>
  );
}
