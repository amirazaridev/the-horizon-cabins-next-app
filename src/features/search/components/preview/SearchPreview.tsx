"use client";

import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";

import CabinCard from "@/features/cabins/components/CabinCard";
import Carousel from "@/components/ui/Carousel";
import Container from "@/components/ui/Container";
import { useSearchPreview } from "../../hooks/useSearchPreview";
import { useSearchPreviewAnimation } from "../../hooks/useSearchPreviewAnimation";
import { useSearchStore } from "../../store/search.store";
import {
  hasAnySearchFilter,
  searchFiltersToHref,
  searchFiltersToQueryString,
} from "../../utils/search-params";
import {
  buildPreviewCtaLabel,
  buildPreviewHeading,
} from "../../utils/search-summary";
import { SEARCH_PREVIEW_ID } from "../../utils/scroll-to-preview";
import { PreviewEmpty, PreviewError, PreviewSkeleton } from "./PreviewStates";

/**
 * بخش «پیش‌نمایش جستجو» در لندینگ.
 *
 * رفتار:
 *  - در حالت اولیه کاملاً بسته است (ارتفاع صفر، بدون فضای خالی).
 *  - فقط به مقدار «اعمال‌شده» واکنش نشان می‌دهد، نه به draft.
 *  - با GSAP سبک باز/بسته می‌شود (بدون پرش layout).
 *  - حداکثر ۶ کارت نشان می‌دهد و بقیه از CTA به `/cabins` می‌رود.
 */
export default function SearchPreview() {
  const applied = useSearchStore((state) => state.applied);
  const reset = useSearchStore((state) => state.reset);

  const { status, cabins, total, retry } = useSearchPreview(applied);

  const hasFilters = hasAnySearchFilter(applied);
  const open = hasFilters && status !== "idle";

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
            <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-text-gray mb-2 flex items-center gap-3 text-xs font-semibold">
                  <span className="bg-primary-400 h-px w-8" />
                  نتیجه‌ی جستجوی شما
                </div>
                <h2 className="text-text text-xl font-extrabold tracking-tight sm:text-2xl md:text-[30px]">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-text-gray mt-2 text-xs leading-6 sm:text-sm">
                    {subtitle}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={reset}
                className="text-text-gray hover:text-danger hover:bg-danger/10 flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition-colors"
              >
                <X className="size-4" />
                حذف جستجو
              </button>
            </header>

            {status === "loading" && <PreviewSkeleton />}

            {status === "error" && <PreviewError onRetry={retry} />}

            {status === "empty" && <PreviewEmpty />}

            {status === "success" && (
              <>
                {/* دسکتاپ: گرید */}
                <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
                  {cabins.map((cabin) => (
                    <div key={cabin.id} data-preview-card>
                      <CabinCard
                        cabin={cabin}
                        variant="landing"
                        showPrice
                        className="h-full"
                      />
                    </div>
                  ))}
                </div>

                {/* موبایل: کاروسل افقی (همان Carousel موجود پروژه) */}
                <div className="sm:hidden">
                  <Carousel
                    slideClassName="flex-[0_0_78%]"
                    showArrows={false}
                  >
                    {cabins.map((cabin) => (
                      <CabinCard
                        key={cabin.id}
                        cabin={cabin}
                        variant="landing"
                        showPrice
                        className="h-full"
                      />
                    ))}
                  </Carousel>
                </div>

                <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
                  <span className="text-text-gray text-xs">
                    {total.toLocaleString("fa-IR")} اقامتگاه پیدا شد
                  </span>
                  <Link
                    href={href}
                    className="bg-primary-400 hover:bg-primary-500 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-black transition-colors"
                  >
                    {buildPreviewCtaLabel(total)}
                    <ArrowLeft className="size-4" />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
