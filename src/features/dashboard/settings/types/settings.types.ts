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

export type EditableSettingKey = Exclude<
  SettingKey,
  "priceCalendarHorizonDays" | "bookedDatesMaxRangeDays"
>;

/** مقادیر قابل ارسال به `PATCH /settings`. */
export type SettingsColumns = Pick<AppSettings, EditableSettingKey>;
