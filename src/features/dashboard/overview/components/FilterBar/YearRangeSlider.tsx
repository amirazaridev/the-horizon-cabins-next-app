"use client";

import { useMemo } from "react";
import { startOfDay } from "date-fns";

import RangeGauge, { type GaugeRange } from "@/components/ui/RangeGauge";
import {
  clampToToday,
  formatDateKey,
  formatJalaliYear,
  getYearGaugeDomain,
  yearAtIndex,
  yearIndexOf,
  yearRangeAtIndices,
} from "../../lib/date-range";

interface YearRangeSliderProps {
  from: Date;
  to: Date;
  onChange: (from: Date, to: Date) => void;
}

export default function YearRangeSlider({
  from,
  to,
  onChange,
}: YearRangeSliderProps) {
  const today = useMemo(() => startOfDay(new Date()), []);

  const domain = useMemo(
    () => getYearGaugeDomain(today, from, to),
    [today, from, to],
  );

  const maxIndex = Math.max(1, domain.count - 1);

  const clampIndex = (value: number) => Math.min(Math.max(value, 0), maxIndex);

  const startIndex = clampIndex(yearIndexOf(from, domain.start));
  const endIndex = clampIndex(yearIndexOf(to, domain.start));

  const ticks = useMemo(
    () =>
      Array.from({ length: domain.count }, (_, i) => {
        const date = yearAtIndex(domain.start, i);
        return {
          key: `year-${i}`,
          label: formatJalaliYear(date),
          position: i,
        };
      }),
    [domain],
  );

  function handleCommit({ start, end }: GaugeRange): void {
    const range = yearRangeAtIndices(domain.start, start, end);
    const safeTo = clampToToday(range.to, today);

    if (
      formatDateKey(range.from) !== formatDateKey(from) ||
      formatDateKey(safeTo) !== formatDateKey(to)
    ) {
      onChange(range.from, safeTo);
    }
  }

  return (
    <RangeGauge
      startIndex={startIndex}
      endIndex={endIndex}
      min={0}
      max={maxIndex}
      step={1}
      formatValue={(index) =>
        formatJalaliYear(yearAtIndex(domain.start, index))
      }
      ticks={ticks}
      startAriaLabel="انتخاب سال شروع"
      endAriaLabel="انتخاب سال پایان"
      onCommit={handleCommit}
      showInputs={false}
    />
  );
}
