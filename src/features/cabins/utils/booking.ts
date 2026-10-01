import type { DateRange } from "@/components/ui/RangeDatePicker";
import { finalNightPrice } from "./cabin-filters";

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

export type PriceBreakdown = {
  /** تعداد شب */
  nights: number;
  /** قیمت نهایی هر شب (بعد از تخفیف) */
  perNight: number;
  /** قیمت بدون تخفیف هر شب */
  regularPerNight: number;
  /** مجموع بدون تخفیف (قیمت خط‌خورده‌ی صورت‌حساب) */
  gross: number;
  /** مجموع تخفیف در کل اقامت */
  discount: number;
  /** مبلغ قابل پرداخت */
  total: number;
  /** درصد تخفیف؛ صفر یعنی تخفیفی وجود ندارد */
  discountPercent: number;
};

/**
 * تفکیک قیمت رزرو.
 *
 * ⚠️ TODO(backend): قیمت‌گذاری فعلی «قیمت هر شب × تعداد شب» است. بک‌اند
 * هیچ داده‌ای برای نرخ روزهای خاص (آخر هفته، تعطیلات) یا هزینه‌ی خدمات
 * نمی‌دهد؛ با اضافه‌شدن آن، فقط همین تابع تغییر می‌کند و همه‌ی UI
 * (aside، شیت و مودال) خودبه‌خود به‌روز می‌شود.
 */
export function getPriceBreakdown(
  cabin: { regularPrice: number; discount: number },
  nights: number,
): PriceBreakdown {
  const safeNights = nights > 0 ? nights : 0;
  const perNight = finalNightPrice(cabin);
  const regularPerNight = cabin.regularPrice;
  const total = perNight * safeNights;
  const gross = regularPerNight * safeNights;
  const discount = gross - total;

  return {
    nights: safeNights,
    perNight,
    regularPerNight,
    gross,
    discount,
    total,
    discountPercent: regularPerNight
      ? Math.round(((regularPerNight - perNight) / regularPerNight) * 100)
      : 0,
  };
}

/**
 * برچسب‌های پنل رزرو — بسته به این‌که تاریخ اقامت مشخص شده یا نه.
 *
 * حالت «نرخ»: تاریخ ورود و خروج کامل نیست، پس پنل یک کارت نرخ است:
 * عنوان «نرخ هر شب» و مبلغ همان قیمت یک شب.
 *
 * حالت «صورت‌حساب»: بازه کامل شد، پس پنل یک صورت‌حساب است: عنوان
 * «صورت‌حساب» و مبلغ همان مبلغ نهایی.
 *
 * ⚠️ **معیار فقط کامل‌بودن بازه است.** تعداد نفرات عمداً در این شرط نیست:
 * شمارنده از ابتدا مقدار دارد، پس گره‌زدن تغییر عنوان به آن یعنی کاربر با
 * انتخاب تاریخ تغییر را نمی‌بیند و باید یک تعامل اضافه انجام دهد. با این
 * تعریف، عنوان **دقیقاً در همان رندری که بازه کامل می‌شود** عوض می‌شود.
 */
export type BookingPanelLabels = {
  heading: string;
  amountCaption: string;
};

export function getBookingPanelLabels(
  isComplete: boolean,
): BookingPanelLabels {
  return isComplete
    ? { heading: "صورت‌حساب", amountCaption: "مبلغ نهایی" }
    : { heading: "نرخ هر شب", amountCaption: "قیمت هر شب" };
}

/** عدد فارسی — برای نمایش تعداد شب و نفرات */
export function toFaNumber(value: number): string {
  return value.toLocaleString("fa-IR");
}
