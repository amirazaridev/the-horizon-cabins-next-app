"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  CalendarDays,
  FileText,
  Images,
  LayoutList,
  MapPin,
  ScrollText,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";
import Container from "@/components/ui/Container";
import useNavbarHeight from "@/hooks/useNavbarHeight";
import {
  CABIN_DETAIL_SECTIONS,
  type CabinDetailSectionId,
} from "../../constants/cabin-detail";

const SECTION_ICONS: Record<CabinDetailSectionId, LucideIcon> = {
  gallery: Images,
  overview: FileText,
  specs: LayoutList,
  amenities: Sparkles,
  rate: CalendarDays,
  rules: ScrollText,
  map: MapPin,
  reviews: Star,
};

/** فاصله‌ی اضافه تا سکشن فعال دقیقاً زیر تب‌ها حساب شود */
const SPY_PADDING = 8;

/**
 * نوار تب چسبان زیر Navbar با Scroll Spy.
 *
 * نکات پیاده‌سازی:
 *
 * • **جای‌گیری:** `top` از `--hz-navbar-h` می‌آید (ارتفاع واقعی نوار بالا
 *   که هوک `useNavbarHeight` می‌نویسد) و `z-30` است تا زیر Navbar با
 *   `z-50` بماند. `hz-scroll-mt` روی خود سکشن‌ها، پرش لینک را جبران می‌کند.
 *
 * • **اسکرول بدون JS هم کار می‌کند:** تب‌ها `<a href="#id">` هستند و
 *   `scroll-behavior: smooth` در `globals.css` تعریف شده؛ پس اگر
 *   جاوااسکریپت خطا بدهد، ناوبری تب‌ها سالم می‌ماند.
 *
 * • **Scroll Spy:** `IntersectionObserver` با یک نوار باریک زیر نوار
 *   چسبان. معیار انتخاب، «ارتفاع دیده‌شده‌ی هر سکشن داخل آن نوار» است
 *   (`intersectionRect.height`) و نه `intersectionRatio`؛ چون نسبت به
 *   اندازه‌ی خودِ سکشن سنجیده می‌شود و سکشن‌های بلند همیشه بازنده می‌شوند.
 */
export default function StickyTabs(): ReactNode {
  const navbarHeight = useNavbarHeight();
  const [activeId, setActiveId] = useState<CabinDetailSectionId>(
    CABIN_DETAIL_SECTIONS[0].id,
  );
  const [offset, setOffset] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const visibleHeightsRef = useRef(new Map<string, number>());

  /* ارتفاع واقعی نوار چسبان (نه عدد ثابت) تا نوارِ رصد دقیق جا بیفتد */
  useEffect(() => {
    const measure = () => {
      const tabsHeight =
        wrapperRef.current?.getBoundingClientRect().height ?? 0;
      setOffset(Math.round(navbarHeight + tabsHeight));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [navbarHeight]);

  useEffect(() => {
    if (offset <= 0 || typeof IntersectionObserver === "undefined") return;

    const elements = CABIN_DETAIL_SECTIONS.map((section) =>
      document.getElementById(section.id),
    ).filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    // نقشه‌ی ارتفاع‌های دیده‌شده از اجرای قبلی پاک می‌شود؛ وگرنه مقادیر
    // کهنه‌ی سکشنی که دیگر رصد نمی‌شود می‌تواند برنده‌ی Scroll Spy شود.
    const heights = visibleHeightsRef.current;
    heights.clear();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          heights.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRect.height : 0,
          );
        }

        let bestId: string | null = null;
        let bestHeight = 0;
        for (const section of CABIN_DETAIL_SECTIONS) {
          const height = heights.get(section.id) ?? 0;
          if (height > bestHeight) {
            bestHeight = height;
            bestId = section.id;
          }
        }

        if (bestId) setActiveId(bestId as CabinDetailSectionId);
      },
      {
        rootMargin: `-${offset + SPY_PADDING}px 0px -70% 0px`,
        threshold: 0,
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [offset]);

  /**
   * تب فعال در موبایل خودش را وسط نوار می‌آورد.
   *
   * ⚠️ دو گارد لازم است، وگرنه این افکت صفحه را می‌پراند:
   *
   *  ۱) **`scrollWidth <= clientWidth`** ⇒ نوار سرریز ندارد (دسکتاپ)، پس
   *     کاری برای انجام دادن نیست.
   *  ۲) **نوار باید کامل در دید باشد.** Scroll Spy می‌تواند سکشنی را فعال
   *     کند در حالی که نوار هنوز نچسبیده و پایین‌تر از دید است؛ در آن حالت
   *     `scrollIntoView` صفحه را عمودی اسکرول می‌کند و کاربر وسط مطالعه‌ی
   *     صفحه یک‌دفعه پایین می‌پرد. با این گارد، فقط وقتی نوار چسبیده و
   *     کامل دیده می‌شود اسکرول افقی انجام می‌شود (`block: "nearest"` هم
   *     عمودی بی‌اثر می‌ماند).
   */
  useEffect(() => {
    const list = listRef.current;
    if (!list || list.scrollWidth <= list.clientWidth) return;

    const listRect = list.getBoundingClientRect();
    if (listRect.top < 0 || listRect.bottom > window.innerHeight) return;

    list
      .querySelector<HTMLElement>(`[data-tab="${activeId}"]`)
      ?.scrollIntoView({
        behavior:
          typeof window.matchMedia === "function" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        block: "nearest",
        inline: "center",
      });
  }, [activeId]);

  return (
    <div
      ref={wrapperRef}
      className="border-foreground/10 bg-background-2/90 sticky top-[var(--hz-navbar-h)] z-30 border-b backdrop-blur-xl"
    >
      <Container variant="cabin-detail">
        <nav
          ref={listRef}
          aria-label="بخش‌های این اقامتگاه"
          className="hz-hide-scrollbar flex gap-1.5 overflow-x-auto overscroll-x-contain py-2"
        >
          {CABIN_DETAIL_SECTIONS.map((section) => {
            const Icon = SECTION_ICONS[section.id];
            const isActive = section.id === activeId;

            return (
              <a
                key={section.id}
                data-tab={section.id}
                href={`#${section.id}`}
                onClick={() => setActiveId(section.id)}
                aria-current={isActive ? "true" : undefined}
                className={`flex h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                  isActive
                    ? "bg-primary-400 shadow-primary-400/25 text-black shadow-lg"
                    : "text-text-gray hover:bg-foreground/5 hover:text-text"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {section.label}
              </a>
            );
          })}
        </nav>
      </Container>
    </div>
  );
}
