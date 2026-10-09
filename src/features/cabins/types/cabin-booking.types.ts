import type { PublicSettings } from "@/features/settings/types/public-settings.types";

/**
 * داده‌های رزرو صفحه‌ی جزئیات اقامتگاه.
 *
 * ⚠️ این‌ها تنها تایپ‌هایی هستند که بین سرور (واکشی داده) و کلاینت (تقویم و
 * پنل رزرو) رد و بدل می‌شوند؛ تعریفشان اینجا (و نه در ماژول‌های API) باعث
 * می‌شود لایه‌ی UI به `server-only` وابسته نشود.
 */

/**
 * قیمت یک شب از تقویم کابین — آینه‌ی ردیف `CabinDailyPrice` بک‌اند.
 *
 * ⚠️ `basePrice` نرخ پایه و `finalPrice` بعد از اعمال تخفیف/افزایش همان شب
 * است؛ برای نمایش «قیمت خط‌خورده + قیمت نهایی» هر دو لازم‌اند.
 */
export type CabinCalendarDay = {
  /** کلید تاریخ به‌شکل `YYYY-MM-DD` (بدون شیفت تایم‌زون). */
  date: string;
  basePrice: number;
  discountPercent: number;
  surchargePercent: number;
  /** قیمت نهایی آن شب پس از تخفیف/افزایش — واحد تومان. */
  finalPrice: number;
};

/**
 * بازه‌ی تاریخِ قفل‌شده‌ی یک کابین.
 *
 * ⚠️ نیمه‌باز است: `[startDate, endDate)`. شب‌های اشغال‌شده
 * `startDate .. endDate-1` هستند و روز `endDate` (روز خروج) برای ورود یک
 * رزرو جدید آزاد است — رفتار استاندارد هتل.
 */
export type BookedRange = {
  /** `YYYY-MM-DD` */
  startDate: string;
  /** `YYYY-MM-DD` */
  endDate: string;
};

/** نقشه‌ی قیمت بر اساس کلید روز — برای جست‌وجوی O(1) هنگام رندر تقویم. */
export type CalendarPriceMap = Map<string, CabinCalendarDay>;

/**
 * همه‌ی داده‌ی رزروی که صفحه‌ی سرور واکشی و به لایه‌ی کلاینت تزریق می‌کند.
 */
export type CabinBookingData = {
  /** تنظیمات عمومی مؤثر (افق رزرو، طول اقامت، ...). */
  settings: PublicSettings;
  /** قیمت شب‌های پنجره‌ی تقویم (صعودی). */
  calendarDays: CabinCalendarDay[];
  /** بازه‌های رزرو‌شده‌ی کابین (نیمه‌باز) — Provider آن‌ها را به روز غیرفعال تبدیل می‌کند. */
  bookedRanges: BookedRange[];
};
