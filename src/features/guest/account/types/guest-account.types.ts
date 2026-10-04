/**
 * پروفایل حساب کاربری مهمان — داده‌ی پیش‌پرکردن فرم تنظیمات.
 *
 * ⚠️ خروجی `GET /user/me` بک‌اند دو بخش دارد (`user` و `guest`)؛ این تایپ
 * فقط چیزهایی را نگه می‌دارد که UI لازم دارد و فیلدهای خالی را به رشته‌ی
 * خالی تبدیل می‌کند تا فرم نیازی به چک `null` نداشته باشد.
 */
export type GuestAccountProfile = {
  /** ایمیل حساب — از سشن؛ قابل ویرایش نیست. */
  email: string;
  fullName: string;
  phoneNumber: string;
  nationalId: string;
  /** تاریخ تولد به‌شکل `YYYY-MM-DD` — خالی اگر ثبت نشده باشد. */
  dateOfBirth: string;
};
