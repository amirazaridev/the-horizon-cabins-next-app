"use client";

import { useEffect } from "react";

/**
 * قفل اسکرول صفحه — با شمارنده.
 *
 * چرا شمارنده؟ چون ممکن است دو لایه هم‌زمان باز باشند (مثلاً باتم‌شیت و
 * مودال خلاصه‌ی قیمت). اگر هر لایه مستقیم `overflow` را بازگرداند، بستن
 * یکی از آن‌ها قفل لایه‌ی دیگر را هم باز می‌کند و صفحه پشت مودال اسکرول
 * می‌شود. شمارنده تضمین می‌کند فقط آخرین لایه قفل را باز کند.
 */
let lockCount = 0;
let previousOverflow = "";

export default function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) document.body.style.overflow = previousOverflow;
    };
  }, [active]);
}
