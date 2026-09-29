/**
 * ساخت برچسب‌ها و خلاصه‌های فارسیِ جستجو.
 *
 * همه‌ی متن‌های نمایشی اینجا متمرکز است تا نه در URL برود و نه در
 * کامپوننت‌ها تکرار شود (جداسازی نمایش از داده).
 */

import type { City } from "@/features/cabins/types/city.types";
import { formatPriceShort } from "@/features/cabins/utils/cabin-filters";
import { formatJalaliDate } from "@/components/ui/RangeDatePicker";
import type { Destination, SearchFilters } from "../types/search.types";

const fa = (value: number) => value.toLocaleString("fa-IR");

/** «تا ۸ میلیون تومان / شب» — صریحاً شبانه */
export function formatBudgetLabel(maxPrice: number | null): string | undefined {
  if (maxPrice == null) return undefined;
  return `تا ${formatPriceShort(maxPrice)} تومان / شب`;
}

/** «۸ میلیون تومان / شب» — بدون «تا» (برای داخل پنل) */
export function formatBudgetValue(maxPrice: number | null): string {
  if (maxPrice == null) return "بدون محدودیت";
  return `${formatPriceShort(maxPrice)} تومان / شب`;
}

export function formatGuestsLabel(guests: number | null): string | undefined {
  if (guests == null) return undefined;
  return `${fa(guests)} مهمان`;
}

/** تعداد شب بین دو تاریخ */
export function nightsBetween(checkIn: Date | null, checkOut: Date | null): number {
  if (!checkIn || !checkOut) return 0;
  const ms = checkOut.getTime() - checkIn.getTime();
  if (ms <= 0) return 0;
  return Math.round(ms / 86_400_000);
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

/** بودجه در قالب فشرده — فقط برای خلاصه‌های تک‌خطی */
export function formatBudgetLabelCompact(
  maxPrice: number | null,
): string | undefined {
  if (maxPrice == null) return undefined;
  return `تا ${formatPriceShort(maxPrice)}`;
}

/** قطعات خلاصه: مقصد · تاریخ · مهمان · بودجه */
export function buildSearchSummaryParts({
  filters,
  cities = [],
  compact = false,
}: SearchSummaryInput): string[] {
  return [
    destinationLabel(filters.destination, cities),
    formatDateRangeSummary(filters.checkIn, filters.checkOut),
    formatGuestsLabel(filters.guests),
    compact
      ? formatBudgetLabelCompact(filters.maxPrice)
      : formatBudgetLabel(filters.maxPrice),
  ].filter((part): part is string => Boolean(part));
}

/** «رامسر · ۴ مهمان · ۲۵ شهریور تا ۲۸ شهریور · تا ۸ میلیون تومان / شب» */
export function buildSearchSummary(input: SearchSummaryInput): string {
  return buildSearchSummaryParts(input).join("  ·  ");
}

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
