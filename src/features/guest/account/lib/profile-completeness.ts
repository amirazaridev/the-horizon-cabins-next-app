import type { GuestAccountProfile } from "../types/guest-account.types";

/**
 * فیلدهایی که برای **ثبت رزرو** باید در پروفایل مهمان پر باشند.
 *
 * ⚠️ این تنها منبع حقیقتِ «پروفایل کامل است یا نه» برای جریان رزرو است:
 * هم Server Action رزرو و هم بنر راهنمای صفحه‌ی تنظیمات از همین استفاده
 * می‌کنند تا قاعده در دو جا واگرا نشود.
 *
 * ⚠️ `fullName` اینجا نیست چون هنگام ثبت‌نام گرفته می‌شود، و `gender` هم
 * عمداً لازم نیست (با کاربر توافق شد).
 */
export const BOOKING_REQUIRED_FIELDS = [
  "phoneNumber",
  "nationalId",
  "dateOfBirth",
] as const;

export type BookingRequiredField = (typeof BOOKING_REQUIRED_FIELDS)[number];

/** برچسب فارسی هر فیلد — برای toast و بنر راهنما. */
export const BOOKING_FIELD_LABELS: Record<BookingRequiredField, string> = {
  phoneNumber: "شماره موبایل",
  nationalId: "کد ملی",
  dateOfBirth: "تاریخ تولد",
};

/**
 * فیلدهای ناقص پروفایل برای رزرو.
 *
 * @returns آرایه‌ی خالی یعنی پروفایل برای رزرو کامل است.
 */
export function getMissingBookingFields(
  profile: GuestAccountProfile,
): BookingRequiredField[] {
  return BOOKING_REQUIRED_FIELDS.filter((field) => !profile[field].trim());
}

/** متن فارسی فهرست فیلدهای ناقص — «شماره موبایل، کد ملی». */
export function formatMissingFields(
  missing: readonly BookingRequiredField[],
): string {
  return missing.map((field) => BOOKING_FIELD_LABELS[field]).join("، ");
}
