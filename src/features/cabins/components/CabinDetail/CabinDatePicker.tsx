"use client";

import { CalendarDays } from "lucide-react";
import { useCallback, type ReactNode } from "react";
import DateRangePanel from "@/components/ui/Filter/panels/DateRangePanel";
import type { CalendarDayPrice } from "@/components/ui/RangeDatePicker";
import { toFaNumber } from "../../utils/booking";
import { useBooking } from "./BookingProvider";
import styles from "./CabinDatePicker.module.css";

export default function CabinDatePicker(): ReactNode {
  const {
    range,
    setRange,
    clearRange,
    nights,
    isComplete,
    priceForDate,
    dayOccupancy,
    minDate,
    maxDate,
    settings,
  } = useBooking();

  const dayPrice = useCallback(
    (date: Date): CalendarDayPrice | null => {
      const day = priceForDate(date);
      if (!day) return null;
      return {
        basePrice: day.basePrice,
        finalPrice: day.finalPrice,
        discounted: day.finalPrice < day.basePrice,
      };
    },
    [priceForDate],
  );

  return (
    <div className="border-foreground/10 bg-surface/60 overflow-hidden rounded-3xl border shadow-md backdrop-blur-sm">
      <div className="border-foreground/5 flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <CalendarDays className="text-primary-400 size-5" aria-hidden="true" />
          <h3 className="text-text font-bold">انتخاب تاریخ اقامت</h3>
        </div>

        {isComplete && (
          <span className="bg-primary-400/10 text-primary-600 dark:text-primary-400 rounded-full px-3 py-1 text-xs font-bold tabular-nums">
            {toFaNumber(nights)} شب
          </span>
        )}
      </div>

      <div className="p-4 sm:p-6">
        <DateRangePanel
          className={styles.reserveCalendar}
          value={range}
          onChange={setRange}
          minDate={minDate}
          maxDate={maxDate}
          dayPrice={dayPrice}
          dayOccupancy={dayOccupancy}
          showClear
          onClear={clearRange}
          clearLabel="حذف تاریخ"
        />
      </div>

      <p className="border-foreground/5 text-text-gray border-t px-5 py-3 text-xs leading-relaxed sm:px-6">
        روزهای هاشورخورده‌ی کامل رزرو شده‌اند. روزهای هاشور نصفه، روزِ ورود یا
        خروج یک رزرو هستند (ورود ۱۴:۰۰ و خروج ۱۲:۰۰): نیمه‌ی آزادشان را
        می‌توانید به‌عنوان یک سرِ رزرو خودتان انتخاب کنید — روزِ خروجِ رزروهای
        دیگر می‌تواند تاریخ ورود شما و روزِ ورودشان می‌تواند تاریخ خروج شما
        باشد. رزرو تا حداکثر {toFaNumber(settings.maxAdvanceBookingDays)} روز
        آینده ممکن است.
      </p>
    </div>
  );
}
