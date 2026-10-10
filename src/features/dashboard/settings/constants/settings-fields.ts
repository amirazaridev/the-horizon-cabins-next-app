import { CalendarRange, CircleDollarSign, Tags, type LucideIcon } from "lucide-react";

import { formatCurrency } from "@/libs/utils/format";
import type {
  AppSettings,
  EditableSettingKey,
  SettingKey,
} from "../types/settings.types";

/** واحد نمایش مقدار تنظیمات. */
export type SettingUnit =
  | "nights"
  | "guests"
  | "days"
  | "minutes"
  | "percent"
  | "toman"
  | "count";

/** بیشترین مقدار قابل‌ذخیره در یک ستون int4 پستگرس. */
export const INT4_MAX = 2_147_483_647;

/**
 * کران مجاز هر فیلد — **آینه‌ی `BOUNDS` در `setting.validation.ts` بک‌اند**.
 *
 * ⚠️ هر تغییری در بک‌اند باید اینجا هم اعمال شود؛ این مقادیر هم برای
 * اعتبارسنجی سمت کلاینت و هم برای راهنمای «بازه‌ی مجاز» زیر هر فیلد
 * استفاده می‌شوند. اعتبارسنجی نهایی همیشه سمت سرور است.
 */
export const SETTING_BOUNDS: Record<EditableSettingKey, { min: number; max: number }> = {
  minBookingLength: { min: 1, max: 365 },
  maxBookingLength: { min: 1, max: 365 },
  maxGuests: { min: 1, max: 100 },
  maxAdvanceBookingDays: { min: 1, max: 365 },
  maxPendingBookingsPerGuest: { min: 0, max: 100 },
  paymentDeadlineMinutes: { min: 1, max: 10_080 },
  maxDiscountsPerNight: { min: 0, max: 10 },
  maxSurchargesPerNight: { min: 0, max: 10 },
  maxTotalDiscountPercent: { min: 0, max: 100 },
  maxTotalSurchargePercent: { min: 0, max: 1000 },
  maxNightlyPrice: { min: 1, max: INT4_MAX },
  minRegularPrice: { min: 1, max: INT4_MAX },
  maxRegularPrice: { min: 1, max: INT4_MAX },
  startingPriceWindowDays: { min: 1, max: 365 },
  priceRuleMaxFutureDays: { min: 1, max: 3650 },
};

/** بیشترین `regularPrice` مجاز — آینه‌ی `deriveMaxRegularPrice` بک‌اند. */
export function deriveMaxRegularPrice(
  maxNightlyPrice: number,
  surchargePercent: number,
): number {
  return Math.floor((maxNightlyPrice * 100) / (100 + surchargePercent));
}

/** آیا این کلید قابل ویرایش است؟ */
export function isEditableSetting(key: SettingKey): key is EditableSettingKey {
  return key in SETTING_BOUNDS;
}

interface SettingField {
  key: SettingKey;
  label: string;
  unit: SettingUnit;
}

export interface SettingGroup {
  id: string;
  title: string;
  icon: LucideIcon;
  fields: readonly SettingField[];
}

/**
 * گروه‌بندی و برچسب فارسی تنظیمات — **تک‌منبع** صفحه‌ی تنظیمات.
 * هیچ برچسب/واحدی داخل کامپوننت نیست.
 */
export const SETTING_GROUPS: readonly SettingGroup[] = [
  {
    id: "booking",
    title: "رزرو",
    icon: CalendarRange,
    fields: [
      { key: "minBookingLength", label: "حداقل طول اقامت", unit: "nights" },
      { key: "maxBookingLength", label: "حداکثر طول اقامت", unit: "nights" },
      { key: "maxGuests", label: "حداکثر تعداد مهمان", unit: "guests" },
      { key: "maxAdvanceBookingDays", label: "حداکثر افق رزرو", unit: "days" },
      {
        key: "maxPendingBookingsPerGuest",
        label: "حداکثر رزرو در انتظار پرداخت (هر مهمان)",
        unit: "count",
      },
      { key: "paymentDeadlineMinutes", label: "مهلت پرداخت", unit: "minutes" },
    ],
  },
  {
    id: "pricing",
    title: "قیمت‌گذاری",
    icon: Tags,
    fields: [
      { key: "maxDiscountsPerNight", label: "حداکثر تخفیف در هر شب", unit: "count" },
      { key: "maxSurchargesPerNight", label: "حداکثر افزایش در هر شب", unit: "count" },
      { key: "maxTotalDiscountPercent", label: "حداکثر درصد تخفیف کل", unit: "percent" },
      { key: "maxTotalSurchargePercent", label: "حداکثر درصد افزایش کل", unit: "percent" },
      { key: "maxNightlyPrice", label: "سقف قیمت هر شب", unit: "toman" },
      { key: "minRegularPrice", label: "حداقل قیمت پایه", unit: "toman" },
      { key: "maxRegularPrice", label: "حداکثر قیمت پایه", unit: "toman" },
      { key: "startingPriceWindowDays", label: "پنجره‌ی «شروع از»", unit: "days" },
      { key: "priceRuleMaxFutureDays", label: "حداکثر آینده‌ی قاعده‌ی قیمت", unit: "days" },
    ],
  },
  {
    id: "calendar",
    title: "تقویم",
    icon: CircleDollarSign,
    fields: [
      { key: "priceCalendarHorizonDays", label: "افق تقویم قیمت", unit: "days" },
      { key: "bookedDatesMaxRangeDays", label: "حداکثر بازه‌ی تاریخ‌های رزروشده", unit: "days" },
    ],
  },
];

/** برچسب کوتاه واحد — برای `suffix` فیلدهای فرم. */
export const SETTING_UNIT_SUFFIX: Record<SettingUnit, string> = {
  nights: "شب",
  guests: "نفر",
  days: "روز",
  minutes: "دقیقه",
  percent: "٪",
  toman: "تومان",
  count: "عدد",
};

/** قالب‌بندی مقدار تنظیمات برای نمایش (فقط‌خواندنی). */
export function formatSettingValue(value: number, unit: SettingUnit): string {
  const formatted = value.toLocaleString("fa-IR");

  switch (unit) {
    case "nights":
      return `${formatted} شب`;
    case "guests":
      return `${formatted} نفر`;
    case "days":
      return `${formatted} روز`;
    case "minutes":
      return `${formatted} دقیقه`;
    case "percent":
      return `${formatted}٪`;
    case "toman":
      return `${formatCurrency(value)} تومان`;
    default:
      return formatted;
  }
}

export type { SettingField };
export type SettingsSnapshot = AppSettings;
