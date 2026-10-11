"use client";

import Carousel from "@/components/ui/Carousel";
import CabinCard from "@/features/cabins/components/CabinCard";
import type { Cabin } from "@/features/cabins/types/cabin.types";

//* نتایج پیش‌نمایش — گرید دسکتاپ + کاروسل موبایل. کارت مشترک `PreviewCard` تکرار props را حذف می‌کند.
//* ⚠️ صفت `data-preview-card` فقط روی آیتم‌های گرید دسکتاپ است، چون `useSearchPreviewAnimation` با همان انتخابگر کارت‌ها را برای انیمیشن پیدا می‌کند و رفتار قبلی باید حفظ شود.
export default function PreviewGrid({ cabins }: { cabins: Cabin[] }) {
  return (
    <>
      {/* دسکتاپ: گرید */}
      <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {cabins.map((cabin) => (
          <div key={cabin.id} data-preview-card>
            <PreviewCard cabin={cabin} />
          </div>
        ))}
      </div>

      {/* موبایل: کاروسل افقی (همان Carousel موجود پروژه) */}
      <div className="sm:hidden">
        <Carousel slideClassName="flex-[0_0_78%]" showArrows={false}>
          {cabins.map((cabin) => (
            <PreviewCard key={cabin.id} cabin={cabin} />
          ))}
        </Carousel>
      </div>
    </>
  );
}

function PreviewCard({ cabin }: { cabin: Cabin }) {
  return (
    <CabinCard cabin={cabin} variant="landing" showPrice className="h-full" />
  );
}
