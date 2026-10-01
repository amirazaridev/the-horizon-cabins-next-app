import type { ReactNode } from "react";

import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";
import CabinDetailSkeleton from "@/features/cabins/components/CabinDetailSkeleton";

/**
 * اسکلتون مسیر `/cabins/[cabinId]` — **مستقل** از اسکلتون لیست اقامتگاه‌ها.
 *
 * ساختارش آینه‌ی `page.tsx` است: پوسته‌ی بخش، مسیر راهنما (هم‌ابعاد
 * `Navigate`: `text-sm` ⇒ ردیف ۲۰px و جداکننده‌های `size-4`) و سپس
 * `CabinDetailSkeleton` که خودش کانتینرها، نوار تب چسبان، بدنه‌ی دوستونه
 * و نوار ثابت موبایل را می‌سازد.
 *
 * مرز لودینگ لیست (`cabins/(list)/loading.tsx`) عمداً از درختِ این مسیر
 * بیرون کشیده شده تا اینجا فقط اسکلتون مخصوص همین صفحه دیده شود.
 */
export default function Loading(): ReactNode {
  return (
    <section className="bg-background-2 min-h-screen pt-10 pb-28 sm:pt-14 lg:pb-14">
      {/* مسیر راهنما (Navigate) */}
      <Container variant="cabin-detail">
        <div className="mb-6 flex items-center gap-1.5">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="size-4 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="size-4 rounded-full" />
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
      </Container>

      <CabinDetailSkeleton />
    </section>
  );
}
