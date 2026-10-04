import type { ReactNode } from "react";

import Skeleton from "@/components/ui/Skeleton";

/**
 * اسکلتون ناحیه‌ی مهمان.
 *
 * ⚠️ بدون این فایل، نزدیک‌ترین مرز لودینگ `(main)/loading.tsx` است که
 * پیش‌لودر تیره‌ی لندینگ را نشان می‌دهد؛ این اسکلتون همان چیدمان پوسته
 * (عنوان + تب‌ها + کارت‌ها) را رزرو می‌کند تا پرش بصری نداشته باشیم.
 */
export default function Loading(): ReactNode {
  return (
    <section className="bg-background min-h-screen">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6 md:py-14">
        <Skeleton width={200} height={32} radius={12} />

        <div className="mt-6">
          <Skeleton width="100%" height={52} radius={16} />
        </div>

        <div className="mt-6">
          <Skeleton count={3} width="100%" height={210} radius={24} gap={16} />
        </div>

        <div role="status" className="sr-only">
          در حال بارگذاری…
        </div>
      </div>
    </section>
  );
}
