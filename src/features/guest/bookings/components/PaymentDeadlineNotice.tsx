import { Clock, Hourglass, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

import { formatJalaliDateTime } from "@/features/guest/shared/lib/format";
import { isPaymentExpired } from "../lib/payment-deadline";
import {
  PAYMENT_EXPIRED_LABEL,
  PAYMENT_EXPIRY_WARNING,
} from "../constants/payment";

type Props = {
  /** مهلت پرداخت — ISO datetime از خود رزرو. */
  deadline: string;
  /** `page` نسخه‌ی برجسته‌تر برای صفحه‌ی پرداخت است. */
  variant?: "card" | "page";
};

/**
 * هشدار مهلت پرداخت + **زمان دقیق انقضا** (بدون شمارش معکوس).
 *
 * ⚠️ چرا شمارش معکوس حذف شد؟ لغو خودکار را کرون بک‌اند انجام می‌دهد
 * (`jobs/booking-expiration.job.ts`) و دیتابیس منبع حقیقت است. پس UI فقط
 * «زمان مهلت» را نشان می‌دهد و رزروِ لغوشده در بازدید/رفرش بعدی در تب
 * «لغوشده‌ها» ظاهر می‌شود.
 *
 * ⚠️ چرا Server Component (بدون `"use client"`)؟ وضعیت «گذشته/نگذشته» به
 * زمان وابسته است؛ اگر آن را در کلاینت با تایمر محاسبه کنیم، بین HTML سرور
 * و هیدریشن اختلاف می‌افتد. اینجا محاسبه **یک‌بار روی سرور** انجام می‌شود و
 * نتیجه پایدار است (هیچ پرش یا mismatch نداریم).
 */
export default function PaymentDeadlineNotice({
  deadline,
  variant = "card",
}: Props): ReactNode {
  const isExpired = isPaymentExpired(deadline);
  const isPage = variant === "page";

  const containerClass = isExpired
    ? "border-danger/35 bg-danger/10 text-danger-strong dark:text-red-300"
    : "border-primary-400/30 bg-primary-400/10 text-primary-600 dark:text-primary-300";

  const NoticeIcon = isExpired ? TriangleAlert : Hourglass;

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border ${containerClass} ${
        isPage ? "px-5 py-4" : "px-4 py-3.5"
      }`}
    >
      <NoticeIcon className="mt-0.5 size-4 shrink-0" />

      {/* ⚠️ نقش هشدار روی متنِ ثابت است، نه روی زمان: زمان یک مقدار ثابت
          است و اعلام دوباره‌ی آن به صفحه‌خوان لازم نیست. */}
      <div
        className={`min-w-0 flex-1 space-y-1 leading-relaxed ${
          isPage ? "text-sm" : "text-xs"
        }`}
        role={isExpired ? "alert" : undefined}
      >
        <p className="font-semibold">
          {isExpired
            ? PAYMENT_EXPIRED_LABEL
            : "برای نهایی‌شدن رزرو، پرداخت را کامل کنید."}
        </p>
        <p className="opacity-90">{PAYMENT_EXPIRY_WARNING}</p>
        <p className="flex items-center gap-1.5 font-bold">
          <Clock className="size-3.5 shrink-0" />
          <span>مهلت پرداخت:</span>
          <span className="tabular-nums">{formatJalaliDateTime(deadline)}</span>
        </p>
      </div>
    </div>
  );
}
