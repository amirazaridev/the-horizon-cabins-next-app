/**
 * ساخت برچسب‌ها و خلاصه‌های فارسیِ جستجو.
 *
 * همه‌ی متن‌های نمایشی اینجا متمرکز است تا نه در URL برود و نه در
 * کامپوننت‌ها تکرار شود (جداسازی نمایش از داده).
 */

import type { City } from "@/features/cabins/types/city.types";
import { formatPriceShort } from "@/features/cabins/utils/cabin-filters";
import { formatJalaliDate } from "@/components/ui/RangeDatePicker";
import { type BudgetRange, type Destination, type SearchFilters } from "../types/search.types";
import { budgetBoundsFor, budgetModeFor, nightsBetween } from "./budget";

export { nightsBetween };

const fa = (value: number) => value.toLocaleString("fa-IR");

/**
 * دو سر بازه‌ی بودجه، فقط اگر واقعاً محدودکننده باشند.
 * بازه‌ی کامل (کمینه تا بیشینه) یعنی «بدون محدودیت».
 *
 * ⚠️ سقفِ «کامل» به تعداد شب وابسته است: بدون تاریخ ۳۰ میلیون و با تاریخ
 * ۳۰ میلیون × تعداد شب.
 */
function budgetEdges(
  range: BudgetRange | null,
  nights: number,
): {
  min: string | null;
  max: string | null;
} {
  if (!range) return { min: null, max: null };
  const bounds = budgetBoundsFor(nights);
  return {
    min: range.min > bounds.min ? formatPriceShort(range.min) : null,
    max: range.max < bounds.max ? formatPriceShort(range.max) : null,
  };
}

/** پسوند واحد بودجه: «/ شب» یا «برای کل سفر» */
function budgetUnitSuffix(nights: number): string {
  return budgetModeFor(nights) === "total" ? "برای کل سفر" : "/ شب";
}

/** برچسب فیلد بودجه (تریگر/پنل) — بسته به وجود تاریخ */
export function budgetFieldLabel(nights: number): string {
  return budgetModeFor(nights) === "total" ? "بودجه‌ی کل سفر" : "بودجه‌ی هر شب";
}

/**
 * «۲ تا ۸ میلیون تومان / شب» · «تا ۸ میلیون تومان / شب» · «از ۵ میلیون تومان / شب»
 * با تاریخ، پسوند «برای کل سفر» می‌شود.
 * بازه‌ی کامل یا `null` یعنی بدون محدودیت و `undefined` برمی‌گردد.
 */
export function formatBudgetRangeLabel(
  range: BudgetRange | null,
  nights = 0,
): string | undefined {
  const { min, max } = budgetEdges(range, nights);
  const suffix = budgetUnitSuffix(nights);
  if (min && max) return `${min} تا ${max} تومان ${suffix}`;
  if (max) return `تا ${max} تومان ${suffix}`;
  if (min) return `از ${min} تومان ${suffix}`;
  return undefined;
}

/** نسخه‌ی فشرده برای خلاصه‌های تک‌خطی: «۲ تا ۸ میلیون» */
export function formatBudgetRangeLabelCompact(
  range: BudgetRange | null,
  nights = 0,
): string | undefined {
  const { min, max } = budgetEdges(range, nights);
  if (min && max) return `${min} تا ${max}`;
  if (max) return `تا ${max}`;
  if (min) return `از ${min}`;
  return undefined;
}

/** متن داخل پنل بودجه؛ همیشه مقدار برمی‌گرداند */
export function formatBudgetRangeValue(
  range: BudgetRange | null,
  nights = 0,
): string {
  const label = formatBudgetRangeLabel(range, nights);
  return label ?? "بدون محدودیت";
}

export function formatGuestsLabel(guests: number | null): string | undefined {
  if (guests == null) return undefined;
  return `${fa(guests)} مهمان`;
}

export function formatNightsLabel(
  checkIn: Date | null,
  checkOut: Date | null,
): string | undefined {
  const nights = nightsBetween(checkIn, checkOut);
  return nights > 0 ? `${fa(nights)} شب` : undefined;
}

/** «۲۵ شهریور تا ۲۸ شهریور» یا تک‌تاریخ */
export function formatDateRangeSummary(
  checkIn: Date | null,
  checkOut: Date | null,
): string | undefined {
  const from = formatJalaliDate(checkIn);
  const to = formatJalaliDate(checkOut);
  if (from && to) return `${from} تا ${to}`;
  return from ?? to ?? undefined;
}

/** نام نمایشی مقصد؛ برای مقصد شهرِ پارس‌شده از URL، نام از لیست شهرها می‌آید */
export function destinationLabel(
  destination: Destination | null,
  cities: City[] = [],
): string | undefined {
  if (!destination) return undefined;
  if (destination.type === "region") return destination.name;
  if (destination.name) return destination.name;
  return cities.find((city) => city.id === destination.id)?.name;
}

export type SearchSummaryInput = {
  filters: SearchFilters;
  cities?: City[];
  /**
   * نسخه‌ی فشرده برای خلاصه‌های تک‌خطی (مثل تریگر موبایل).
   * بودجه به‌جای «تا ۸ میلیون تومان / شب» می‌شود «تا ۸ میلیون».
   */
  compact?: boolean;
};

/** قطعات خلاصه: مقصد · تاریخ · مهمان · بودجه */
export function buildSearchSummaryParts({
  filters,
  cities = [],
  compact = false,
}: SearchSummaryInput): string[] {
  //* بودجه با تاریخ یعنی «کل سفر»؛ پس پسوند و مرزها به تعداد شب وابسته‌اند.
  const nights = nightsBetween(filters.checkIn, filters.checkOut);
  return [
    destinationLabel(filters.destination, cities),
    formatDateRangeSummary(filters.checkIn, filters.checkOut),
    formatGuestsLabel(filters.guests),
    compact
      ? formatBudgetRangeLabelCompact(filters.budget, nights)
      : formatBudgetRangeLabel(filters.budget, nights),
  ].filter((part): part is string => Boolean(part));
}

/** «رامسر · ۴ مهمان · ۲۵ شهریور تا ۲۸ شهریور · تا ۸ میلیون تومان / شب» */
export function buildSearchSummary(input: SearchSummaryInput): string {
  return buildSearchSummaryParts(input).join("  ·  ");
}

/* ------------------------------------------------------------------ */
/* متن‌های ثابت تریگر موبایل                                           */
/* ------------------------------------------------------------------ */

/** عنوان پرسشیِ خط اول تریگر موبایل در لندینگ */
export const MOBILE_SEARCH_TITLE = "مقصد، بودجه و تاریخ سفرت رو بگو";

/** وقتی هنوز هیچ فیلتری انتخاب نشده، به‌جای لیست خالیِ فیلترها نشان داده می‌شود */
export const MOBILE_SEARCH_EMPTY_HINT = "برای شروع، فیلترهات رو انتخاب کن";

/** در `/cabins` برچسب ثابت بالای خلاصه */
export const MOBILE_SEARCH_RESULTS_LABEL = "جستجوی شما";

/** متن دکمه‌ی تغییر جستجو در `/cabins` */
export const MOBILE_SEARCH_CHANGE_LABEL = "تغییر جستجو";

/** عنوان پویا برای بخش پیش‌نمایش */
export function buildPreviewHeading({
  filters,
  cities = [],
}: SearchSummaryInput): { title: string; subtitle?: string } {
  const place = destinationLabel(filters.destination, cities);

  const subtitle = buildSearchSummaryParts({ filters, cities })
    .filter((part) => part !== place)
    .join(" · ");

  if (place) {
    return {
      title: `اقامتگاه‌های ${place}`,
      subtitle: subtitle || undefined,
    };
  }

  return {
    title: "اقامتگاه‌های مناسب شما",
    subtitle: subtitle || undefined,
  };
}

/** متن دکمه‌ی نهایی پیش‌نمایش */
export function buildPreviewCtaLabel(total: number): string {
  return `مشاهده همه ${fa(total)} اقامتگاه`;
}
