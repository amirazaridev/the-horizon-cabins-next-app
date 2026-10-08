import type { ReactNode } from "react";

import Skeleton from "@/components/ui/Skeleton";

/**
 * اسکلتون ناحیه‌ی مهمان.
 *
 * ⚠️ چیدمان را هم‌شکل پوسته (سایدبار + هدر + محتوا) رزرو می‌کند تا هنگام
 * بارگذاری پرش بصری نداشته باشیم.
 */
export default function Loading(): ReactNode {
  return (
    <section className="bg-background min-h-screen md:flex">
      {/* سایدبار */}
      <div className="hidden w-75 shrink-0 lg:block">
        <div className="bg-surface border-border flex h-full min-h-screen flex-col border-l p-4">
          <Skeleton width={140} height={40} radius={12} />
          <div className="mt-6 flex flex-col gap-2">
            <Skeleton count={3} width="100%" height={44} radius={12} />
          </div>
          <div className="mt-auto">
            <Skeleton width="100%" height={64} radius={16} />
            <div className="mt-2">
              <Skeleton width="100%" height={44} radius={12} />
            </div>
          </div>
        </div>
      </div>

      {/* محتوا */}
      <div className="flex w-full flex-col">
        <div className="border-border flex h-16 items-center border-b px-4 sm:px-6">
          <Skeleton width={200} height={24} radius={8} />
        </div>
        <div className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">
          <Skeleton width={220} height={28} radius={10} />
          <div className="mt-6">
            <Skeleton count={3} width="100%" height={190} radius={24} gap={16} />
          </div>
        </div>
      </div>

      <div role="status" className="sr-only">
        در حال بارگذاری…
      </div>
    </section>
  );
}
