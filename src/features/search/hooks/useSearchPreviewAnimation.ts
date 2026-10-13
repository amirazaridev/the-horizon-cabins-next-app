"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

//* انیمیشن سبک باز/بسته شدن بخش پیش‌نمایش جستجو: wrapper (height 0→اندازه‌گیری‌شده + fade)، content (y 16→0)، کارت‌ها (stagger کوچک).
//* ── سه تله‌ای که این پیاده‌سازی عمداً از آن‌ها دوری می‌کند ──
//* ۱) توینِ «بستن» باید پیش از ساخت تایم‌لاینِ «باز شدن» کشته شود (`killTweensOf`). چون `overwrite` گزینه‌ی **tween** است نه **timeline**، توین بستن زنده می‌ماند و با تایم‌لاین می‌جنگد ⇒ سکشن باز می‌شود ولی ارتفاع صفر می‌ماند.
//* ۲) هرگز `gsap.from()` نیست، فقط `fromTo()`. `from()` مقادیر شروع را فوراً inline می‌نویسد و اگر تایم‌لاین وسط راه `kill()` شود، محتوا برای همیشه نامرئی می‌ماند.
//* ۳) هر شاخه‌ای که انیمیت نمی‌کند، حالت نهایی و «قابل‌دیدن» را صریحاً با `gsap.set` می‌نویسد.
//* با `prefers-reduced-motion` کاملاً بی‌حرکت می‌شود.
export function useSearchPreviewAnimation(open: boolean, revision: string) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    //* ⭐ هر اجرا از یک وضعیت قطعی شروع می‌شود؛ وگرنه توینِ «بستنِ» اجرای قبلی زنده می‌ماند و همزمان با تایم‌لاینِ «باز شدن» روی `height` می‌نویسد.
    gsap.killTweensOf([wrapper, content]);

    const cards = Array.from(
      content.querySelectorAll<HTMLElement>("[data-preview-card]"),
    );

    //* برگرداندن محتوا به حالت کاملاً قابل‌دیدن (بدون انیمیشن)
    const showContent = () => {
      gsap.set(content, { y: 0, autoAlpha: 1 });
      if (cards.length > 0) gsap.set(cards, { y: 0, autoAlpha: 1 });
      gsap.set(wrapper, { height: "auto", autoAlpha: 1 });
    };

    //* بسته
    if (!open) {
      wasOpen.current = false;

      if (reduceMotion) {
        gsap.set(wrapper, { height: 0, autoAlpha: 0 });
      } else {
        gsap.to(wrapper, {
          height: 0,
          autoAlpha: 0,
          duration: 0.3,
          ease: "power2.in",
          overwrite: true,
        });
      }
      return;
    }

    //* قبلاً باز بود: فقط ارتفاع را آزاد کن. شرط `offsetHeight > 0` برای StrictMode است: React افکت را دوبار اجرا می‌کند و در اجرای دوم نباید انیمیشنِ باز شدن رد شود.
    if (wasOpen.current && wrapper.offsetHeight > 0) {
      showContent();
      return;
    }

    wasOpen.current = true;

    if (reduceMotion) {
      showContent();
      return;
    }

    //* اندازه‌گیری هدف. اگر صفر برگردد، انیمیت به ارتفاع صفر یعنی «سکشن باز نمی‌شود» — پس مستقیماً حالتِ نهاییِ مرئی را می‌نویسیم.
    const target = content.offsetHeight || content.scrollHeight;

    if (target <= 0) {
      showContent();
      return;
    }

    gsap.set(wrapper, { height: 0, autoAlpha: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(wrapper, { height: "auto" });
      },
    });

    tl.fromTo(
      wrapper,
      { height: 0, autoAlpha: 0 },
      { height: target, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
      0,
    )
      .fromTo(
        content,
        { y: 16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.45, ease: "power2.out" },
        0.04,
      )
      .fromTo(
        cards,
        { y: 14, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.4,
          stagger: 0.06,
          ease: "power2.out",
        },
        0.1,
      );

    return () => {
      tl.kill();
    };
  }, [open, revision]);

  return { wrapperRef, contentRef };
}
