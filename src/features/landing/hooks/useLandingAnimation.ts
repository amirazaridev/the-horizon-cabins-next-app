"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export default function useHorizonLandingAnimation() {
  const landingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // ---------- Hero intro ----------
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .from(".hz-hero-eyebrow", { y: 16, autoAlpha: 0, duration: 0.6 })
        .from(".hz-hero-word", {
          yPercent: 110,
          duration: 1,
          stagger: 0.06,
          ease: "power4.out",
        }, "-=0.25")
        .from(".hz-hero-copy", { y: 18, autoAlpha: 0, duration: 0.7 }, "-=0.55")
        .from(".hz-search", { y: 24, autoAlpha: 0, duration: 0.7 }, "-=0.45")
        .from(".hz-scroll-indicator", { autoAlpha: 0, duration: 0.5 }, "-=0.2");

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
        }
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
      gsap.from(".hz-category-heading > *", {
        y: 20,
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".hz-category-heading",
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });

      // ---------- reveal عمومی (batch شده برای پرفورمنس) ----------
      const revealItems = gsap.utils.toArray<HTMLElement>(".hz-reveal");
      if (revealItems.length) {
        gsap.set(revealItems, { y: 34, autoAlpha: 0 });
        ScrollTrigger.batch(revealItems, {
          start: "top 88%",
          onEnter: (batch) =>
            gsap.to(batch, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: "power2.out", overwrite: true }),
          onLeaveBack: (batch) =>
            gsap.to(batch, { y: 34, autoAlpha: 0, duration: 0.4, stagger: 0.05, overwrite: true }),
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
            gsap.to(batch, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.07, ease: "power3.out", overwrite: true }),
          onLeaveBack: (batch) =>
            gsap.to(batch, { y: 36, autoAlpha: 0, duration: 0.3, overwrite: true }),
        });
      });

      // بعد از لود کامل عکس‌ها/فونت‌ها، موقعیت تریگرها رو دوباره حساب کن
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      return () => window.removeEventListener("load", onLoad);
    }, landingRef);

    return () => mm.revert();
  }, []);

  return { landingRef };
}