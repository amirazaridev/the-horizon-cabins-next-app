import type { ReactNode } from "react";

import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";
import CabinDetailSkeleton from "@/features/cabins/components/CabinDetailSkeleton";

/**
 * اسکلتون مسیر `/cabins/[cabinId]` — **مستقل** از اسکلتون لیست اقامتگاه‌ها.
 *
 * همان قالب صفحه‌ی جزئیات: پوسته‌ی بخش، کانتینر `cabin-detail`، مسیر راهنما
 * (هم‌ابعاد `Navigate`: `text-sm` ⇒ ردیف ۲۰px و جداکننده‌های `size-4`) و
 * بدنه‌ی `CabinDetailSkeleton` که آینه‌ی گالری، مشخصات، توضیحات و سه پنل
 * پایین صفحه است.
 *
 * مرز لودینگ لیست (`cabins/(list)/loading.tsx`) عمداً از درختِ این مسیر
 * بیرون کشیده شده تا اینجا فقط اسکلتون مخصوص همین صفحه دیده شود.
 */
export default function Loading(): ReactNode {
  return (
    <section className="bg-background-2 min-h-screen py-10 sm:py-14">
      <Container variant="cabin-detail">
        {/* مسیر راهنما (Navigate) */}
        <div className="mb-6 flex items-center gap-1.5">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="size-4 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="size-4 rounded-full" />
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>

        <CabinDetailSkeleton />
      </Container>
    </section>
  );
}
