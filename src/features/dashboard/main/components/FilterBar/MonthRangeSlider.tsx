"use client";

import { useMemo } from "react";
import { startOfDay } from "date-fns";

import RangeGauge, { type GaugeRange } from "./RangeGauge";
import {
  formatDateKey,
  formatJalaliMonthShort,
  formatJalaliMonthYear,
  getMonthGaugeDomain,
  monthAtIndex,
  monthIndexOf,
  monthRangeAtIndices,
} from "../../lib/date-range";

interface MonthRangeSliderProps {
  from: Date;
  to: Date;
  onChange: (from: Date, to: Date) => void;
}

/** اسلایدر بازه ماهانه (تقویم جلالی) — commit بر مرز ماه برمی‌گرداند */
export default function MonthRangeSlider({
  from,
  to,
  onChange,
}: MonthRangeSliderProps) {
  const today = useMemo(() => startOfDay(new Date()), []);

  const domain = useMemo(
    () => getMonthGaugeDomain(today, from, to),
    [today, from, to],
  );

  const maxIndex = Math.max(1, domain.count - 1);

  const clampIndex = (value: number) =>
    Math.min(Math.max(value, 0), maxIndex);

  const startIndex = clampIndex(monthIndexOf(from, domain.start));
  const endIndex = clampIndex(monthIndexOf(to, domain.start));

  // اگر دامین خیلی باز شد، لیبل‌ها را خلوت می‌کنیم (حدود ۱۲ لیبل)
  const ticks = useMemo(() => {
    const step = Math.max(1, Math.ceil(domain.count / 12));
    return Array.from({ length: domain.count }, (_, i) => {
      const date = monthAtIndex(domain.start, i);
      const labeled = i % step === 0 || i === domain.count - 1;
      return {
        key: formatDateKey(date),
        label: labeled ? formatJalaliMonthShort(date) : "",
        position: i,
      };
    });
  }, [domain]);

  function handleCommit({ start, end }: GaugeRange): void {
    const range = monthRangeAtIndices(domain.start, start, end);

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
      formatValue={(index) =>
        formatJalaliMonthYear(monthAtIndex(domain.start, index))
      }
      ticks={ticks}
      startAriaLabel="انتخاب ماه شروع"
      endAriaLabel="انتخاب ماه پایان"
      onCommit={handleCommit}
    />
  );
}
