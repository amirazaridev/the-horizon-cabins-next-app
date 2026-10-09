import type { ReactNode } from "react";

import Skeleton from "@/components/ui/Skeleton";

/** یک خط متن با ارتفاعِ برابر line-height متن واقعی */
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

/** کارت پایه‌ی داشبورد — همان `CardDashContainer` */
function Card({ children, className = "" }: { children: ReactNode; className?: string }): ReactNode {
  return (
    <div className={`border-border bg-background-2 rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  );
}

/** سرصفحه‌ی نمودار: عنوان + زیرعنوان در سمت راست، عدد کل در سمت چپ */
function ChartHeader(): ReactNode {
  return (
    <div className="flex items-start justify-between">
      <div>
        <Line lineClassName="h-6" barClassName="h-4 w-28" />
        <Line lineClassName="h-5" barClassName="h-3.5 w-40" />
      </div>
      <div className="flex flex-col items-end">
        <Line lineClassName="h-7 justify-end" barClassName="h-5 w-24" />
        <Line lineClassName="h-4 justify-end" barClassName="h-3 w-10" />
      </div>
    </div>
  );
}

/**
 * اسکلتون صفحه‌ی «داشبورد» (`MainPageLayout`).
 *
 * همان ظرف‌ها و همان شبکه‌بندی صفحه‌ی واقعی — نوار فیلتر، چهار کارت
 * آماری، دو ردیف نمودار و کارت فعالیت امروز — تا سوئیچ از لودینگ به محتوا
 * بدون جهش چیدمان انجام شود.
 */
export default function OverviewSkeleton(): ReactNode {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        <div>
          <Line lineClassName="h-9" barClassName="h-6 w-32 sm:w-40" />
          <Line
            lineClassName="mt-1 h-5"
            barClassName="h-3.5 w-64 max-w-full"
          />
        </div>

        {/* نوار فیلتر */}
        <div className="border-border bg-background-2/60 flex w-full flex-wrap items-center gap-2 rounded-2xl border p-3">
          <Skeleton className="h-9.5 w-32 rounded-xl" />
          <Skeleton className="h-9.5 w-24 rounded-xl" />
          <Skeleton className="h-9.5 w-24 rounded-xl" />
          <div className="flex-1" />
          <Skeleton className="size-9.5 rounded-xl" />
        </div>
      </div>

      {/* کارت‌های KPI — ۸ کارت */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-1 flex-col gap-1.5">
                <Line lineClassName="h-5" barClassName="h-3.5 w-24" />
                <Line lineClassName="h-8" barClassName="h-5 w-28" />
                <Line lineClassName="h-4" barClassName="h-3 w-32" />
              </div>
              <Skeleton className="size-11.5 shrink-0 rounded-xl" />
            </div>
            <Skeleton className="mt-4 h-1.5 w-full rounded-full" />
          </Card>
        ))}
      </div>

      {/* ردیف اول نمودارها */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="flex flex-col gap-5">
            <ChartHeader />
            <Skeleton className="h-[280px] w-full rounded-xl" />
            <div className="flex items-center justify-center gap-6">
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-full" />
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex flex-col gap-4">
            <ChartHeader />
            <Skeleton className="h-[220px] w-full rounded-xl" />
          </div>
        </Card>
      </div>

      {/* ردیف دوم نمودارها */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="flex flex-col gap-4">
            <ChartHeader />
            <Skeleton className="h-[280px] w-full rounded-xl" />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex flex-col gap-4">
            <ChartHeader />
            <Skeleton className="h-[260px] w-full rounded-xl" />
          </div>
        </Card>
      </div>

      {/* فعالیت امروز */}
      <Card className="flex max-h-110 w-full flex-col gap-5">
        <div className="flex flex-col gap-1">
          <Line lineClassName="h-7" barClassName="h-5 w-28" />
          <Line lineClassName="h-5" barClassName="h-3.5 w-40" />
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </Card>
    </div>
  );
}
