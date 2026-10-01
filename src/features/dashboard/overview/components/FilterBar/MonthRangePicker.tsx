"use client";

import { useMemo } from "react";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { startOfDay } from "date-fns";
import {
  addMonths,
  endOfMonth,
  startOfMonth,
  startOfYear,
} from "date-fns-jalali";

import {
  clampToToday,
  formatDateKey,
  formatJalaliMonthYear,
  formatJalaliYear,
  getJalaliYear,
} from "../../lib/date-range";

/**
 * ⚠️ import جانبی (side-effect) — استایل‌های مخصوص همین کامپوننت با
 * `:global()` نوشته شده‌اند (کلاس‌های `rmdp-*` کتابخانه‌اند و نباید hash
 * شوند)، پس مقدار export‌شده‌ای ندارد؛ ولی باید import شود تا CSS در
 * باندل بیاید و با داشبورد کد-اسپلیت شود.
 */
// import "./MonthRangePicker.module.css";
import { DATE_PICKER_INPUT_CLASS } from "./date-picker-input-class";

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

/**
 * انتخاب بازهٔ ماه با دو فیلد مستقل: «ماه شروع» و «ماه پایان».
 *
 * هر فیلد یک `DatePicker` است — دقیقاً همان کامپوننتی که تب «روز» استفاده
 * می‌کند — تا پاپ‌آوری باز شود که خودِ کتابخانه مدیریتش می‌کند:
 * موقعیت‌دهی هوشمند (بالا/پایین نسبت به فضا)، فلش، و بستن با کلیک بیرون
 * یا اسکرول. تفاوت تنها در این است که هر تقویم تک‌ماه است
 * (`numberOfMonths={1}` + `onlyMonthPicker`) و روی سالِ خودش قفل می‌شود.
 *
 * مقدار نهایی موقع «اعمال» روی URL می‌نشیند.
 */
export default function MonthRangePicker({
  from,
  to,
  onChange,
}: MonthRangePickerProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const currentMonth = useMemo(() => startOfMonth(today), [today]);

  const fromYear = getJalaliYear(from);
  const toYear = getJalaliYear(to);

  /* ---------------- سر شروع ---------------- */

  const fromValue = useMemo(() => toDateObject(startOfMonth(from)), [from]);
  const fromWindow = useMemo(() => toDateObject(startOfYear(from)), [from]);

  /**
   * سقفِ تقویم شروع:
   * - اگر سال شروع همان سال جاری باشد => تا ماه جاری
   * - وگرنه => تا آخرِ همان سال
   * و در هر دو حالت هیچ‌وقت بعد از ماه پایان نرود، چون بازه نباید برعکس شود.
   */
  const fromMax = useMemo(() => {
    const yearCap =
      fromYear === getJalaliYear(today)
        ? currentMonth
        : startOfMonth(addMonths(startOfYear(from), 11));

    const rangeCap = startOfMonth(to);

    return toDateObject(endOfMonth(rangeCap < yearCap ? rangeCap : yearCap));
  }, [fromYear, today, currentMonth, from, to]);

  function handleFromChange(value: DatePickerValue): void {
    const next = toJsDate(Array.isArray(value) ? value[0] : value);
    if (!next) return;

    const normalizedFrom = startOfMonth(next);

    // سقف: از ماه پایان و از ماه جاری جلوتر نرو
    if (normalizedFrom > startOfMonth(to) || normalizedFrom > currentMonth) {
      return;
    }

    if (formatDateKey(normalizedFrom) !== formatDateKey(from)) {
      onChange(normalizedFrom, to);
    }
  }

  /* ---------------- سر پایان ---------------- */

  const toValue = useMemo(() => toDateObject(startOfMonth(to)), [to]);
  const toWindow = useMemo(() => toDateObject(startOfYear(to)), [to]);

  /**
   * سقفِ تقویم پایان:
   * - اگر سال پایان همان سال جاری باشد => تا ماه جاری
   * - وگرنه => تا آخرِ همان سال
   */
  const toMax = useMemo(() => {
    const yearCap =
      toYear === getJalaliYear(today)
        ? currentMonth
        : startOfMonth(addMonths(startOfYear(to), 11));

    return toDateObject(endOfMonth(yearCap));
  }, [toYear, today, currentMonth, to]);

  function handleToChange(value: DatePickerValue): void {
    const next = toJsDate(Array.isArray(value) ? value[0] : value);
    if (!next) return;

    const normalizedTo = clampToToday(endOfMonth(next), today);

    // کف: از ماه شروع عقب‌تر نرو
    if (normalizedTo < startOfMonth(from)) return;

    if (formatDateKey(normalizedTo) !== formatDateKey(to)) {
      onChange(from, normalizedTo);
    }
  }

  /* ---------------- رندر ---------------- */

  return (
    <div className="border-border bg-surface rounded-2xl border p-4 sm:p-5">
      {/* خلاصهٔ بازهٔ انتخاب‌شده */}
      <div className="mb-4 flex items-center justify-between gap-4 text-xs sm:text-sm">
        <div>
          <span className="text-text-gray block text-[11px]">ماه شروع</span>
          <strong className="text-text font-semibold">
            {formatJalaliMonthYear(from)}
          </strong>
        </div>
        <span className="bg-border h-px flex-1" />
        <div className="text-end">
          <span className="text-text-gray block text-[11px]">ماه پایان</span>
          <strong className="text-text font-semibold">
            {formatJalaliMonthYear(to)}
          </strong>
        </div>
      </div>

      {/*
        دو فیلد مستقل: در دسکتاپ کنار هم (`sm:grid-cols-2`) و در موبایل
        زیر هم، تا هر تقویم روی فیلد خودش باز شود.
      */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-text-gray mb-1.5 block text-xs font-medium">
            ماه شروع — سال {formatJalaliYear(from)}
          </label>
          <DatePicker
            value={fromValue}
            onChange={handleFromChange}
            onlyMonthPicker
            calendar={persian}
            locale={persian_fa}
            currentDate={fromWindow}
            minDate={fromWindow}
            maxDate={fromMax}
            format="MMMM YYYY"
            shadow={false}
            buttons={false}
            calendarPosition="bottom-center"
            className="horizon-date-picker "
            containerClassName="w-full"
            inputClass={DATE_PICKER_INPUT_CLASS}
          />
        </div>

        <div>
          <label className="text-text-gray mb-1.5 block text-xs font-medium">
            ماه پایان — سال {formatJalaliYear(to)}
          </label>
          <DatePicker
            value={toValue}
            onChange={handleToChange}
            onlyMonthPicker
            calendar={persian}
            locale={persian_fa}
            currentDate={toWindow}
            minDate={toWindow}
            maxDate={toMax}
            format="MMMM YYYY"
            shadow={false}
            buttons={false}
            calendarPosition="bottom-center"
            className="horizon-date-picker"
            containerClassName="w-full"
            inputClass={DATE_PICKER_INPUT_CLASS}
          />
        </div>
      </div>

      <p className="text-text-gray mt-3 text-xs leading-6">
        ماه شروع و ماه پایان را جداگانه انتخاب کنید. ماه‌های بعد از ماه جاری
        قابل انتخاب نیستند و ماه پایان نمی‌تواند قبل از ماه شروع باشد.
      </p>
    </div>
  );
}
