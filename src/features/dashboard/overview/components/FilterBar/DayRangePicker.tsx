"use client";

import { useMemo } from "react";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { startOfDay } from "date-fns";

import {
  clampToToday,
  formatDateKey,
  formatJalaliDayMonth,
  formatJalaliFull,
} from "../../lib/date-range";

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

export default function DayRangePicker({
  from,
  to,
  onChange,
}: DayRangePickerProps) {
  const today = useMemo(() => startOfDay(new Date()), []);

  // هر دو تقویم: آینده disable، امروز آزاد
  const maxDate = useMemo(() => toDateObject(today), [today]);

  const fromValue = useMemo(() => toDateObject(from), [from]);
  const toValue = useMemo(() => toDateObject(to), [to]);

  // شروع حداکثر تا پایان (و امروز)، پایان حداقل از شروع
  const fromMax = useMemo(
    () => toDateObject(clampToToday(to, today)),
    [to, today],
  );
  const toMin = useMemo(() => toDateObject(from), [from]);

  function handleStartChange(next: SingleValue): void {
    const picked = toJsDate(next);
    if (!picked) return;

    const normalized = startOfDay(clampToToday(picked, today));
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

    const normalized = startOfDay(clampToToday(picked, today));
    // پایان نباید قبل از شروع باشد
    const safeEnd = normalized < from ? from : normalized;

    if (formatDateKey(safeEnd) !== formatDateKey(to)) {
      onChange(from, safeEnd);
    }
  }

  const inputClass =
    "!w-full !h-11 !rounded-xl !border !border-border !bg-background !px-3 !text-sm !text-text text-center";

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
            maxDate={fromMax}
            format="YYYY/MM/DD"
            calendarPosition="bottom-center"
            className="horizon-date-picker"
            containerClassName="w-full"
            inputClass={inputClass}
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
            maxDate={maxDate}
            format="YYYY/MM/DD"
            calendarPosition="bottom-center"
            className="horizon-date-picker"
            containerClassName="w-full"
            inputClass={inputClass}
          />
        </div>
      </div>

      <p className="text-text-gray mt-3 text-xs leading-6">
        تاریخ‌های بعد از امروز قابل انتخاب نیستند. تاریخ پایان نمی‌تواند قبل از
        تاریخ شروع باشد.
      </p>
    </div>
  );
}
