"use client";

import { useEffect, useState, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";

import { formatJalaliFull, formatJalaliTime } from "../lib/date-range";

interface DataFreshnessProps {
  /** زمان آخرین بارگذاری موفق داده — یا null اگر هنوز نیامده */
  updatedAt: Date | null;
  /** در حال بارگذاری؟ */
  loading?: boolean;
  /** اقدام بازخوانی */
  onRefresh?: () => void;
}

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;

/**
 * نشانگر «آخرین به‌روزرسانی داده».
 *
 * ⭐ دو چیز را نشان می‌دهد:
 * ۱. **زمان نسبی** («۲ دقیقه پیش») — از `useEffect` با یک تیک هر ۳۰ ثانیه
 *    به‌روز می‌شود و در RTL/فارسی خواناست.
 * ۲. **زمان دقیق** (تاریخ+ساعت شمسی) به‌عنوان tooltip.
 *
 * ⚠️ مقدار نسبی **کلاینت‌محور** است (وابسته به ساعت کاربر) ⇒ برای جلوگیری
 * از hydration mismatch، تا اولین اجرای افکت `null` رندر می‌شود و در SSR
 * فقط زمان دقیق (قطعی از data) نشان داده می‌شود.
 */
export default function DataFreshness({
  updatedAt,
  loading = false,
  onRefresh,
}: DataFreshnessProps): ReactNode {
  const [relative, setRelative] = useState<string | null>(null);

  useEffect(() => {
    if (!updatedAt) return;

    const compute = () => setRelative(formatRelative(updatedAt));
    compute();

    const timer = window.setInterval(compute, 30 * SECONDS);
    return () => window.clearInterval(timer);
  }, [updatedAt]);

  if (!updatedAt) return null;

  return (
    <div className="text-text-gray flex items-center gap-2 text-xs">
      <span
        className="inline-flex items-center gap-1.5"
        title={`آخرین به‌روزرسانی: ${formatJalaliFull(updatedAt)} — ${formatJalaliTime(updatedAt)}`}
      >
        <span
          className={`size-1.5 rounded-full ${loading ? "bg-amber-500" : "bg-emerald-500"}`}
          aria-hidden="true"
        />
        {loading ? (
          <span>در حال به‌روزرسانی…</span>
        ) : (
          <span suppressHydrationWarning>
            آخرین به‌روزرسانی
            {relative ? ` · ${relative}` : ""}
          </span>
        )}
      </span>

      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          aria-label="بازخوانی دادهٔ داشبورد"
          className="hover:text-text cursor-pointer rounded-md p-1 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      )}
    </div>
  );
}

/** فاصله‌ی زمانی فارسی — «همین حالا» / «۳ دقیقه پیش» / «۲ ساعت پیش». */
function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime();

  if (diff < 45 * SECONDS) return "همین حالا";
  if (diff < MINUTES) return "کمتر از یک دقیقه پیش";

  const minutes = Math.round(diff / MINUTES);
  if (minutes < 60) return `${minutes.toLocaleString("fa-IR")} دقیقه پیش`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours.toLocaleString("fa-IR")} ساعت پیش`;

  const days = Math.round(hours / 24);
  return `${days.toLocaleString("fa-IR")} روز پیش`;
}
