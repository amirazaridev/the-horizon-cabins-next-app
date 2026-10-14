/** تعداد میلی‌ثانیه در یک روز — مرجع واحد برای همه‌ی محاسبات شب‌شماری. */
export const MS_PER_DAY = 86_400_000;

/** برش به ابتدای روز و حذف ساعت (timezone-local). */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** شماره‌ی روز مطلق (epoch-day) — امن برای تفاضل. */
export function toEpochDay(date: Date): number {
  const d = startOfDay(date);
  return Math.round(d.getTime() / MS_PER_DAY);
}

/** تبدیل epoch-day به Date محلی. */
export function fromEpochDay(day: number): Date {
  return new Date(day * MS_PER_DAY);
}

/** افزودن روز. */
export function addDays(date: Date, days: number): Date {
  const x = startOfDay(date);
  x.setDate(x.getDate() + days);
  return x;
}

/** فاصله‌ی روزها (b منهای a). */
export function diffDays(a: Date, b: Date): number {
  return toEpochDay(b) - toEpochDay(a);
}

/** بازه — همیشه شامل هر دو سر. */
export interface DateRange {
  from: Date;
  /** آخرین روز بازه — **شامل** می‌شود */
  to: Date;
}

/** برچسب‌های کمکی برای محاسبه‌ی بازه‌ی مقایسه. */
export type CompareMode = "prev-period" | "prev-year" | "none";

export function nightsInRange(
  checkIn: Date,
  checkOut: Date,
  from: Date,
  to: Date,
): number {
  const rangeStart = toEpochDay(from);
  const rangeEnd = toEpochDay(to);

  // بازه‌ی نامعتبر → هیچ شبی شمرده نمی‌شود
  if (rangeEnd < rangeStart) return 0;

  const bookingStart = toEpochDay(checkIn);
  const bookingEnd = toEpochDay(checkOut);

  // رزرو نامعتبر (خروج قبل/مساوی ورود) → هیچ شبی ندارد
  if (bookingEnd <= bookingStart) return 0;

  const lo = Math.max(bookingStart, rangeStart);
  const hi = Math.min(bookingEnd, rangeEnd + 1);

  return Math.max(0, hi - lo);
}

export function overlapsRange(
  checkIn: Date,
  checkOut: Date,
  from: Date,
  to: Date,
): boolean {
  return nightsInRange(checkIn, checkOut, from, to) > 0;
}

export function createdAtInRange(
  createdAt: Date,
  from: Date,
  to: Date,
): boolean {
  const t = toEpochDay(createdAt);
  return t >= toEpochDay(from) && t <= toEpochDay(to);
}

/** لیست همه‌ی روزهای بازه (شامل هر دو سر). */
export function eachDayInRange(from: Date, to: Date): Date[] {
  const days: Date[] = [];
  const start = toEpochDay(from);
  const end = toEpochDay(to);
  if (end < start) return days;

  for (let day = start; day <= end; day++) {
    days.push(fromEpochDay(day));
  }
  return days;
}

/** تعداد روزهای بازه (شامل هر دو سر). */
export function inclusiveDayCount(from: Date, to: Date): number {
  return Math.max(0, toEpochDay(to) - toEpochDay(from) + 1);
}

export function resolveCompareRange(
  range: DateRange,
  mode: CompareMode,
): DateRange | null {
  if (mode === "none") return null;

  if (mode === "prev-year") {
    return {
      from: addDays(range.from, -365),
      to: addDays(range.to, -365),
    };
  }

  // prev-period: به همان طول، بدون فاصله بلافاصله قبل از بازه
  const length = inclusiveDayCount(range.from, range.to);
  const prevTo = addDays(range.from, -1);
  const prevFrom = addDays(prevTo, -(length - 1));

  return { from: prevFrom, to: prevTo };
}

export function isSameDay(a: Date, b: Date): boolean {
  return toEpochDay(a) === toEpochDay(b);
}

/** برچسب روز ISO (yyyy-MM-dd) — کلید گروه‌بندی نمودارها. */
export function toDayKey(date: Date): string {
  const d = startOfDay(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}
