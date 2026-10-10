/**
 * تنظیمات مؤثر سامانه — آینه‌ی پاسخ `GET /settings` بک‌اند.
 *
 * `priceCalendarHorizonDays` و `bookedDatesMaxRangeDays` مقادیر **مشتق‌شده**
 * هستند (در دیتابیس ذخیره نمی‌شوند) و بک‌اند محاسبه‌شان می‌کند.
 */
export interface AppSettings {
  // Booking
  minBookingLength: number;
  maxBookingLength: number;
  maxGuests: number;
  maxAdvanceBookingDays: number;
  maxPendingBookingsPerGuest: number;
  paymentDeadlineMinutes: number;

  // Pricing
  maxDiscountsPerNight: number;
  maxSurchargesPerNight: number;
  maxTotalDiscountPercent: number;
  maxTotalSurchargePercent: number;
  maxNightlyPrice: number;
  minRegularPrice: number;
  maxRegularPrice: number;
  startingPriceWindowDays: number;
  priceRuleMaxFutureDays: number;

  // Derived
  priceCalendarHorizonDays: number;
  bookedDatesMaxRangeDays: number;
}

/** کلیدهای قابل‌نمایش در صفحه‌ی تنظیمات. */
export type SettingKey = keyof AppSettings;
