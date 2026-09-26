"use client";

import { useMemo } from "react";
import { differenceInCalendarDays, startOfDay } from "date-fns";

import RangeGauge, { type GaugeRange } from "./RangeGauge";
import {
  formatDateKey,
  formatJalaliDayMonth,
  getDateAtIndex,
  getDateIndex,
  getGaugeDomain,
  getJalaliMonthTicks,
} from "../../lib/date-range";

interface DateRangeFilterProps {
  from: Date;
  to: Date;
  onChange: (from: Date, to: Date) => void;
}

/** اسلایدر بازه روزانه — همان رفتار قبلی، روی گیج عمومی */
export default function DateRangeFilter({
  from,
  to,
  onChange,
}: DateRangeFilterProps) {
  const today = useMemo(() => startOfDay(new Date()), []);

  const domain = useMemo(
    () => getGaugeDomain(today, from, to),
    [today, from, to],
  );

  const maxIndex = Math.max(
    1,
    differenceInCalendarDays(domain.to, domain.from),
  );

  const clampIndex = (value: number) => Math.min(Math.max(value, 0), maxIndex);

  const startIndex = clampIndex(getDateIndex(from, domain.from));
  const endIndex = clampIndex(getDateIndex(to, domain.from));

  const monthTicks = useMemo(() => getJalaliMonthTicks(domain), [domain]);

  function handleCommit({ start, end }: GaugeRange): void {
    const nextFrom = getDateAtIndex(domain.from, start);
    const nextTo = getDateAtIndex(domain.from, end);

    if (
      formatDateKey(nextFrom) !== formatDateKey(from) ||
      formatDateKey(nextTo) !== formatDateKey(to)
    ) {
      onChange(nextFrom, nextTo);
    }
  }

  return (
    <RangeGauge
      startIndex={startIndex}
      endIndex={endIndex}
      maxIndex={maxIndex}
      formatValue={(index) =>
        formatJalaliDayMonth(getDateAtIndex(domain.from, index))
      }
      ticks={monthTicks.map((tick) => ({
        key: formatDateKey(tick.date),
        label: tick.label,
        position: tick.position,
      }))}
      startAriaLabel="انتخاب تاریخ شروع"
      endAriaLabel="انتخاب تاریخ پایان"
      onCommit={handleCommit}
    />
  );
}
