"use client";

import { BedDouble, Check, LogIn, LogOut, Users } from "lucide-react";

import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { formatCountWithUnit } from "../../lib/metrics/format";
import {
  BOOKING_STATUS_LABELS,
  type BookingStatus,
  type TodayActivityItem,
} from "../../types/dashboard.types";

interface TodayItemRowProps {
  item: TodayActivityItem;
  /** آیا عملیات این ردیف در حال اجراست؟ */
  pending: boolean;
  /** آیا عملیات این ردیف قبلاً در این نشست انجام شده؟ */
  done: boolean;
  /** وضعیت فعلی (ممکن است اورراید شده باشد) */
  status: BookingStatus;
  /** آیا به‌خاطر عملیات ردیف دیگر غیرفعال است؟ */
  disabled: boolean;
  onAction: () => void;
}

/**
 * ردیف یک ورود/خروج امروز.
 *
 * ⚠️ دو چیدمان عمدی: زیر `sm` عمودی (اطلاعات، سپس اکشن)، از `sm` بالا
 * سه‌ستونی (`1fr auto auto`). تصمیم ریسپانسیو با CSS گرفته می‌شود، نه JS.
 */
export default function TodayItemRow({
  item,
  pending,
  done,
  status,
  disabled,
  onAction,
}: TodayItemRowProps) {
  const isArrival = item.kind === "arrival";

  // برچسب و رنگ اکشن بر اساس نوع عملیات
  const actionLabel = isArrival ? "تحویل اتاق" : "تخلیه اتاق";
  const actionVariant = isArrival ? "success" : "warning";

  const toneText = isArrival
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-amber-600 dark:text-amber-400";

  return (
    <li
      className={`border-border bg-background flex flex-col gap-3 rounded-xl border px-4 py-3.5 transition-colors sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-5 ${
        done ? "opacity-70" : ""
      }`}
    >
      {/* ستون ۱: مهمان + اقامتگاه */}
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`size-2.5 shrink-0 rounded-full ${
            isArrival ? "bg-emerald-500" : "bg-amber-500"
          }`}
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-col">
          <span className="text-text truncate text-sm font-semibold">
            {item.guestName}
          </span>
          <span className="text-text-gray truncate text-xs">
            {item.cabinName}
          </span>

          {/* متادیتا — شب و مهمان */}
          <div className="text-text-gray mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1">
              <BedDouble className="size-3.5" />
              {formatCountWithUnit(item.numNights, "night")}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5" />
              {formatCountWithUnit(item.numGuests, "guest")}
            </span>
          </div>
        </div>
      </div>

      {/* ستون ۲: نوع عملیات + وضعیت */}
      <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium ${toneText}`}
        >
          {isArrival ? (
            <LogIn className="size-4" />
          ) : (
            <LogOut className="size-4" />
          )}
          {isArrival ? "ورود" : "خروج"}
        </span>
        <span className="text-text-gray text-xs">
          {BOOKING_STATUS_LABELS[status]}
        </span>
      </div>

      {/* ستون ۳: اکشن */}
      <div className="sm:w-32">
        {done ? (
          <span className="text-text-gray inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Check className="size-4" />
            انجام شد
          </span>
        ) : (
          <Button
            type="button"
            size="md"
            shape="xl"
            variant={actionVariant}
            fullWidth
            disabled={pending || disabled}
            onClick={onAction}
          >
            {pending ? (
              <Spinner size="xs" />
            ) : isArrival ? (
              <LogIn className="size-4" />
            ) : (
              <LogOut className="size-4" />
            )}
            {pending ? "در حال ثبت…" : actionLabel}
          </Button>
        )}
      </div>
    </li>
  );
}
