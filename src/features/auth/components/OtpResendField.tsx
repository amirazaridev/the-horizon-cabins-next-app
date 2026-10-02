"use client";

import { RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

import { AUTH_LIMITS, faNumber } from "../schemas";
import { formatDuration } from "../hooks/useResendTimer";
import OtpInput from "./OtpInput";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  /** `true` وقتی ارسال/بررسی کد در جریان است. */
  isPending?: boolean;
  /** ثانیه‌های باقی‌مانده تا فعال شدن ارسال مجدد. */
  remaining: number;
  /** نسبت باقی‌مانده به کل (۱ → ۰) — برای نوار پیشرفت. */
  progress: number;
  /** `true` تا وقتی کاربر اجازه‌ی ارسال مجدد ندارد. */
  isResendLocked: boolean;
  onResend: () => void;
  className?: string;
};

/**
 * بلوک کد تایید: خانه‌های شش‌رقمی + تایمر خوشه‌دار ارسال مجدد.
 *
 * این بلوک قبلاً درون `RegisterForm` بود و منطق تایمر با مارک‌آپ قاطی
 * شده بود. این‌جا فقط نمایش است؛ همه‌ی محاسبات از هوک `useResendTimer`
 * می‌آید و از طریق پراپ تزریق می‌شود، پس کامپوننت خالص و قابل تست است.
 */
export default function OtpResendField({
  value,
  onChange,
  onComplete,
  error,
  disabled = false,
  isPending = false,
  remaining,
  progress,
  isResendLocked,
  onResend,
  className = "",
}: Props): ReactNode {
  return (
    <div className={className}>
      <OtpInput
        length={AUTH_LIMITS.otpLength}
        value={value}
        onChange={onChange}
        onComplete={onComplete}
        error={error}
        disabled={disabled}
        autoSubmitPending={isPending}
      />

      {/* تایمر ارسال مجدد */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {isResendLocked ? (
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="text-text/45 text-xs whitespace-nowrap">
              ارسال مجدد تا{" "}
              <span className="text-text/70 font-semibold tabular-nums">
                {formatDuration(remaining)}
              </span>
            </span>
            {/* نوار پیشرفت تایمر — بصری و بدون متن اضافه */}
            <span
              className="bg-foreground/8 relative h-1 min-w-8 flex-1 overflow-hidden rounded-full"
              role="presentation"
            >
              <span
                className="bg-primary-400/60 absolute inset-y-0 inset-s-0 rounded-full transition-[width] duration-500 ease-linear"
                style={{ width: `${progress * 100}%` }}
              />
            </span>
          </div>
        ) : (
          <span className="text-text/45 text-xs">کد را دریافت نکردید؟</span>
        )}

        <button
          type="button"
          onClick={onResend}
          disabled={isResendLocked || isPending}
          className="text-primary-400 hover:text-primary-300 flex shrink-0 items-center gap-1.5 text-xs font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RefreshCw className={`size-3.5 ${isPending ? "animate-spin" : ""}`} />
          ارسال مجدد کد
        </button>
      </div>

      <p className="text-text/35 mt-1 text-[11px] leading-relaxed">
        کد {faNumber(AUTH_LIMITS.otpLength)} رقمی است.
      </p>
    </div>
  );
}
