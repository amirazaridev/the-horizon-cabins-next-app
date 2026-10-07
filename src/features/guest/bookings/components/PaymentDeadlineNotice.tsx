"use client";

import { Clock, Hourglass, TriangleAlert } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { formatCountdown } from "@/features/guest/shared/lib/format";
import {
  PAYMENT_EXPIRED_LABEL,
  PAYMENT_EXPIRY_WARNING,
  PAYMENT_URGENT_MS,
} from "../constants/payment";

type Props = {
  /** مهلت پرداخت — ISO datetime از خود رزرو. */
  deadline: string;
  /** `page` نسخه‌ی برجسته‌تر برای صفحه‌ی پرداخت است. */
  variant?: "card" | "page";
};

/**
 * هشدار مهلت پرداخت + شمارش معکوس زنده.
 *
 * ⚠️ چرا کلاینتی؟ زمان باقی‌مانده در لحظه‌ی رندر سرور و کلاینت یکسان نیست
 * و رندر مستقیم آن هیدریشن mismatch می‌دهد. پس مقدار اولیه `null` است و
 * شمارش فقط بعد از mount (در `useEffect`) شروع می‌شود؛ تا آن لحظه
 * `--:--` نمایش داده می‌شود که هم جای ثابت دارد و هم پرش چیدمان نمی‌دهد.
 *
 * ⚠️ وضعیت «فوری» (زیر ۵ دقیقه) و «منقضی» رنگ قرمز می‌گیرند تا کاربر
 * بدون خواندن متن هم متوجه فوریت شود.
 */
export default function PaymentDeadlineNotice({
  deadline,
  variant = "card",
}: Props): ReactNode {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(deadline).getTime();

    const tick = () => setRemaining(target - Date.now());
    tick();

    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [deadline]);

  const isExpired = remaining !== null && remaining <= 0;
  const isUrgent = remaining !== null && !isExpired && remaining <= PAYMENT_URGENT_MS;
  const isAlarming = isExpired || isUrgent;

  const isPage = variant === "page";

  const containerClass = isAlarming
    ? "border-danger/35 bg-danger/10 text-danger-strong dark:text-red-300"
    : "border-primary-400/30 bg-primary-400/10 text-primary-600 dark:text-primary-300";

  const chipClass = isAlarming
    ? "border-danger/40 bg-danger/15"
    : "border-primary-400/40 bg-primary-400/15";

  const NoticeIcon = isAlarming ? TriangleAlert : Hourglass;

  return (
    <div
      className={`flex flex-wrap items-start gap-3 rounded-2xl border ${containerClass} ${
        isPage ? "px-5 py-4" : "px-4 py-3.5"
      }`}
    >
      <NoticeIcon className="mt-0.5 size-4 shrink-0" />

      {/* ⚠️ نقش هشدار روی متنِ ثابت است، نه روی کل ردیف: اگر شمارش معکوس
          داخل ناحیه‌ی live باشد، صفحه‌خوان هر ثانیه یک اعلان جدید می‌خواند. */}
      <div
        className={`min-w-0 flex-1 space-y-1 leading-relaxed ${
          isPage ? "text-sm" : "text-xs"
        }`}
        role={isAlarming ? "alert" : undefined}
      >
        <p className="font-semibold">
          {isExpired
            ? PAYMENT_EXPIRED_LABEL
            : "برای نهایی‌شدن رزرو، پرداخت را کامل کنید."}
        </p>
        <p className="opacity-90">{PAYMENT_EXPIRY_WARNING}</p>
      </div>

      {/* شمارش معکوس تا لغو خودکار */}
      <span
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold tabular-nums ${chipClass}`}
        aria-label="زمان باقی‌مانده تا لغو خودکار"
      >
        <Clock className="size-3.5" />
        {remaining === null ? "--:--" : formatCountdown(remaining)}
      </span>
    </div>
  );
}
