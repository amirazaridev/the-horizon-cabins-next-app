import {
  BUDGET_MAX,
  BUDGET_MIN,
  BUDGET_STEP,
  MS_PER_DAY,
} from "@/features/search/constants/search-limits";
import type {
  BudgetRange,
  SearchFilters,
} from "@/features/search/types/search.types";

export type BudgetMode = "perNight" | "total";

//* تعداد شب بین دو تاریخ. صفر یعنی بازه ناقص یا نامعتبر (خروج ≤ ورود).
export function nightsBetween(
  checkIn: Date | null,
  checkOut: Date | null,
): number {
  if (!checkIn || !checkOut) return 0;
  const ms = checkOut.getTime() - checkIn.getTime();
  if (ms <= 0) return 0;
  return Math.round(ms / MS_PER_DAY);
}

//* حالت بودجه بر اساس تعداد شب
export function budgetModeFor(nights: number): BudgetMode {
  return nights > 0 ? "total" : "perNight";
}

//* محدوده‌ی اسلایدر بودجه — کف ثابت است و **فقط سقف** با تعداد شب مقیاس می‌گیرد (۳ شب ⇒ ۹۰ م، ۳۰ شب ⇒ ۹۰۰ م).
export function budgetBoundsFor(nights: number): { min: number; max: number } {
  return {
    min: BUDGET_MIN,
    max: nights > 0 ? BUDGET_MAX * nights : BUDGET_MAX,
  };
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

//* گرد کردن به نزدیک‌ترین پله‌ی اسلایدر تا مقدار همیشه روی پله بنشیند
function roundToStep(value: number): number {
  return Math.round(value / BUDGET_STEP) * BUDGET_STEP;
}

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
  const scaledMin = clamp(
    roundToStep(budget.min * factor),
    bounds.min,
    bounds.max,
  );
  const scaledMax = clamp(
    roundToStep(budget.max * factor),
    bounds.min,
    bounds.max,
  );

  return {
    min: Math.min(scaledMin, scaledMax),
    max: Math.max(scaledMin, scaledMax),
  };
}

export function rescaleBudgetOnDateChange(
  prev: SearchFilters,
  key: "checkIn" | "checkOut",
  value: Date | null,
): SearchFilters {
  const next = { ...prev, [key]: value };

  return {
    ...next,
    budget: rescaleBudgetBetween(
      nightsBetween(prev.checkIn, prev.checkOut),
      nightsBetween(next.checkIn, next.checkOut),
      prev.budget,
    ),
  };
}
