import { gsap } from "@/features/landing/utils/gsap";
import {
  ANIM,
  HERO_INTRO_SELECTORS,
} from "@/features/landing/utils/animations/selectors";

//? انیمیشن‌های ناحیه‌ی هیرو.

//* تایم‌لاین ورود هیرو — کل انیمیشن زیر ~۰.۸۵ ثانیه.
export function buildHeroIntro(): void {
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

  heroTl
    .from(
      ANIM.heroWord,
      { yPercent: 110, duration: 0.45, stagger: 0.035, ease: "power4.out" },
      0.08,
    )
    .from(ANIM.heroCopy, { y: 12, autoAlpha: 0, duration: 0.3 }, 0.34)
    .from(ANIM.search, { y: 16, autoAlpha: 0, duration: 0.35 }, 0.42)
}

//* پارالاکس + kenburns پس‌زمینه‌ی هیرو. 
export function buildHeroParallax(): void {
  gsap.fromTo(
    ANIM.heroBg,
    { scale: 1.12, yPercent: 0 },
    {
      scale: 1,
      yPercent: 8,
      ease: "none",
      scrollTrigger: {
        trigger: ANIM.hero,
        start: "top top",
        end: "bottom top",
        scrub: 1.1,
      },
    },
  );
}

//* پاک‌کردن پراپ‌های GSAP از المان‌های هیرو.
export function clearHeroProps(scope: HTMLElement): void {
  try {
    gsap.set(scope.querySelectorAll(HERO_INTRO_SELECTORS.join(",")), {
      clearProps: "all",
    });
  } catch {
    /* چیزی برای پاک کردن نیست */
  }
}
