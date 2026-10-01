"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

/** المان‌هایی که انیمیشن ورود روی آن‌ها اجرا می‌شود (برای پاک‌سازی هنگام خطا) */
const HERO_SELECTORS = [
  ".hz-hero-eyebrow",
  ".hz-hero-word",
  ".hz-hero-copy",
  ".hz-search",
  ".hz-scroll-indicator",
];

/**
 * انیمیشن‌های لندینگ.
 *
 * @param enabled تا وقتی `false` است هیچ انیمیشنی اجرا نمی‌شود. این فلگ بعد
 *                از آماده شدن فونت‌ها و اولین paint توسط
 *                `LandingAnimationProvider` بالا می‌رود تا ورودِ سایت دقیقاً
 *                هم‌زمان با محو شدن پیش‌لودر شروع شود.
 */
export default function useHorizonLandingAnimation(enabled = true) {
  const landingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const scope = landingRef.current;
    if (!scope) return;

    /* ---------- محافظت: اگر GSAP در دسترس نباشد/خطا بدهد، صفحه سالم بماند ---------- */
    const clearHeroProps = () => {
      try {
        gsap.set(scope.querySelectorAll(HERO_SELECTORS.join(",")), {
          clearProps: "all",
        });
      } catch {
        /* چیزی برای پاک کردن نیست */
      }
    };

    let mm: ReturnType<typeof gsap.matchMedia> | null = null;

    try {
      mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          // ---------- ورود هیرو: کل تایملاین زیر ~۰.۸۵ ثانیه ----------
          /*
           * هر مرحله با یک زمانِ مطلق (position parameter) چیده شده تا طولِ
           * کل انیمیشن قابل پیش‌بینی و کوتاه بماند، نه این‌که با آفست‌های
           * منفی روی هم تلنبار شود.
           */
          const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

          heroTl
            .from(".hz-hero-eyebrow", { y: 12, autoAlpha: 0, duration: 0.3 }, 0)
            .from(
              ".hz-hero-word",
              {
                yPercent: 110,
                duration: 0.45,
                stagger: 0.035,
                ease: "power4.out",
              },
              0.08,
            )
            .from(
              ".hz-hero-copy",
              { y: 12, autoAlpha: 0, duration: 0.3 },
              0.34,
            )
            .from(".hz-search", { y: 16, autoAlpha: 0, duration: 0.35 }, 0.42)
            .from(
              ".hz-scroll-indicator",
              { autoAlpha: 0, duration: 0.25 },
              0.58,
            );

          // ---------- Hero parallax + kenburns ----------
          gsap.fromTo(
            ".hz-hero-bg",
            { scale: 1.12, yPercent: 0 },
            {
              scale: 1,
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: ".hz-hero",
                start: "top top",
                end: "bottom top",
                scrub: 1.1,
              },
            },
          );

          // محو شدن ایندیکیتور اسکرول موقع شروع اسکرول
          gsap.to(".hz-scroll-indicator", {
            autoAlpha: 0,
            y: 12,
            ease: "none",
            scrollTrigger: {
              trigger: ".hz-hero",
              start: "top top",
              end: "18% top",
              scrub: true,
            },
          });

          // ---------- هدر بخش دسته‌بندی‌ها ----------
          /*
           * فقط یک‌بار پخش می‌شود و با اسکرول به بالا معکوس نمی‌شود
           * (`play none none none`) تا تیتر بخش بعد از دیده‌شدن ثابت بماند.
           */
          gsap.from(".hz-category-heading > *", {
            y: 20,
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".hz-category-heading",
              start: "top 88%",
              toggleActions: "play none none none",
            },
          });

          // ---------- reveal عمومی (batch شده برای پرفورمنس) ----------
          const revealItems = gsap.utils.toArray<HTMLElement>(".hz-reveal");
          if (revealItems.length) {
            gsap.set(revealItems, { y: 34, autoAlpha: 0 });
            ScrollTrigger.batch(revealItems, {
              start: "top 88%",
              onEnter: (batch) =>
                gsap.to(batch, {
                  y: 0,
                  autoAlpha: 1,
                  duration: 0.8,
                  stagger: 0.1,
                  ease: "power2.out",
                  overwrite: true,
                }),
              onLeaveBack: (batch) =>
                gsap.to(batch, {
                  y: 34,
                  autoAlpha: 0,
                  duration: 0.4,
                  stagger: 0.05,
                  overwrite: true,
                }),
            });
          }

          // ---------- گریدهای کارت (دسته‌بندی‌ها / اقامتگاه‌ها) ----------
          [".hz-category-card", ".hz-stay-card"].forEach((selector) => {
            const items = gsap.utils.toArray<HTMLElement>(selector);
            if (!items.length) return;
            gsap.set(items, { y: 36, autoAlpha: 0 });
            ScrollTrigger.batch(items, {
              start: "top 90%",
              onEnter: (batch) =>
                gsap.to(batch, {
                  y: 0,
                  autoAlpha: 1,
                  duration: 0.7,
                  stagger: 0.07,
                  ease: "power3.out",
                  overwrite: true,
                }),
              onLeaveBack: (batch) =>
                gsap.to(batch, {
                  y: 36,
                  autoAlpha: 0,
                  duration: 0.3,
                  overwrite: true,
                }),
            });
          });

          // بعد از لود کامل عکس‌ها/فونت‌ها، موقعیت تریگرها رو دوباره حساب کن
          const onLoad = () => ScrollTrigger.refresh();
          window.addEventListener("load", onLoad);

          return () => window.removeEventListener("load", onLoad);
        },
        scope,
      );
    } catch {
      /*
       * GSAP در دسترس نیست یا هنگام ساخت تایملاین خطا داده. چون انیمیشن‌های
       * ورود از نوع `from()` هستند، یک شکستِ میان‌راه می‌تواند المان‌ها را
       * در حالت `visibility:hidden` رها کند — پس صریحاً پاک می‌کنیم تا سایت
       * کاملاً قابل استفاده بماند.
       */
      clearHeroProps();
    }

    return () => {
      mm?.revert();
      clearHeroProps();
    };
  }, [enabled]);

  return { landingRef };
}
