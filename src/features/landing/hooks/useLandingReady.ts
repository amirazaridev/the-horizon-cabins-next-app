"use client";

import { useEffect, useState } from "react";

import { markAppReady } from "@/libs/utils/app-ready";

//* سقف انتظار برای `document.fonts.ready` — تا بارگذاری فونت صفحه را قفل نکند
const FONTS_TIMEOUT_MS = 500;

//* آمادگی لندینگ
export function useLandingReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let rafId = 0;
    let timeoutId: number | undefined;

    const markReady = () => {
      if (cancelled) return;

      setReady(true);
      markAppReady();
    };

    //* دو فریم صبر می‌کنیم تا مرورگر چیدمان/فونت نهایی را paint کند و تریگرهای GSAP با ارتفاع درست ساخته شوند.
    const finish = () => {
      if (cancelled) return;

      rafId = requestAnimationFrame(() => {
        if (cancelled) return;

        rafId = requestAnimationFrame(markReady);
      });
    };

    const cleanup = () => {
      cancelled = true;
      cancelAnimationFrame(rafId);

      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };

    const skipWait = document.documentElement.dataset.clientNav === "1";

    if (skipWait) {
      finish();
      return cleanup;
    }

    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    const safety = new Promise<void>((resolve) => {
      timeoutId = window.setTimeout(resolve, FONTS_TIMEOUT_MS);
    });

    const onSettled = () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }

      finish();
    };

    Promise.race([fontsReady, safety]).then(onSettled, onSettled);

    return cleanup;
  }, []);

  return ready;
}
