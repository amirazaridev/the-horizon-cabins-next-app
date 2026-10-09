/**
 * تنظیمات عمومی که بک‌اند **بدون احراز هویت** برمی‌گرداند
 * (`GET /settings/public`).
 *
 * ⚠️ آینه‌ی `PublicSettings` در بک‌اند است و عمداً فقط زیرمجموعه‌ای از جدول
 * `Setting` است: سقف‌های قیمت‌گذاری هرگز عمومی نمی‌شوند، ولی کلاینت برای
 * ساختن تقویم و اعتبارسنجی ابتدایی رزرو به این مقادیر نیاز دارد.
 *
 * ⚠️ مقادیر واقعی همیشه از بک‌اند می‌آیند (`maxAdvanceBookingDays` پیش‌فرض
 * ۱۲۰ است)؛ این تایپ فقط شکل داده را تعریف می‌کند و هیچ‌جا مقدار ثابت
 * جایگزین پاسخ سرور نمی‌شود.
 */
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

/**
 * پیش‌فرض‌های امن — هم‌راستا با `DEFAULT_SETTINGS` بک‌اند.
 *
 * ⚠️ فقط برای زمانی است که اندپوینت در دسترس نباشد؛ در آن حالت صفحه‌ی
 * جزئیات کابین نباید بترکد و تقویم با افق پیش‌فرض کار می‌کند. مقدار مؤثر
 * همیشه از پاسخ سرور می‌آید.
 */
export const FALLBACK_PUBLIC_SETTINGS: PublicSettings = {
  minBookingLength: 1,
  maxBookingLength: 30,
  maxGuests: 10,
  maxAdvanceBookingDays: 120,
  paymentDeadlineMinutes: 30,
  priceCalendarHorizonDays: 120,
};
