import type { ReactNode } from "react";

import Skeleton from "@/components/ui/Skeleton";

export type CabinCardSkeletonVariant = "default" | "landing" | "dashboard";

export interface CabinCardSkeletonProps {
  /** واریانت — باید با واریانتِ `CabinCard` واقعی یکی باشد */
  variant?: CabinCardSkeletonVariant;
  /** نمایش ردیف قیمت (فقط واریانت `landing`) */
  showPrice?: boolean;
  className?: string;
}

/** همان کلاس‌های پایه‌ی `CabinCard` — برای هم‌ابعاد ماندن */
const baseClasses =
  "relative overflow-hidden rounded-3xl border border-foreground/5 bg-surface";

/**
 * اسکلتون هم‌ابعاد `CabinCard`.
 *
 * هر واریانت، دقیقاً همان درختِ کلاس‌های کارت واقعی را بازتولید می‌کند:
 * همان `aspect-video`، همان پدینگ‌ها (`p-3.5` / `sm:p-4` / `p-5`) و همان
 * `gap`ها. به‌جای متن، بلوکی با **ارتفاعِ برابر line-height متن واقعی**
 * می‌نشیند (text-xs → `h-4`، text-sm → `h-5`، text-base → `h-6`،
 * text-lg → `h-7`) تا جمعِ ارتفاع‌ها یکی در بیاید و لحظه‌ی تبدیل لودینگ
 * به محتوا هیچ پرشی رخ ندهد.
 */
export default function CabinCardSkeleton({
  variant = "default",
  showPrice = false,
  className = "",
}: CabinCardSkeletonProps): ReactNode {
  if (variant === "landing") {
    return <LandingCardSkeleton className={className} showPrice={showPrice} />;
  }

  if (variant === "dashboard") {
    return <DashboardCardSkeleton className={className} />;
  }

  return <DefaultCardSkeleton className={className} />;
}

/** یک خط متن: ظرفی هم‌ارتفاع line-height متن واقعی + میله‌ای نازک‌تر در مرکز */
function SkeletonLine({
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

function LandingCardSkeleton({
  className,
  showPrice,
}: {
  className: string;
  showPrice: boolean;
}): ReactNode {
  return (
    <div className={`${baseClasses} flex h-full flex-col ${className}`}>
      {/* تصویر — همان نسبت ۱۶:۹ کارت واقعی */}
      <div className="bg-background-2 relative aspect-video overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        {/* عنوان (text-base → ۲۴px) */}
        <SkeletonLine lineClassName="h-6" barClassName="h-4 w-2/3" />

        {/* شهر / خواب / متراژ (text-xs → ۱۶px) */}
        <div className="flex min-h-4 flex-wrap items-center gap-x-3 gap-y-1">
          <Skeleton className="h-3.5 w-16 rounded-full" />
          <Skeleton className="h-3.5 w-8 rounded-full" />
          <Skeleton className="h-3.5 w-12 rounded-full" />
        </div>

        {showPrice && (
          /* قیمت (text-sm → ۲۰px + pt-1.5) */
          <div className="mt-auto flex items-center gap-1.5 pt-1.5">
            <Skeleton className="h-5 w-28 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}

function DefaultCardSkeleton({ className }: { className: string }): ReactNode {
  return (
    <div className={`${baseClasses} flex h-full flex-col ${className}`}>
      <div className="bg-background-2 relative aspect-video overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3.5 sm:p-4">
        {/* عنوان (text-base/text-lg) + متراژ (text-xs) */}
        <div className="flex items-start justify-between gap-2">
          <SkeletonLine
            lineClassName="h-6 min-w-0 flex-1 sm:h-7"
            barClassName="h-4 w-2/3"
          />
          <Skeleton className="h-4 w-10 shrink-0 rounded-full" />
        </div>

        {/* شهر + مشخصات (text-xs → ۱۶px) */}
        <div className="flex min-h-4 flex-wrap items-center gap-x-3 gap-y-1">
          <Skeleton className="h-3.5 w-16 rounded-full" />
          <Skeleton className="h-3.5 w-8 rounded-full" />
          <Skeleton className="h-3.5 w-8 rounded-full" />
          <Skeleton className="h-3.5 w-8 rounded-full" />
        </div>

        {/* امکانات — همان ارتفاع چیپ‌ها (px-3 py-1 + text-xs/text-sm) */}
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-6 w-16 rounded-full sm:h-7" />
          <Skeleton className="h-6 w-20 rounded-full sm:h-7" />
          <Skeleton className="h-6 w-14 rounded-full sm:h-7" />
        </div>

        {/* قیمت + دکمه‌ی گرد (size-9 → ۳۶px) */}
        <div className="border-border mt-auto flex items-center justify-between gap-2 border-t pt-3">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-16 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="size-9 shrink-0 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function DashboardCardSkeleton({ className }: { className: string }): ReactNode {
  return (
    <div className={`${baseClasses} ${className}`}>
      <div className="relative aspect-video overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="flex flex-col gap-4 p-5">
        {/* عنوان + کد سوییت + منوی عملیات */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <SkeletonLine lineClassName="h-7" barClassName="h-5 w-2/3" />
            <SkeletonLine
              lineClassName="mt-0.5 h-4"
              barClassName="h-3 w-24"
            />
          </div>
          <Skeleton className="size-9 shrink-0 rounded-full" />
        </div>

        {/* چهار کاشی مشخصات — هم‌ابعاد `SpecTile` */}
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-background-2 flex flex-col items-center gap-1 rounded-xl py-2.5"
            >
              <Skeleton className="size-4 rounded-md" />
              <SkeletonLine lineClassName="h-5" barClassName="h-3.5 w-8" />
              <SkeletonLine lineClassName="h-4" barClassName="h-2.5 w-10" />
            </div>
          ))}
        </div>

        {/* شهر (text-sm → ۲۰px + mb-3) */}
        <div className="mb-3 flex h-5 items-center gap-1.5">
          <Skeleton className="size-4 rounded-full" />
          <Skeleton className="h-3.5 w-20 rounded-full" />
        </div>

        {/* امکانات */}
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-7 w-16 rounded-full" />
          ))}
        </div>

        {/* تاریخ + وضعیت قیمت */}
        <div className="border-border flex items-center justify-between border-t pt-3">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* قیمت‌نامه */}
        <div className="bg-background-2 flex flex-col gap-1.5 rounded-xl p-3.5">
          <div className="flex h-5 items-center justify-between">
            <Skeleton className="h-3.5 w-16 rounded-full" />
            <Skeleton className="h-3.5 w-20 rounded-full" />
          </div>
          <div className="flex h-5 items-center justify-between">
            <Skeleton className="h-3.5 w-20 rounded-full" />
            <Skeleton className="h-3.5 w-16 rounded-full" />
          </div>
          <div className="border-border border-t pt-1.5" />
          <div className="flex h-6 items-center justify-between">
            <Skeleton className="h-3.5 w-24 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
