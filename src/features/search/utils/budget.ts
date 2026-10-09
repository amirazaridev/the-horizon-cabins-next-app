/**
 * منطق «بودجه» در جستجو — یک بازه‌ی تک‌مقداری با **دو معنا**.
 *
 * قرارداد پروژه: بودجه بسته به وجود تاریخ دو حالت دارد.
 *   - بدون تاریخ → بودجه‌ی **هر شب**  → به API به‌عنوان `price`
 *   - با تاریخ   → بودجه‌ی **کل سفر** → به API به‌عنوان `totalPrice`
 *
 * ⚠️ مقدار ذخیره‌شده در `SearchFilters.budget` همیشه در واحدِ **حالت فعال**
 * است — یعنی همان چیزی که اسلایدر نشان می‌دهد. برای اینکه قصد «هر شب» کاربر
 * هنگام تغییر تعداد شب (یا افزودن/حذف تاریخ) از دست نرود،
 * `rescaleBudgetBetween` مقدار را با نسبت تعداد شب‌ها مقیاس می‌کند.
 *
 * مثال: کاربر ۵–۱۰ میلیون برای هر شب انتخاب کرده. با انتخاب ۳ شب، مقدار
 * به ۱۵–۳۰ میلیون (کل سفر) تبدیل می‌شود تا همان قصد حفظ شود.
 */

import {
  BUDGET_MAX,
  BUDGET_MIN,
  BUDGET_STEP,
  type BudgetRange,
} from "../types/search.types";

export type BudgetMode = "perNight" | "total";

/**
 * تعداد شب بین دو تاریخ.
 * صفر یعنی بازه ناقص (یکی از دو تاریخ خالی) یا نامعتبر (خروج ≤ ورود).
 */
export function nightsBetween(
  checkIn: Date | null,
  checkOut: Date | null,
): number {
  if (!checkIn || !checkOut) return 0;
  const ms = checkOut.getTime() - checkIn.getTime();
  if (ms <= 0) return 0;
  return Math.round(ms / 86_400_000);
}

/** حالت بودجه بر اساس تعداد شب */
export function budgetModeFor(nights: number): BudgetMode {
  return nights > 0 ? "total" : "perNight";
}

/**
 * محدوده‌ی اسلایدر بودجه.
 *
 * کف همیشه ثابت است و **فقط سقف** با تعداد شب مقیاس می‌گیرد (تصمیم پروژه)؛
 * پس برای ۳ شب سقف ۹۰ میلیون و برای ۳۰ شب ۹۰۰ میلیون می‌شود.
 */
export function budgetBoundsFor(nights: number): { min: number; max: number } {
  return {
    min: BUDGET_MIN,
    max: nights > 0 ? BUDGET_MAX * nights : BUDGET_MAX,
  };
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** گرد کردن به نزدیک‌ترین پله‌ی اسلایدر تا مقدار همیشه روی پله بنشیند */
function roundToStep(value: number): number {
  return Math.round(value / BUDGET_STEP) * BUDGET_STEP;
}

/**
 * مقیاس‌بندی بودجه با حفظ قصد «هر شب»، وقتی تعداد شب عوض می‌شود.
 *
 * ضریب بر اساس گذار بین دو حالت:
 *   prev=۰ , next>۰  → ×next      (بدون تاریخ → با تاریخ: per-night → total)
 *   prev>۰ , next=۰  → ÷prev      (با تاریخ → بدون تاریخ: total → per-night)
 *   هر دو > ۰        → ×next/prev (فقط تعداد شب عوض شده)
 *   هر دو ۰          → بدون تغییر
 *
 * نتیجه به پله‌ی اسلایدر گرد و داخل محدوده‌ی حالت جدید clamp می‌شود.
 */
export function rescaleBudgetBetween(
  prevNights: number,
  nextNights: number,
  budget: BudgetRange | null,
): BudgetRange | null {
  if (prevNights === nextNights) return budget;
  if (!budget) return null;

  const factor =
    prevNights === 0
      ? nextNights
      : nextNights === 0
        ? 1 / prevNights
        : nextNights / prevNights;

  const bounds = budgetBoundsFor(nextNights);
  const scaledMin = clamp(roundToStep(budget.min * factor), bounds.min, bounds.max);
  const scaledMax = clamp(roundToStep(budget.max * factor), bounds.min, bounds.max);

  return {
    min: Math.min(scaledMin, scaledMax),
    max: Math.max(scaledMin, scaledMax),
  };
}
