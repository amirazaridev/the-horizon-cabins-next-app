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

import { PARAM_FROM, PARAM_TO } from "../constants/dashboard-params";

export const PARAM_RANGE = "range";
export const PARAM_DATE_TAB = "dateTab";

export type DateRangePreset =
  "last-7-days" | "last-30-days" | "this-season" | "this-year" | "custom";

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

/**
 * ساعت و دقیقه با اعداد فارسی — برای نشانگر «آخرین به‌روزرسانی».
 * ⚠️ ساعت ۲۴ساعته است تا در RTL با «ق.ظ/ب.ظ» قاطی نشود.
 */
export function formatJalaliTime(date: Date): string {
  return formatJalali(date, "HH:mm", { locale: faIR });
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

/**
 * برچسب باکت سری‌های زمانی — بسته به سطح تجمیع.
 *
 * - `daily`   → «۱۲ مهر» (روز + ماه)
 * - `weekly`  → «۱۲ مهر» (ابتدای هفته)
 * - `monthly` → «مهر ۱۴۰۵» (ماه + سال)
 *
 * ⚠️ ورودی `date` همان `date` هر `RevenuePoint`/`OccupancyAdrPoint` است
 * (ابتدای باکت) — پس هیچ تبدیل اضافه‌ای لازم نیست.
 */
export function formatBucketLabel(
  date: Date,
  granularity: "daily" | "weekly" | "monthly",
): string {
  if (granularity === "monthly") return formatJalaliMonthYear(date);
  return formatJalaliDayMonth(date);
}

export function getJalaliYear(date: Date): number {
  return Number(formatJalali(date, "yyyy", { locale: faIR }));
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

/**
 * بازه‌ی تاریخ داشبورد را از URL می‌خواند.
 *
 * ⭐ از فاز دوم، **بازه می‌تواند به آینده کشیده شود** (برای ویجت‌های
 * Forward/Pace و سناریوهای «رزروهای پیش‌رو»). بنابراین دیگر به «امروز»
 * کلمپ نمی‌شود؛ فقط ترتیب `from <= to` تضمین می‌شود.
 *
 * اگر پارامترها نامعتبر باشند، به preset پیش‌فرض (`last-30-days`) برمی‌گردد.
 */
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
    selectedFrom < currentYearStart
      ? toDateOnly(selectedFrom)
      : currentYearStart;

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

/* ==================================================================
   دکمه‌های دسترسی سریع
   ================================================================== */

export type QuickRangePreset =
  | "last-7"
  | "last-month"
  | "last-6months"
  | "last-year"
  | "next-30";

export const QUICK_RANGE_PRESETS: readonly {
  value: QuickRangePreset;
  label: string;
  days: number;
  /** اگر true باشد، بازه از امروز به سمت آینده ساخته می‌شود */
  forward?: boolean;
}[] = [
  { value: "last-7", label: "۷ روز اخیر", days: 7 },
  { value: "last-month", label: "۱ ماه اخیر", days: 30 },
  { value: "last-6months", label: "۶ ماه اخیر", days: 180 },
  { value: "last-year", label: "۱ سال اخیر", days: 365 },
  { value: "next-30", label: "۳۰ روز آینده", days: 30, forward: true },
];

export function getPresetDateRangeFromDays(
  days: number,
  today: Date = getToday(),
  forward = false,
): DateRange {
  if (forward) {
    return {
      from: today,
      to: addDays(today, days - 1),
    };
  }

  return {
    from: subDays(today, days - 1),
    to: today,
  };
}

/* ==================================================================
   محدود کردن تاریخ‌ها به امروز
   ================================================================== */

/**
 * اگر تاریخ بعد از امروز باشد، امروز را برمی‌گرداند.
 *
 * ⚠️ از فاز دوم، داشبورد **بازه را به آینده باز می‌گذارد**، پس این تابع
 * دیگر در مسیر فیلتر تاریخ استفاده نمی‌شود. فقط برای سازگاری با کدهای
 * قدیمی نگه داشته شده (مثل presetهای سالانه).
 */
export function clampToToday(date: Date, today: Date = getToday()): Date {
  const d = toDateOnly(date);
  const t = toDateOnly(today);
  return d > t ? t : d;
}

/** متن روی دکمه فیلتر تاریخ: «از X تا Y» */
export function formatDateFilterLabel(
  value: DateFilterValue,
): string | undefined {
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
/** تعداد سال‌های آینده‌ی قابل‌نمایش در گژی سال (فضای کشیدن به جلو) */
const FUTURE_YEAR_MARGIN = 1;

export function getMonthGaugeDomain(
  today: Date,
  selectedFrom: Date,
  selectedTo: Date,
): IndexDomain {
  const defaultStart = startOfMonth(addMonths(today, -(MONTH_WINDOW - 1)));
  const fromMonth = startOfMonth(selectedFrom);
  const start = fromMonth < defaultStart ? fromMonth : defaultStart;

  const endRef = selectedTo > today ? selectedTo : today;
  const count = differenceInCalendarMonths(startOfMonth(endRef), start) + 1;

  return { start, count };
}

/**
 * دامنه‌ی گژی سال.
 *
 * ⭐ از فاز دوم یک سال **بعد از** پایان انتخاب‌شده هم به دامنه اضافه می‌شود
 * (`FUTURE_YEAR_MARGIN`) تا دستگیره‌ی پایان فضای کشیده‌شدن به آینده داشته
 * باشد و کاربر برای انتخاب سال پیش‌رو گیر نکند.
 */
export function getYearGaugeDomain(
  today: Date,
  selectedFrom: Date,
  selectedTo: Date,
): IndexDomain {
  const defaultStart = startOfYear(addYears(today, -(YEAR_WINDOW - 1)));
  const fromYear = startOfYear(selectedFrom);
  const start = fromYear < defaultStart ? fromYear : defaultStart;

  const endRef = selectedTo > today ? selectedTo : today;
  const endYear = startOfYear(addYears(endRef, FUTURE_YEAR_MARGIN));
  const count = differenceInCalendarYears(endYear, start) + 1;

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

/* ==================================================================
   هلپرهای جدید برای گژی روز (۱-۳۱ با طول ماه متغیر)
   ================================================================== */

/** تعداد روزهای ماه جلالی برای یک تاریخ داده */
export function getDaysInJalaliMonth(date: Date): number {
  const nextMonth = addMonths(startOfMonth(date), 1);
  return differenceInCalendarDays(nextMonth, startOfMonth(date));
}

/** تعیین روز در ماه جلالی (۱-۳۱) */
export function getJalaliDayOfMonth(date: Date): number {
  return Number(formatJalali(date, "d", { locale: faIR }));
}

/** تنظیم روز در ماه جلالی (حفظ ماه و سال) */
export function setJalaliDayOfMonth(date: Date, day: number): Date {
  const monthStart = startOfMonth(date);
  return addDays(monthStart, day - 1);
}

/** دامین ماه با محدودیت: اگر to-year = سال جاری، تا ماه جاری */
export function getMonthGaugeDomainLimited(
  today: Date,
  selectedFrom: Date,
  selectedTo: Date,
): IndexDomain {
  const fromMonth = startOfMonth(selectedFrom);
  const toMonth = startOfMonth(selectedTo);
  const currentMonth = startOfMonth(today);

  // شروع: فروردین سال from
  const start = startOfMonth(
    addMonths(
      fromMonth,
      -(Number(formatJalali(fromMonth, "M", { locale: faIR })) - 1),
    ),
  );

  // پایان: اگر to-year = سال جاری، ماه جاری؛ وگرنه آخر سال to
  const toYear = Number(formatJalali(toMonth, "yyyy", { locale: faIR }));
  const currentYear = Number(formatJalali(today, "yyyy", { locale: faIR }));
  const end = toYear === currentYear ? currentMonth : endOfYear(toMonth);

  const count = differenceInCalendarMonths(end, start) + 1;

  return { start, count };
}

/** دامین روز: ایندکس ۰ = روز ۱ ماه from، ایندکس آخر = روز آخر ماه to */
export interface DayGaugeDomain {
  fromMonthStart: Date;
  toMonthStart: Date;
  fromMonthDays: number;
  toMonthDays: number;
}

export function getDayGaugeDomain(
  selectedFrom: Date,
  selectedTo: Date,
): DayGaugeDomain {
  const fromMonthStart = startOfMonth(selectedFrom);
  const toMonthStart = startOfMonth(selectedTo);
  const fromMonthDays = getDaysInJalaliMonth(fromMonthStart);
  const toMonthDays = getDaysInJalaliMonth(toMonthStart);

  return { fromMonthStart, toMonthStart, fromMonthDays, toMonthDays };
}

/** تبدیل ایندکس گژی روز به تاریخ واقعی */
export function dayIndexToDate(
  domain: DayGaugeDomain,
  startDayIndex: number,
  endDayIndex: number,
): DateRange {
  return {
    from: setJalaliDayOfMonth(domain.fromMonthStart, startDayIndex + 1),
    to: setJalaliDayOfMonth(domain.toMonthStart, endDayIndex + 1),
  };
}
