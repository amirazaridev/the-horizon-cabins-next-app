"use client";

import { useMemo } from "react";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { startOfDay } from "date-fns";

import {
  formatDateKey,
  formatJalaliDayMonth,
  formatJalaliFull,
} from "../../lib/date-range";
import { DATE_PICKER_INPUT_CLASS } from "./date-picker-input-class";

interface DayRangePickerProps {
  from: Date;
  to: Date;
  onChange: (from: Date, to: Date) => void;
}

type SingleValue = DateObject | null;

function toDateObject(date: Date): DateObject {
  return new DateObject({
    date,
    calendar: persian,
    locale: persian_fa,
  });
}

function toJsDate(value: unknown): Date | null {
  if (!value || typeof value !== "object" || !("toDate" in value)) {
    return null;
  }

  const date = (value as { toDate: () => Date }).toDate();
  return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
}

/**
 * انتخاب بازه‌ی «روز» برای فیلتر داشبورد.
 *
 * ⭐ از فاز دوم **آینده هم قابل انتخاب است** (بدون سقف بالا)، چون داشبورد
 * علاوه بر گذشته، رزروهای پیش‌رو و Pace را هم نشان می‌دهد. فقط این قید
 * می‌ماند که «پایان» نباید قبل از «شروع» بیفتد.
 */
export default function DayRangePicker({
  from,
  to,
  onChange,
}: DayRangePickerProps) {
  const fromValue = useMemo(() => toDateObject(from), [from]);
  const toValue = useMemo(() => toDateObject(to), [to]);

  // پایان هیچ‌وقت قبل از شروع نمی‌نشیند
  const toMin = useMemo(() => toDateObject(from), [from]);

  function handleStartChange(next: SingleValue): void {
    const picked = toJsDate(next);
    if (!picked) return;

    const normalized = startOfDay(picked);
    // اگر شروع بعد از پایان شد، پایان را هم جلو ببر
    const safeTo = normalized > to ? normalized : to;

    if (
      formatDateKey(normalized) !== formatDateKey(from) ||
      formatDateKey(safeTo) !== formatDateKey(to)
    ) {
      onChange(normalized, safeTo);
    }
  }

  function handleEndChange(next: SingleValue): void {
    const picked = toJsDate(next);
    if (!picked) return;

    const normalized = startOfDay(picked);
    // پایان نباید قبل از شروع باشد
    const safeEnd = normalized < from ? from : normalized;

    if (formatDateKey(safeEnd) !== formatDateKey(to)) {
      onChange(from, safeEnd);
    }
  }

  return (
    <div className="border-border bg-surface rounded-2xl border p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-4 text-xs sm:text-sm">
        <div>
          <span className="text-text-gray block text-[11px]">روز شروع</span>
          <strong className="text-text font-semibold">
            {formatJalaliDayMonth(from)}
          </strong>
        </div>
        <span className="bg-border h-px flex-1" />
        <div className="text-end">
          <span className="text-text-gray block text-[11px]">روز پایان</span>
          <strong className="text-text font-semibold">
            {formatJalaliFull(to)}
          </strong>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-text-gray mb-1.5 block text-xs font-medium">
            تاریخ شروع
          </label>
          <DatePicker
            value={fromValue}
            onChange={handleStartChange}
            calendar={persian}
            locale={persian_fa}
            format="YYYY/MM/DD"
            calendarPosition="bottom-center"
            className="horizon-date-picker"
            containerClassName="w-full"
            inputClass={DATE_PICKER_INPUT_CLASS}
          />
        </div>

        <div>
          <label className="text-text-gray mb-1.5 block text-xs font-medium">
            تاریخ پایان
          </label>
          <DatePicker
            value={toValue}
            onChange={handleEndChange}
            calendar={persian}
            locale={persian_fa}
            minDate={toMin}
            format="YYYY/MM/DD"
            calendarPosition="bottom-center"
            className="horizon-date-picker"
            containerClassName="w-full"
            inputClass={DATE_PICKER_INPUT_CLASS}
          />
        </div>
      </div>

      <p className="text-text-gray mt-3 text-xs leading-6">
        می‌توانید بازه را به آینده هم بکشید (برای دیدن رزروهای پیش‌رو). فقط
        تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد.
      </p>
    </div>
  );
}
