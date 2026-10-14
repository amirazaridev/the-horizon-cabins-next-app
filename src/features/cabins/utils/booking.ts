import type { DateRange, DayOccupancy } from "@/components/ui/RangeDatePicker";
import type {
  BookedRange,
  CabinCalendarDay,
  CalendarPriceMap,
} from "../types/cabin-booking.types";
import { formatDateParam, parseDateParam } from "./cabin-date";

export const EMPTY_DATE_RANGE: DateRange = { from: null, to: null };

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** تعداد شب‌های بین دو تاریخ؛ بازه‌ی ناقص یا معکوس صفر حساب می‌شود. */
export function countNights(range: DateRange): number {
  if (!range.from || !range.to) return 0;
  const nights = Math.round(
    (range.to.getTime() - range.from.getTime()) / MS_PER_DAY,
  );
  return nights > 0 ? nights : 0;
}

/** بازه‌ی کامل یعنی هم ورود و هم خروج انتخاب شده و تعداد شب مثبت است */
export function isCompleteRange(range: DateRange): boolean {
  return countNights(range) > 0;
}

/* ==================== تاریخ: کلید، پیمایش، روزهای رزروشده ==================== */

export function toDateKey(date: Date): string {
  return formatDateParam(date);
}

/** یک روز جلوتر، همیشه در نیمه‌شب محلی (DST-safe). */
export function addOneDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}

/** شب‌های یک بازه‌ی کامل را برمی‌گرداند: `[from, to)` — بازه‌ی ناقص ⇒ آرایه‌ی خالی. */
export function eachNight(range: DateRange): Date[] {
  if (!range.from || !range.to) return [];

  const nights: Date[] = [];
  const end = new Date(
    range.to.getFullYear(),
    range.to.getMonth(),
    range.to.getDate(),
  ).getTime();
  let cursor = new Date(
    range.from.getFullYear(),
    range.from.getMonth(),
    range.from.getDate(),
  );

  while (cursor.getTime() < end) {
    nights.push(cursor);
    cursor = addOneDay(cursor);
  }

  return nights;
}

export function expandBookedRanges(ranges: readonly BookedRange[]): string[] {
  const keys: string[] = [];

  for (const range of ranges) {
    const start = parseDateParam(range.startDate);
    const end = parseDateParam(range.endDate);
    if (!start || !end) continue;

    let cursor = start;
    while (cursor.getTime() < end.getTime()) {
      keys.push(toDateKey(cursor));
      cursor = addOneDay(cursor);
    }
  }

  return keys;
}

/* ======================= اشغال نیمه‌روزی (۱۲:۰۰ / ۱۴:۰۰) ======================= */

export type OccupancyMaps = {
  /** روزهایی که نیمه‌ی صبحشان (تا ۱۲:۰۰) اشغال است. */
  morning: ReadonlySet<string>;
  /** روزهایی که نیمه‌ی بعدازظهرشان (از ۱۴:۰۰) اشغال است. */
  afternoon: ReadonlySet<string>;
};

export function buildOccupancyMaps(
  ranges: readonly BookedRange[],
): OccupancyMaps {
  const morning = new Set<string>();
  const afternoon = new Set<string>();

  for (const range of ranges) {
    const start = parseDateParam(range.startDate);
    const end = parseDateParam(range.endDate);
    if (!start || !end || end.getTime() <= start.getTime()) continue;

    //* روز ورود — نیمه‌ی بعدازظهر اشغال (ساعت ورود ۱۴:۰۰).
    afternoon.add(toDateKey(start));

    //* روزهای میانی — تمام روز مهمان حاضر است.
    let cursor = addOneDay(start);
    while (cursor.getTime() < end.getTime()) {
      const key = toDateKey(cursor);
      morning.add(key);
      afternoon.add(key);
      cursor = addOneDay(cursor);
    }

    //* روز خروج — نیمه‌ی صبح اشغال (ساعت خروج ۱۲:۰۰).
    morning.add(toDateKey(end));
  }

  return { morning, afternoon };
}

/** وضعیت اشغال یک روز مشخص: آزاد / نیمه‌صبح / نیمه‌بعدازظهر / کامل. */
export function occupancyOf(maps: OccupancyMaps, date: Date): DayOccupancy {
  const key = toDateKey(date);
  const isMorning = maps.morning.has(key);
  const isAfternoon = maps.afternoon.has(key);

  if (isMorning && isAfternoon) return "full";
  if (isMorning) return "morning";
  if (isAfternoon) return "afternoon";
  return "none";
}

/* ================================ قیمت اقامت ================================ */

/** نقشه‌ی قیمت بر اساس کلید روز — برای جست‌وجوی O(1) در تقویم. */
export function buildPriceMap(
  days: readonly CabinCalendarDay[],
): CalendarPriceMap {
  return new Map(days.map((day) => [day.date, day]));
}

export type StayPrice = {
  /** تعداد شب‌های بازه (چه قیمت داشته باشند چه نه). */
  nights: number;
  /** مجموع نرخ پایه — همان عدد خط‌خورده‌ی صورت‌حساب. */
  gross: number;
  /** مجموع تخفیف (اگر افزایش قیمت باشد صفر می‌ماند). */
  discount: number;
  /** مبلغ نهایی قابل پرداخت. */
  total: number;
  /** درصد تخفیف مؤثر. */
  discountPercent: number;
  /** میانگین نرخ نهایی هر شب. */
  perNight: number;
  /** آیا همه‌ی شب‌های بازه قیمت داشتند (هیچ شبی بیرون پنجره نبود). */
  fullyPriced: boolean;
};

const EMPTY_STAY_PRICE: StayPrice = {
  nights: 0,
  gross: 0,
  discount: 0,
  total: 0,
  discountPercent: 0,
  perNight: 0,
  fullyPriced: false,
};

export function priceStay(
  range: DateRange,
  prices: CalendarPriceMap,
): StayPrice {
  const nights = eachNight(range);
  if (nights.length === 0) return EMPTY_STAY_PRICE;

  let gross = 0;
  let total = 0;
  let priced = 0;

  for (const night of nights) {
    const day = prices.get(toDateKey(night));
    if (!day) continue;
    gross += day.basePrice;
    total += day.finalPrice;
    priced += 1;
  }

  if (priced === 0) return { ...EMPTY_STAY_PRICE, nights: nights.length };

  const discount = Math.max(0, gross - total);

  return {
    nights: nights.length,
    gross,
    discount,
    total,
    discountPercent: gross > 0 ? Math.round((discount / gross) * 100) : 0,
    perNight: Math.round(total / priced),
    fullyPriced: priced === nights.length,
  };
}

export function cheapestNight(
  days: readonly CabinCalendarDay[],
): CabinCalendarDay | null {
  let best: CabinCalendarDay | null = null;
  for (const day of days) {
    if (!best || day.finalPrice < best.finalPrice) best = day;
  }
  return best;
}

export function isRangeAvailable(
  range: DateRange,
  bookedKeys: ReadonlySet<string>,
): boolean {
  if (!isCompleteRange(range)) return false;
  return eachNight(range).every((night) => !bookedKeys.has(toDateKey(night)));
}

/* ================================== نمایش ================================== */

export type BookingPanelLabels = {
  heading: string;
  amountCaption: string;
};

export function getBookingPanelLabels(
  isComplete: boolean,
): BookingPanelLabels {
  return isComplete
    ? { heading: "صورت‌حساب", amountCaption: "مبلغ نهایی" }
    : { heading: "نرخ هر شب", amountCaption: "شروع از" };
}

/** عدد فارسی — برای نمایش تعداد شب و نفرات */
export function toFaNumber(value: number): string {
  return value.toLocaleString("fa-IR");
}
