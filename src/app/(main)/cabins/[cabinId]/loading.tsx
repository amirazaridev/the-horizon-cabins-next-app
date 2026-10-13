import type { ReactNode } from "react";

import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";
import CabinDetailSkeleton from "@/features/cabins/components/CabinDetailSkeleton";

export default function Loading(): ReactNode {
  return (
    <section className="bg-background-2 min-h-screen pt-10 pb-28 sm:pt-14 lg:pb-14">
      <Container size="wide">
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
