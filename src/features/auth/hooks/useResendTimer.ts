"use client";

import { useEffect, useState } from "react";

type UseResendTimerOptions = {
  /** مدت انتظار به ثانیه. */
  seconds: number;
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
