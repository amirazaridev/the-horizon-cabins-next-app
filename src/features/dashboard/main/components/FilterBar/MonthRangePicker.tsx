"use client";

import { useMemo } from "react";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { startOfDay } from "date-fns";
import { endOfMonth, endOfYear, startOfMonth, startOfYear } from "date-fns-jalali";

import {
  clampToToday,
  formatDateKey,
  formatJalaliMonthYear,
  getJalaliYear,
} from "../../lib/date-range";

interface MonthRangePickerProps {
  from: Date;
  to: Date;
  onChange: (from: Date, to: Date) => void;
}

type DatePickerValue = DateObject | DateObject[] | null;

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

export default function MonthRangePicker({
  from,
  to,
  onChange,
}: MonthRangePickerProps) {
  const value = useMemo<DateObject[]>(
    () => [toDateObject(startOfMonth(from)), toDateObject(startOfMonth(to))],
    [from, to],
  );

  const today = useMemo(() => startOfDay(new Date()), []);

  const minDate = useMemo(() => toDateObject(startOfYear(from)), [from]);
  // آینده disable: سقف تقویم امروز است
  const maxDate = useMemo(
    () => toDateObject(clampToToday(endOfYear(to), today)),
    [to, today],
  );

  function handleChange(next: DatePickerValue): void {
    if (!Array.isArray(next) || next.length === 0) return;

    const nextFrom = toJsDate(next[0]);
    if (!nextFrom) return;

    const startYear = getJalaliYear(from);
    const endYear = getJalaliYear(to);

    // در بازه چندساله، انتخاب اول فقط باید از سال شروع باشد.
    if (next.length === 1) {
      if (getJalaliYear(nextFrom) !== startYear) return;
      return;
    }

    const nextTo = toJsDate(next[1]);
    if (!nextTo || getJalaliYear(nextTo) !== endYear) return;

    // اگر ماه آینده انتخاب شد، نادیده بگیر
    if (startOfMonth(nextFrom) > today || startOfMonth(nextTo) > today) return;

    const normalizedFrom = startOfMonth(nextFrom);
    // سقف ماه پایان: آخر ماه، ولی نه بعد از امروز
    const normalizedTo = clampToToday(endOfMonth(nextTo), today);

    if (
      formatDateKey(normalizedFrom) !== formatDateKey(from) ||
      formatDateKey(normalizedTo) !== formatDateKey(to)
    ) {
      onChange(normalizedFrom, normalizedTo);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-4 text-xs sm:text-sm">
        <div>
          <span className="block text-[11px] text-text-gray">ماه شروع</span>
          <strong className="font-semibold text-text">
            {formatJalaliMonthYear(from)}
          </strong>
        </div>
        <span className="h-px flex-1 bg-border" />
        <div className="text-end">
          <span className="block text-[11px] text-text-gray">ماه پایان</span>
          <strong className="font-semibold text-text">
            {formatJalaliMonthYear(to)}
          </strong>
        </div>
      </div>

      <DatePicker
        value={value}
        onChange={handleChange}
        range
        onlyMonthPicker
        calendar={persian}
        locale={persian_fa}
        minDate={minDate}
        maxDate={maxDate}
        numberOfMonths={2}
        format="MMMM YYYY"
        calendarPosition="bottom-center"
        className="horizon-date-picker horizon-month-picker"
        containerClassName="w-full"
        inputClass="!w-full !h-11 !rounded-xl !border !border-border !bg-background !px-3 !text-sm !text-text"
      />

      <p className="mt-3 text-xs leading-6 text-text-gray">
        ابتدا ماه شروع را در سال {getJalaliYear(from)} و سپس ماه پایان را در سال{" "}
        {getJalaliYear(to)} انتخاب کنید. ماه‌های بعد از ماه جاری قابل انتخاب
        نیستند.
      </p>
    </div>
  );
}
