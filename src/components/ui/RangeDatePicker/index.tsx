"use client";

import { useCallback, useMemo, type ComponentType } from "react";
import { Calendar as RangeCalendar } from "react-multi-date-picker";
import type DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import "./style.module.css";

import RangeStageFields from "./RangeStageFields";
import { normalizeRange, startOfDay, toDateObject, toJsDate } from "./dates";
import { buildDayProps } from "./day-props";
import type { RangeDatePickerProps, RangeStage } from "./types";

export type {
  CalendarDayPrice,
  DateRange,
  DayOccupancy,
  RangeDatePickerProps,
  RangeStage,
} from "./types";

export { formatJalaliDate } from "./dates";

/** تایپ آزاد برای حالت range — جنریک‌های پیش‌فرض کتابخانه حالت single هستند */
const RangeCalendarAny = RangeCalendar as unknown as ComponentType<{
  value?: unknown;
  onChange?: (dates: unknown) => void;
  range?: boolean;
  numberOfMonths?: number;
  calendar?: unknown;
  locale?: unknown;
  minDate?: unknown;
  maxDate?: unknown;
  format?: string;
  rangeHover?: boolean;
  shadow?: boolean;
  className?: string;
  mapDays?: (props: {
    date: DateObject;
    /** شماره‌ی ماهِ ماهِ در حال نمایش — برای تشخیص روزهای همین ماه. */
    currentMonth?: unknown;
  }) => Record<string, unknown>;
}>;

export default function RangeDatePicker({
  value,
  onChange,
  onComplete,
  numberOfMonths = 2,
  minDate,
  maxDate,
  disabledDates,
  dayTitle,
  dayPrice,
  dayOccupancy,
  className = "",
}: RangeDatePickerProps) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const min = minDate ?? today;
  const isPriced = Boolean(dayPrice);

  /** کلاس‌های ریشه — `--priced` فقط وقتی نرخ شب می‌دهیم اضافه می‌شود. */
  const rootClassName = [
    "horizon-range-picker",
    isPriced && "horizon-range-picker--priced",
    "border-border bg-surface overflow-hidden rounded-2xl border p-1",
  ]
    .filter(Boolean)
    .join(" ");

  const disabledSet = useMemo(
    () => new Set((disabledDates ?? []).map(startOfDay)),
    [disabledDates],
  );

  const hasCustomDays =
    disabledSet.size > 0 ||
    Boolean(dayTitle) ||
    Boolean(dayPrice) ||
    Boolean(dayOccupancy);

  const mapDays = useCallback(
    ({ date }: { date: DateObject }): Record<string, unknown> =>
      buildDayProps(date, { disabledSet, dayTitle, dayPrice, dayOccupancy }),
    [disabledSet, dayTitle, dayPrice, dayOccupancy],
  );

  const selected = useMemo(() => {
    const list: DateObject[] = [];
    if (value.from) list.push(toDateObject(value.from));
    if (value.to) list.push(toDateObject(value.to));
    return list;
  }, [value.from, value.to]);

  const activeStage: RangeStage = !value.from
    ? "from"
    : !value.to
      ? "to"
      : "done";

  function handleChange(dates: unknown): void {
    // حالت range آرایه می‌دهد: [ورود] یا [ورود، خروج]
    const list = (
      Array.isArray(dates) ? dates : dates ? [dates] : []
    ) as unknown[];
    // ⭐ گارد ترتیب: همیشه `from < to` (و هر دو در ابتدای روز).
    const [from, to] = normalizeRange(toJsDate(list[0]), toJsDate(list[1]));

    onChange({ from, to });

    if (from && to) {
      onComplete?.({ from, to });
    }
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <RangeStageFields value={value} activeStage={activeStage} />

      <div className={rootClassName}>
        <RangeCalendarAny
          value={selected}
          onChange={handleChange}
          range
          numberOfMonths={numberOfMonths}
          calendar={persian}
          locale={persian_fa}
          minDate={min}
          {...(maxDate ? { maxDate } : {})}
          format="YYYY/MM/DD"
          rangeHover
          shadow={false}
          className="horizon-date-picker"
          {...(hasCustomDays ? { mapDays } : {})}
        />
      </div>
    </div>
  );
}
