import type { GuestAccountProfile } from "../types/guest-account.types";

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
