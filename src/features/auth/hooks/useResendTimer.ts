"use client";

import { useEffect, useState } from "react";

type UseResendTimerOptions = {
  /** مدت انتظار به ثانیه. */
  seconds: number;
  /**
   * مبدأ شمارش (timestamp). هر بار که کد ارسال می‌شود عوض می‌شود، پس
   * تایمر از نو شروع می‌کند. `null` ⇒ تایمری در جریان نیست.
   */
  startedAt: number | null;
};

type UseResendTimerResult = {
  /** ثانیه‌های باقی‌مانده تا فعال شدن دکمه‌ی ارسال مجدد. */
  remaining: number;
  /** نسبت باقی‌مانده به کل (۱ → ۰) — برای نوار پیشرفت. */
  progress: number;
  /** آیا هنوز باید صبر کرد؟ */
  isLocked: boolean;
};

function computeRemaining(startedAt: number | null, seconds: number): number {
  if (startedAt === null) return 0;
  return Math.max(0, Math.ceil((startedAt + seconds * 1000 - Date.now()) / 1000));
}

/**
 * تایمر شمارش معکوس «ارسال مجدد کد».
 *
 * ⚠️ چرا `Date.now()` و نه کاهش یک عدد در هر تیک؟
 * `setInterval` زیر بار (تب پنهان، رندر سنگین) عقب می‌افتد و با کاهش شمارنده
 * تایمر طولانی‌تر از واقعیت می‌شود. اینجا مبدأ زمانی ذخیره و باقی‌مانده از
 * اختلاف ساعت واقعی حساب می‌شود، پس بعد از خواب رفتن تب هم درست برمی‌گردد.
 *
 * ⚠️ چرا مقدار از interval می‌آید و نه همگام‌سازی با prop؟
 * دو الگوی رایج در این پروژه lint می‌گیرند:
 *  - `setState` در بدنه‌ی افکت ⇒ `react-hooks/set-state-in-effect`
 *  - همگام‌سازی «state قبلی» در رندر ⇒ `react-hooks/refs`
 * راه‌حل: `startedAt` تغییر می‌کند ⇒ `computeRemaining` عوض می‌شود ⇒ افکت
 * دوباره اجرا می‌شود و `tick()` که داخلش یک `setState` می‌زند مقدار تازه
 * را می‌نشاند. مقدار اولیه‌ی `useState` هم همان تابع است، پس رندر اول
 * هرگز عدد کهنه نشان نمی‌دهد.
 */
export function useResendTimer({
  seconds,
  startedAt,
}: UseResendTimerOptions): UseResendTimerResult {
  const [remaining, setRemaining] = useState(() =>
    computeRemaining(startedAt, seconds),
  );

  useEffect(() => {
    const tick = () => setRemaining(computeRemaining(startedAt, seconds));

    tick();
    if (startedAt === null) return;

    const intervalId = window.setInterval(tick, 500);
    return () => window.clearInterval(intervalId);
  }, [seconds, startedAt]);

  return {
    remaining,
    progress: seconds > 0 ? remaining / seconds : 0,
    isLocked: startedAt !== null && remaining > 0,
  };
}

/** تبدیل ثانیه به `1:05` — با `tabular-nums` در UI پایدار نمایش داده می‌شود. */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}
