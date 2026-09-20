"use client";

import {
  Children,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselProps = {
  children: ReactNode;
  slideClassName?: string;
  gapClassName?: string;
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
};

export default function Carousel({
  children,
  slideClassName = "flex-[0_0_82%] sm:flex-[0_0_46%] lg:flex-[0_0_31%]",
  gapClassName = "gap-4",
  loop = false,
  showArrows = true,
  showDots = false,
  className = "",
}: CarouselProps) {
  const slides = Children.toArray(children);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    direction: "rtl",
    loop,
    align: "start",
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  const showNav = showArrows && (canScrollPrev || canScrollNext);

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden" ref={emblaRef} dir="rtl">
        <div className={`flex ${gapClassName}`}>
          {slides.map((slide, index) => (
            <div key={index} className={`min-w-0 touch-pan-y ${slideClassName}`}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      {showNav && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="اسلاید قبلی"
            className="bg-surface/90 border-foreground/10 text-text absolute top-1/2 right-1 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-md backdrop-blur-md transition-all hover:bg-primary-400 hover:text-black disabled:pointer-events-none disabled:opacity-0 sm:-right-3 sm:flex"
          >
            <ChevronRight className="size-5" />
          </button>

          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="اسلاید بعدی"
            className="bg-surface/90 border-foreground/10 text-text absolute top-1/2 left-1 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-md backdrop-blur-md transition-all hover:bg-primary-400 hover:text-black disabled:pointer-events-none disabled:opacity-0 sm:-left-3 sm:flex"
          >
            <ChevronLeft className="size-5" />
          </button>
        </>
      )}

      {showDots && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`رفتن به اسلاید ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                index === selectedIndex
                  ? "bg-primary-400 w-6"
                  : "bg-foreground/15 w-1.5"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}