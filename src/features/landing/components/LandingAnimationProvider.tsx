"use client";

import { PropsWithChildren, useEffect, useState } from "react";

import { markLandingReady } from "@/libs/utils/landing-ready";
import useLandingAnimation from "@/features/landing/hooks/useLandingAnimation";
import LandingPreloader from "./LandingPreloader";

/** سقف انتظار برای آماده شدن فونت‌ها — بعد از آن به هر حال ادامه می‌دهیم */
const FONTS_TIMEOUT_MS = 500;

/**
 * هماهنگ‌کننده‌ی «پیش‌لودر → سایت اصلی».
 *
 * جریان کار:
 *  1. پیش‌لودر در همان HTML سرور هست (هم از `(main)/loading.tsx` و هم از
 *     همین‌جا)، پس در اولین paint دیده می‌شود و ترکیب‌بندی هیرو را نشان می‌دهد.
 *  2. بعد از آماده شدن فونت‌ها (با سقف زمانی) و دو فریمِ paint، فلگ `ready`
 *     بالا می‌رود.
 *  3. با بالا رفتن `ready`، پیش‌لودر محو می‌شود، تایملاین ورودِ GSAP شروع
 *     می‌شود و سیگنال «آماده» به Navbar می‌رود تا نوار هم همان لحظه بیاید.
 *
 * در ناوبری کلاینتی (نه بارگذاری سرد) مراسم ورود تکرار نمی‌شود: Navbar صفتِ
 * `data-client-nav` را روی `<html>` می‌گذارد و CSS همین پیش‌لودر را پنهان
 * می‌کند — بدون هیچ mismatch هیدریشن، چون این کار بیرون از React انجام
 * می‌شود.
 */
export default function LandingAnimationProvider({
  children,
}: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const { landingRef } = useLandingAnimation(ready);

  useEffect(() => {
    let cancelled = false;
    let rafId = 0;

    const finish = () => {
      if (cancelled) return;
      /* دو فریم: یکی برای paint اولیه، یکی تا حالتِ تازه اعمال شود */
      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(() => {
          if (cancelled) return;
          setReady(true);
          markLandingReady();
        });
      });
    };

    /*
     * ناوبری کلاینتی: چون پیش‌لودر با CSS پنهان است، منتظر ماندن برای فونت
     * فقط ورود هیرو را بی‌دلیل عقب می‌اندازد. پس بلافاصله ادامه می‌دهیم.
     */
    const skipWait = document.documentElement.dataset.clientNav === "1";

    if (skipWait) {
      rafId = requestAnimationFrame(finish);
      return () => {
        cancelled = true;
        cancelAnimationFrame(rafId);
      };
    }

    const fontsReady: Promise<unknown> =
      typeof document !== "undefined" && document.fonts
        ? document.fonts.ready
        : Promise.resolve();

    const safety = new Promise<void>((resolve) => {
      window.setTimeout(resolve, FONTS_TIMEOUT_MS);
    });

    Promise.race([fontsReady, safety]).then(finish, finish);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={landingRef} className="bg-background text-text min-h-screen">
      <LandingPreloader done={ready} />
      {children}
    </div>
  );
}
