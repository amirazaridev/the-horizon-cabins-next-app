"use client";

import Container from "@/components/ui/Container";
import PreviewCta from "@/features/search/components/preview/PreviewCta";
import PreviewGrid from "@/features/search/components/preview/PreviewGrid";
import PreviewHeader from "@/features/search/components/preview/PreviewHeader";
import {
  PreviewEmpty,
  PreviewError,
  PreviewSkeleton,
} from "@/features/search/components/preview/PreviewStates";
import { useSearchPreview } from "@/features/search/hooks/useSearchPreview";
import { useSearchPreviewAnimation } from "@/features/search/hooks/useSearchPreviewAnimation";
import { useSearchStore } from "@/features/search/store/search.store";
import { SEARCH_PREVIEW_ID } from "@/features/search/utils/scroll-to-preview";
import {
  hasAnySearchFilter,
  searchFiltersToHref,
  searchFiltersToQueryString,
} from "@/features/search/utils/search-params";
import { buildPreviewHeading } from "@/features/search/utils/search-summary";

//* بخش «پیش‌نمایش جستجو» در لندینگ. رفتار: در حالت اولیه کاملاً بسته است (ارتفاع صفر، بدون فضای خالی)، فقط به مقدار «اعمال‌شده» واکنش نشان می‌دهد (نه draft)، با GSAP سبک باز/بسته می‌شود (بدون پرش layout) و حداکثر ۶ کارت نشان می‌دهد.
//* این کامپوننت فقط «ارکستراسیون» است؛ اجزای نمایشی‌اش در `PreviewHeader` / `PreviewGrid` / `PreviewCta` و حالت‌ها در `PreviewStates` زندگی می‌کنند.
export default function SearchPreview() {
  const applied = useSearchStore((state) => state.applied);
  const appliedToken = useSearchStore((state) => state.appliedToken);
  const reset = useSearchStore((state) => state.reset);

  const { status, cabins, total, retry } = useSearchPreview(
    applied,
    undefined,
    appliedToken,
  );

  const hasFilters = hasAnySearchFilter(applied);

  //* «باز بودن» **فقط** به «اعمال‌شدنِ جستجو» بستگی دارد، نه به وضعیت fetch.
  //* اگر شرط `status !== "idle"` بود، رندرِ اولِ بعد از اعمال `open=false` می‌داد و شاخه‌ی «بستن» با «باز شدن» می‌جنگید؛ بدتر آنکه با اجرا نشدن fetch، سکشن برای همیشه بسته می‌ماند.
  //* `appliedToken > 0` یعنی «کاربر حداقل یک‌بار جستجو را اعمال کرده» — حتی بدون فیلتر (یعنی «همه‌ی اقامتگاه‌ها»)؛ `reset` توکن را صفر و سکشن را می‌بندد. پس `open` تابعیِ قطعی از state است و هرگز گیر نمی‌کند.
  const open = hasFilters || appliedToken > 0;

  //* در همان رندرِ اولِ بعد از اعمال هم اسکلتی نشان بده (هم ارتفاع می‌دهد هم بازخورد)
  const showSkeleton = open && (status === "idle" || status === "loading");

  const revision = `${searchFiltersToQueryString(applied)}::${status}::${cabins.length}`;
  const { wrapperRef, contentRef } = useSearchPreviewAnimation(open, revision);

  const { title, subtitle } = buildPreviewHeading({ filters: applied });
  const href = searchFiltersToHref(applied);

  return (
    <section
      id={SEARCH_PREVIEW_ID}
      aria-live="polite"
      aria-busy={status === "loading"}
      className="bg-background scroll-mt-20 px-4 md:scroll-mt-24 md:px-6"
    >
      <Container>
        {/* ظرف انیمیشنی: در حالت بسته هیچ ارتفاعی اشغال نمی‌کند */}
        <div
          ref={wrapperRef}
          data-state={open ? "open" : "closed"}
          className="h-0 overflow-hidden opacity-0"
        >
          <div ref={contentRef} className="pt-10 pb-2 md:pt-12">
            <PreviewHeader title={title} subtitle={subtitle} onReset={reset} />

            {showSkeleton && <PreviewSkeleton />}

            {status === "error" && <PreviewError onRetry={retry} />}

            {status === "empty" && <PreviewEmpty />}

            {status === "success" && (
              <>
                <PreviewGrid cabins={cabins} />
                <PreviewCta total={total} href={href} />
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
