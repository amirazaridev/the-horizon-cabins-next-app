import type { ReactNode } from "react";

import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";
import CabinDetailSkeleton from "@/features/cabins/components/CabinDetailSkeleton";

/**
 * اسکلتون مسیر `/cabins/[cabinId]`.
 *
 * همان قالب صفحه‌ی جزئیات: پوسته‌ی بخش، کانتینر `cabin-detail`، مسیر
 * راهنما (breadcrumb) و بدنه‌ی هم‌ساختار `CabinDetail`.
 */
export default function Loading(): ReactNode {
  return (
    <section className="bg-background-2 min-h-screen py-10 sm:py-14">
      <Container variant="cabin-detail">
        {/* مسیر راهنما */}
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-4 w-14 rounded-full" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-28 rounded-full" />
        </div>

        <CabinDetailSkeleton />
      </Container>
    </section>
  );
}
