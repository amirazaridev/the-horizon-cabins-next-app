"use client";

import { useEffect } from "react";

/**
 * قفل اسکرول صفحه — با شمارنده.
 *
 * چرا شمارنده؟ چون ممکن است دو لایه هم‌زمان باز باشند (مثلاً باتم‌شیت و
 * مودال خلاصه‌ی قیمت). اگر هر لایه مستقیم `overflow` را بازگرداند، بستن
 * یکی از آن‌ها قفل لایه‌ی دیگر را هم باز می‌کند و صفحه پشت مودال اسکرول
 * می‌شود. شمارنده تضمین می‌کند فقط آخرین لایه قفل را باز کند.
 *
 * ⚠️ قفل باید روی **هر دو** `<html>` و `<body>` گذاشته شود.
 * در این پروژه `globals.css` روی `html` مقدار `overflow-x: hidden` دارد؛
 * طبق قواعد CSS وقتی overflow ریشه‌ی سند غیر از `visible` باشد همان به
 * viewport اعمال می‌شود و overflow خودِ `body` دیگر به viewport منتقل
 * نمی‌شود. یعنی `document.body.style.overflow = "hidden"` به‌تنهایی فقط
 * `body` را به یک ظرف بی‌اسکرول تبدیل می‌کند و صفحه‌ی اصلی همچنان اسکرول
 * می‌شود. با ست‌کردن `html` هم، viewport قطعاً قفل می‌شود.
 *
 * ⚠️ ناپدیدشدن اسکرول‌بار عرض محتوا را زیاد می‌کند و کل صفحه یک پرش
 * کوچک می‌خورد. با `padding-inline-end` به اندازه‌ی عرض اسکرول‌بار، عرض
 * محتوا ثابت می‌ماند. (در RTL اسکرول‌بار سمت چپ است و `inline-end` دقیقاً
 * همان سمت را می‌گیرد.)
 */
let lockCount = 0;
let previousHtmlOverflow = "";
let previousBodyOverflow = "";
let previousBodyPaddingInlineEnd = "";

export default function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    if (lockCount === 0) {
      const root = document.documentElement;
      const body = document.body;

      const scrollbarWidth = window.innerWidth - root.clientWidth;

      previousHtmlOverflow = root.style.overflow;
      previousBodyOverflow = body.style.overflow;
      previousBodyPaddingInlineEnd = body.style.paddingInlineEnd;

      root.style.overflow = "hidden";
      body.style.overflow = "hidden";

      if (scrollbarWidth > 0) {
        body.style.paddingInlineEnd = `${scrollbarWidth}px`;
      }
    }

    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount > 0) return;

      const root = document.documentElement;
      const body = document.body;

      root.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.paddingInlineEnd = previousBodyPaddingInlineEnd;
    };
  }, [active]);
}
