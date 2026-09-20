import {
  addDays,
  differenceInCalendarDays,
  format as formatGregorian,
  isSameDay,
  isValid,
  startOfDay,
  subDays,
} from "date-fns";
import {
  addMonths,
  addYears,
  differenceInCalendarMonths,
  differenceInCalendarYears,
  endOfMonth,
  endOfYear,
  format as formatJalali,
  startOfMonth,
  startOfYear,
} from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";

import { PARAM_FROM, PARAM_TO } from "../data/mock-data";

export const PARAM_RANGE = "range";
export const PARAM_DATE_TAB = "dateTab";

export type DateRangePreset =
  | "last-7-days"
  | "last-30-days"
  | "this-season"
  | "this-year"
  | "custom";

export const DATE_RANGE_PRESETS: readonly {
  value: DateRangePreset;
  title: string;
}[] = [
  { value: "last-7-days", title: "۷ روز اخیر" },
  { value: "last-30-days", title: "۳۰ روز اخیر" },
  { value: "this-season", title: "این فصل" },
  { value: "this-year", title: "امسال" },
  { value: "custom", title: "بازه دلخواه" },
];

const FIXED_PRESETS: readonly Exclude<DateRangePreset, "custom">[] = [
  "last-7-days",
  "last-30-days",
  "this-season",
  "this-year",
];

export interface DateRange {
  from: Date;
  to: Date;
}

export interface ResolvedDateRange extends DateRange {
  preset: DateRangePreset;
}

export interface MonthTick {
  date: Date;
  label: string;
  position: number;
}

function toDateOnly(date: Date): Date {
  return startOfDay(date);
}

export function getToday(): Date {
  return toDateOnly(new Date());
}

export function parseDateParam(value: string | null): Date | null {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);
  return isValid(date) ? toDateOnly(date) : null;
}

export function formatDateKey(date: Date): string {
  return formatGregorian(toDateOnly(date), "yyyy-MM-dd");
}

export function formatJalaliDayMonth(date: Date): string {
  return formatJalali(date, "d MMMM", { locale: faIR });
}

export function formatJalaliFull(date: Date): string {
  return formatJalali(date, "d MMMM yyyy", { locale: faIR });
}

export function formatJalaliMonthYear(date: Date): string {
  return formatJalali(date, "MMMM yyyy", { locale: faIR });
}

export function formatJalaliMonthShort(date: Date): string {
  return formatJalali(date, "MMM", { locale: faIR });
}

export function formatJalaliYear(date: Date): string {
  return formatJalali(date, "yyyy", { locale: faIR });
}

function getJalaliMonthNumber(date: Date): number {
  return Number(formatJalali(date, "M", { locale: faIR }));
}

export function getStartOfJalaliSeason(date: Date): Date {
  const month = getJalaliMonthNumber(date);
  const monthsToSubtract = (month - 1) % 3;

  return addMonths(startOfMonth(date), -monthsToSubtract);
}

export function getPresetDateRange(
  preset: Exclude<DateRangePreset, "custom">,
  today: Date = getToday(),
): DateRange {
  switch (preset) {
    case "last-7-days":
      return {
        from: subDays(today, 6),
        to: today,
      };

    case "last-30-days":
      return {
        from: subDays(today, 29),
        to: today,
      };

    case "this-season":
      return {
        from: getStartOfJalaliSeason(today),
        to: today,
      };

    case "this-year":
      return {
        from: startOfYear(today),
        to: today,
      };
  }
}

function isFixedPreset(
  value: string | null,
): value is Exclude<DateRangePreset, "custom"> {
  return FIXED_PRESETS.some((preset) => preset === value);
}

function findMatchingPreset(
  from: Date,
  to: Date,
  today: Date,
): Exclude<DateRangePreset, "custom"> | null {
  for (const preset of FIXED_PRESETS) {
    const range = getPresetDateRange(preset, today);

    if (isSameDay(from, range.from) && isSameDay(to, range.to)) {
      return preset;
    }
  }

  return null;
}

export function resolveDashboardDateRange(
  searchParams: Pick<URLSearchParams, "get">,
): ResolvedDateRange {
  const today = getToday();
  const rangeParam = searchParams.get(PARAM_RANGE);
  const fromParam = parseDateParam(searchParams.get(PARAM_FROM));
  const toParam = parseDateParam(searchParams.get(PARAM_TO));

  if (fromParam && toParam && fromParam <= toParam) {
    const matchingPreset = findMatchingPreset(fromParam, toParam, today);

    return {
      from: fromParam,
      to: toParam,
      preset: rangeParam === "custom" ? "custom" : (matchingPreset ?? "custom"),
    };
  }

  const fallbackPreset: DateRangePreset =
    rangeParam === "custom"
      ? "custom"
      : isFixedPreset(rangeParam)
        ? rangeParam
        : "last-30-days";

  const fallbackRange = getPresetDateRange(
    fallbackPreset === "custom" ? "last-30-days" : fallbackPreset,
    today,
  );

  return {
    ...fallbackRange,
    preset: fallbackPreset,
  };
}

export function getGaugeDomain(
  today: Date,
  selectedFrom: Date,
  selectedTo: Date,
): DateRange {
  const currentYearStart = startOfYear(today);

  let domainStart =
    selectedFrom < currentYearStart ? toDateOnly(selectedFrom) : currentYearStart;

  let domainEnd = selectedTo > today ? toDateOnly(selectedTo) : today;

  if (domainStart > domainEnd) {
    domainStart = currentYearStart;
    domainEnd = today;
  }

  return {
    from: domainStart,
    to: domainEnd,
  };
}

export function getDateIndex(date: Date, domainStart: Date): number {
  return differenceInCalendarDays(toDateOnly(date), domainStart);
}

export function getDateAtIndex(domainStart: Date, index: number): Date {
  return addDays(domainStart, index);
}

export function getJalaliMonthTicks(domain: DateRange): MonthTick[] {
  const ticks: MonthTick[] = [];
  let cursor = startOfMonth(domain.from);
  let guard = 0;

  while (cursor <= domain.to && guard < 24) {
    ticks.push({
      date: new Date(cursor),
      label: formatJalali(cursor, "MMMM", { locale: faIR }),
      position: differenceInCalendarDays(cursor, domain.from),
    });

    cursor = addMonths(cursor, 1);
    guard += 1;
  }

  return ticks;
}

/* ==================================================================
   تب‌های ماه / سال — دامین و تبدیل ایندکس (تقویم جلالی)
   ================================================================== */

export type DateFilterTab = "day" | "month" | "year";

export function isDateFilterTab(value: string | null): value is DateFilterTab {
  return value === "day" || value === "month" || value === "year";
}

/** مقدار فیلتر تاریخ — همان چیزی که در URL (from/to) + تب فعال ذخیره می‌شود */
export interface DateFilterValue {
  from: string;
  to: string;
  tab: DateFilterTab;
}

/** متن روی دکمه فیلتر تاریخ: «از X تا Y» */
export function formatDateFilterLabel(value: DateFilterValue): string | undefined {
  const from = parseDateParam(value.from);
  const to = parseDateParam(value.to);
  if (!from || !to) return undefined;

  if (value.tab === "year")
    return `از ${formatJalaliYear(from)} تا ${formatJalaliYear(to)}`;
  if (value.tab === "month")
    return `از ${formatJalaliMonthYear(from)} تا ${formatJalaliMonthYear(to)}`;
  return `از ${formatJalaliDayMonth(from)} تا ${formatJalaliFull(to)}`;
}

export interface IndexDomain {
  start: Date;
  count: number;
}

const MONTH_WINDOW = 12;
const YEAR_WINDOW = 5;

export function getMonthGaugeDomain(
  today: Date,
  selectedFrom: Date,
  selectedTo: Date,
): IndexDomain {
  const defaultStart = startOfMonth(addMonths(today, -(MONTH_WINDOW - 1)));
  const fromMonth = startOfMonth(selectedFrom);
  const start = fromMonth < defaultStart ? fromMonth : defaultStart;

  const endRef = selectedTo > today ? selectedTo : today;
  const count =
    differenceInCalendarMonths(startOfMonth(endRef), start) + 1;

  return { start, count };
}

export function getYearGaugeDomain(
  today: Date,
  selectedFrom: Date,
  selectedTo: Date,
): IndexDomain {
  const defaultStart = startOfYear(addYears(today, -(YEAR_WINDOW - 1)));
  const fromYear = startOfYear(selectedFrom);
  const start = fromYear < defaultStart ? fromYear : defaultStart;

  const endRef = selectedTo > today ? selectedTo : today;
  const count =
    differenceInCalendarYears(startOfYear(endRef), start) + 1;

  return { start, count };
}

export function monthIndexOf(date: Date, domainStart: Date): number {
  return differenceInCalendarMonths(startOfMonth(date), domainStart);
}

export function monthAtIndex(domainStart: Date, index: number): Date {
  return addMonths(domainStart, index);
}

export function monthRangeAtIndices(
  domainStart: Date,
  start: number,
  end: number,
): DateRange {
  return {
    from: monthAtIndex(domainStart, start),
    to: endOfMonth(monthAtIndex(domainStart, end)),
  };
}

export function yearIndexOf(date: Date, domainStart: Date): number {
  return differenceInCalendarYears(startOfYear(date), domainStart);
}

export function yearAtIndex(domainStart: Date, index: number): Date {
  return addYears(domainStart, index);
}

export function yearRangeAtIndices(
  domainStart: Date,
  start: number,
  end: number,
): DateRange {
  return {
    from: yearAtIndex(domainStart, start),
    to: endOfYear(yearAtIndex(domainStart, end)),
  };
}