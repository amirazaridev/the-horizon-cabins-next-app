"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";

const AUTOPLAY_DELAY_MS = 4000;

type Props = {
  images: string[];
  altBase: string;
  children?: ReactNode;
};

export default function CabinGallery({
  images,
  altBase,
  children,
}: Props): ReactNode {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      direction: "rtl",
      loop: true,
    },
    [Autoplay({ delay: AUTOPLAY_DELAY_MS, stopOnInteraction: false })],
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  /**
   * اقامتگاهی که تصویر ندارد: قابِ گالری بدون هیچ اسلایدی جمع می‌شد و
   * صفحه با یک نوار خالی شروع می‌شد. حالا همان نسبت ابعاد با یک حالت خالی
   * نگه داشته می‌شود تا چیدمان ثابت بماند و سرتیتر روی آن بنشیند.
   */
  if (images.length === 0) {
    return (
      <div className="group border-foreground/5 from-background-2 to-surface relative aspect-square overflow-hidden rounded-3xl border bg-linear-to-br sm:aspect-video lg:aspect-21/9">
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-text-gray flex flex-col items-center gap-2">
            <ImageOff className="size-8" />
            <span className="text-sm">تصویری برای این اقامتگاه ثبت نشده</span>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div>
      <div className="group border-foreground/5 relative overflow-hidden rounded-3xl border active:cursor-grabbing">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y select-none">
            {images.map((image, i) => (
              <div
                key={i}
                className="relative aspect-square min-w-0 flex-[0_0_100%] sm:aspect-video lg:aspect-21/9"
              >
                <Image
                  draggable={false}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  src={image}
                  alt={`${altBase} - تصویر ${i + 1}`}
                  fill
                  preload={i == 0}
                  // placeholder="blur"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="from-background via-background/20 pointer-events-none absolute inset-0 bg-linear-to-t to-transparent" />

        {/* شمارنده‌ی تصویر — مکمل بندانگشتی‌ها برای وقتی که تعداد زیاد است */}
        <span
          aria-hidden="true"
          className="border-foreground/15 bg-background/40 text-text absolute top-4 right-4 z-10 rounded-full border px-3 py-1 text-xs font-bold tabular-nums backdrop-blur-md sm:top-6 sm:right-6"
        >
          {(selectedIndex + 1).toLocaleString("fa-IR")} /{" "}
          {images.length.toLocaleString("fa-IR")}
        </span>

        <button
          onClick={scrollPrev}
          aria-label="تصویر قبلی"
          className="hover:border-primary-400/50 hover:text-primary-400 text-text border-foreground/15 bg-background/40 absolute top-1/2 right-2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-md transition-colors duration-300 sm:right-6 sm:size-11"
        >
          <ChevronRight className="size-5" />
        </button>
        <button
          onClick={scrollNext}
          aria-label="تصویر بعدی"
          className="hover:border-primary-400/50 hover:text-primary-400 text-text border-foreground/15 bg-background/40 absolute top-1/2 left-2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-md transition-colors duration-300 sm:left-6 sm:size-11"
        >
          <ChevronLeft className="size-5" />
        </button>

        {children}
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-6">
          {images.map((image, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`رفتن به تصویر ${i + 1}`}
              className={`relative aspect-video overflow-hidden rounded-xl border transition-all duration-300 ${
                i === selectedIndex
                  ? "border-primary-400 opacity-100"
                  : "border-foreground/5 opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                className="absolute inset-0 h-full w-full object-cover"
                src={image}
                alt={`تصویر ${i + 1}`}
                fill
                preload={i == 0}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
