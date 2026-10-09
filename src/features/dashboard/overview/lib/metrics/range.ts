/**
 * محاسبات پایه‌ی بازه‌ی تاریخ برای metrics.
 *
 * همه‌ی توابع این ماژول **pure** هستند: فقط ورودی می‌گیرند و خروجی
 * می‌دهند، بدون side effect و بدون وابستگی به `new Date()` ضمنی.
 *
 * ### قاعده‌ی شب‌شماری (مهم‌ترین قرارداد این داشبورد)
 * یک رزرو از `checkIn` (شب اول) تا `checkOut` (روز خروج، **شب نمی‌گیرد**)
 * ادامه دارد. یعنی شب‌های رزرو:
 * ```
 * [checkIn, checkOut)  →  checkIn, checkIn+1, …, checkOut-1
 * ```
 * تداخل با بازه‌ی `[from, to]` (که هر دو شامل‌اند) با فرمول رسمی
 * درخواست کاربر محاسبه می‌شود:
 * ```
 * max(0, min(checkOut, to + 1) - max(checkIn, from))
 * ```
 * که `to + 1` نقش «شب بعد از آخرین روز بازه» را بازی می‌کند.
 */

const MS_PER_DAY = 86_400_000;

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

/**
 * تعداد شب‌های یک رزرو که **داخل** بازه‌ی داده‌شده می‌افتد.
 *
 * فرمول: `max(0, min(checkOut, to+1) - max(checkIn, from))`
 *
 * ### چرا `to + 1`؟
 * چون `to` یک **روز** است ولی شب‌شماری در مرز خروج. اگر بازه `۱ تا ۳` و
 * رزرو `۱ تا ۳` باشد، شب‌های داخل بازه باید ۲ باشد (شب ۱ و شب ۲)، نه ۳.
 * با فرمول: `min(3, 4) - max(1, 1) = 3 - 1 = 2` ✅
 *
 * ### حالت‌های لبه‌ی پوشش‌داده‌شده
 * - بازه‌ی خالی (`from > to`) → صفر
 * - رزرو کاملاً بیرون بازه → صفر
 * - رزرو عبوری از مرز (شروع قبل از `from` یا پایان بعد از `to`) → فقط
 *   شب‌های داخل شمرده می‌شوند
 * - رزرو یک‌شبه (`checkIn = checkOut - 1`)
 */
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

/**
 * آیا رزرو با بازه **هم‌پوشانی** دارد؟ (هر شبی داخل بازه بیفتد)
 * برای فیلترکردن رزروهای عبوری از مرز استفاده می‌شود.
 */
export function overlapsRange(
  checkIn: Date,
  checkOut: Date,
  from: Date,
  to: Date,
): boolean {
  return nightsInRange(checkIn, checkOut, from, to) > 0;
}

/**
 * آیا رزرو **در** بازه ثبت شده است؟ (بر اساس `createdAt`)
 * مبنای `CancellationRate` (کاربر: نرخ لغو = لغوشده‌های ثبت‌شده در بازه).
 */
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

/**
 * ساخت بازه‌ی مقایسه.
 *
 * - `prev-period`: بازه‌ی قبل به همان طول، بی‌درنگ پیش از `from`
 * - `prev-year`: همان بازه یک سال قبل (۳۶۵ روز عقب، برای YoY)
 * - `none`: `null`
 *
 * ⚠️ «سال قبل» عمداً با `365` روز محاسبه می‌شود نه با تغییر سال تقویمی،
 * چون ماه‌های شمسی ۲۹/۳۰/۳۱ روزه‌اند و مقایسه‌ی طول‌برابر معنادارتر است.
 * // TODO(supabase): اگر بک‌اند تقویم جلالی داد، این را به `addYears` شمسی تبدیل کنید
 */
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

/**
 * آیا مقدار `value` روزِ «امروز» است؟
 * برای بخش «عملیات امروز» و Pace مستقل از فیلتر تاریخ.
 */
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
