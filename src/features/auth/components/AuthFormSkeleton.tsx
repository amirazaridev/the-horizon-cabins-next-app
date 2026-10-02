import type { ReactNode } from "react";

import Skeleton from "@/components/ui/Skeleton";
import BackDropBlur from "@/components/ui/BackDropBlur";

export default function AuthFormSkeleton(): ReactNode {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="bg-surface/90 shadow-primary-300/15 relative overflow-hidden rounded-3xl shadow-2xl backdrop-blur-xl">
        <BackDropBlur type="double-top-down" />

        <div className="relative px-5 py-6 sm:px-8 sm:py-8">
          {/* سرتیتر: آیکون + عنوان + توضیح */}
          <div className="mb-5 flex flex-col items-center">
            <Skeleton className="mb-3 size-12 rounded-xl" />
            <Skeleton className="h-6 w-40 rounded-full" />
            <Skeleton className="mt-2.5 h-3.5 w-52 rounded-full" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-13 w-full rounded-xl" />
            <Skeleton className="h-13 w-full rounded-xl" />
            <Skeleton className="h-13 w-full rounded-xl" />
            <Skeleton className="mt-2 h-13 w-full rounded-xl" />
          </div>

          <div className="my-5 flex items-center gap-4">
            <span className="via-foreground/10 h-px flex-1 bg-linear-to-r from-transparent to-transparent" />
            <Skeleton className="h-4 w-6 rounded-full" />
            <span className="via-foreground/10 h-px flex-1 bg-linear-to-r from-transparent to-transparent" />
          </div>

          <div className="flex justify-center">
            <Skeleton className="h-5 w-44 rounded-full" />
          </div>
        </div>
      </div>

      <span className="sr-only" role="status">
        در حال بارگذاری فرم…
      </span>
    </div>
  );
}
