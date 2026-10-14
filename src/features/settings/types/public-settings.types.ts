export type PublicSettings = {
  /** حداقل تعداد شب مجاز برای یک رزرو. */
  minBookingLength: number;
  /** حداکثر تعداد شب مجاز برای یک رزرو. */
  maxBookingLength: number;
  /** سقف تعداد نفرات (علاوه بر `maxCapacity` خود کابین). */
  maxGuests: number;
  /** افق رزرو: تا چند روز بعد از امروز می‌توان رزرو کرد. */
  maxAdvanceBookingDays: number;
  /** مهلت پرداخت (دقیقه) — بعد از آن رزرو خودکار لغو می‌شود. */
  paymentDeadlineMinutes: number;
  /** افق تقویم قیمت — همان افق رزرو (طبق طراحی «تقویم = رزرو»). */
  priceCalendarHorizonDays: number;
};

export const FALLBACK_PUBLIC_SETTINGS: PublicSettings = {
  minBookingLength: 1,
  maxBookingLength: 30,
  maxGuests: 10,
  maxAdvanceBookingDays: 120,
  paymentDeadlineMinutes: 30,
  priceCalendarHorizonDays: 120,
};
