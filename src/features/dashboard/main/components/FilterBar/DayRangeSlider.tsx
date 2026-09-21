"use client";

import { useMemo } from "react";

import RangeGauge, { type GaugeRange } from "./RangeGauge";
import {
  formatDateKey,
  getDayGaugeDomain,
  dayIndexToDate,
  getJalaliDayOfMonth,
} from "../../lib/date-range";

interface DayRangeSliderProps {
  from: Date;
  to: Date;
  onChange: (from: Date, to: Date) => void;
}

/** اسلایدر بازه روزانه — هر دسته محدود به طول ماهِ خودش (۱-۳۱ / ۱-۳۰ / ۱-۲۹) */
export default function DayRangeSlider({
  from,
  to,
  onChange,
}: DayRangeSliderProps) {
  const domain = useMemo(
    () => getDayGaugeDomain(from, to),
    [from, to],
  );

  // ماکزیمم گژی = بزرگترین طول ماه (معمولاً ۳۱)
  const maxIndex = Math.max(domain.fromMonthDays, domain.toMonthDays) - 1;

  const clampStart = (value: number) =>
    Math.min(Math.max(value, 0), domain.fromMonthDays - 1);
  const clampEnd = (value: number) =>
    Math.min(Math.max(value, 0), domain.toMonthDays - 1);

  const startIndex = clampStart(getJalaliDayOfMonth(from) - 1);
  const endIndex = clampEnd(getJalaliDayOfMonth(to) - 1);

  // تیک‌ها: هر چند روز یک لیبل (برای ماه ۳۱ روزه: هر ۳ روز، برای ۳۰ روزه: هر ۳ روز)
  const ticks = useMemo(() => {
    const step = Math.max(1, Math.ceil((maxIndex + 1) / 10));
    return Array.from({ length: maxIndex + 1 }, (_, i) => {
      const labeled = i % step === 0 || i === maxIndex;
      return {
        key: String(i + 1),
        label: labeled ? String(i + 1) : "",
        position: i,
      };
    });
  }, [maxIndex]);

  function handleCommit({ start, end }: GaugeRange): void {
    // هر دسته با ماکزیمم ماه خودش محدود می‌شود
    const clampedStart = clampStart(start);
    const clampedEnd = clampEnd(end);

    const range = dayIndexToDate(domain, clampedStart, clampedEnd);

    if (
      formatDateKey(range.from) !== formatDateKey(from) ||
      formatDateKey(range.to) !== formatDateKey(to)
    ) {
      onChange(range.from, range.to);
    }
  }

  return (
    <RangeGauge
      startIndex={startIndex}
      endIndex={endIndex}
      maxIndex={maxIndex}
      formatValue={(index) => String(index + 1)}
      ticks={ticks}
      startAriaLabel="انتخاب روز شروع"
      endAriaLabel="انتخاب روز پایان"
      onCommit={handleCommit}
      hideTickLabelsOnMobile={false}
    />
  );
}