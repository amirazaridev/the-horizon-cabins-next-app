import { gsap, ScrollTrigger } from "@/features/landing/utils/gsap";
import { ANIM } from "@/features/landing/utils/animations/selectors";

//? انیمیشن‌های سکشن‌های لندینگ.


//* reveal عمومی — `batch` شده تا تعداد تریگرها کم بماند.
export function buildRevealBatch(): void {
  const items = gsap.utils.toArray<HTMLElement>(ANIM.reveal);
  if (!items.length) return;

  gsap.set(items, { y: 34, autoAlpha: 0 });

  ScrollTrigger.batch(items, {
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

//* گریدهای کارت (دسته‌بندی‌ها / اقامتگاه‌ها).
export function buildCardGridReveal(): void {
  [ANIM.categoryCard, ANIM.stayCard].forEach((selector) => {
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
}

/*
 * بعد از لود کامل عکس‌ها/فونت‌ها، موقعیت تریگرها را دوباره حساب می‌کند.
 * تابع cleanup برمی‌گرداند تا `matchMedia` بتواند پاکش کند.
 */
export function refreshScrollTriggersOnLoad(): () => void {
  const onLoad = () => ScrollTrigger.refresh();

  window.addEventListener("load", onLoad);

  return () => window.removeEventListener("load", onLoad);
}
