"use client";

import { RefreshCw, SearchX, TriangleAlert } from "lucide-react";

import CabinCardsSkeleton from "@/features/cabins/components/CabinCardsSkeleton";
import { SEARCH_PREVIEW_LIMIT } from "../../types/search.types";

export function PreviewSkeleton() {
  return (
    <div>
      <div
        role="status"
        className="text-text-gray mb-4 flex items-center gap-2 text-sm font-medium"
      >
        <RefreshCw className="text-primary-400 size-4 animate-spin" />
        در حال پیدا کردن اقامتگاه…
      </div>

      {/*
        همان چیدمان نتایج واقعی: موبایل کاروسل، از `sm` به بالا گرید.
        اسکلتون‌ها هم‌ابعاد `CabinCard` (واریانت landing) هستند، پس تبدیل
        لودینگ به محتوا هیچ پرشی در ارتفاع سکشن ایجاد نمی‌کند.
      */}
      <CabinCardsSkeleton
        count={SEARCH_PREVIEW_LIMIT}
        variant="landing"
        layout="responsive"
        gridClassName="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3"
        slideClassName="flex-[0_0_78%]"
        itemProps={{ "data-preview-card": true }}
        showPrice
      />
    </div>
  );
}

export function PreviewEmpty() {
  return (
    <div className="border-foreground/10 bg-surface flex flex-col items-center gap-3 rounded-3xl border border-dashed px-6 py-12 text-center">
      <span className="bg-foreground/5 grid size-12 place-items-center rounded-full">
        <SearchX className="text-text-gray size-6" />
      </span>
      <p className="text-text text-sm font-bold">
        در این محدوده اقامتگاهی مطابق انتخاب شما پیدا نشد.
      </p>
      <p className="text-text-gray max-w-md text-xs leading-6">
        می‌توانید بودجه را بالا ببرید، تعداد مهمان را کم کنید یا مقصد را تغییر
        دهید.
      </p>
    </div>
  );
}

export function PreviewError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="border-danger/30 bg-danger/5 flex flex-col items-center gap-3 rounded-3xl border px-6 py-10 text-center"
    >
      <span className="bg-danger/10 grid size-12 place-items-center rounded-full">
        <TriangleAlert className="text-danger size-6" />
      </span>
      <p className="text-text text-sm font-bold">
        در گرفتن نتیجه‌ها مشکلی پیش آمد.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="border-foreground/15 text-text hover:border-primary-400 hover:text-primary-500 mt-1 rounded-xl border px-4 py-2 text-xs font-bold transition-colors"
      >
        تلاش دوباره
      </button>
    </div>
  );
}
