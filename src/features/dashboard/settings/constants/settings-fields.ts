import { CalendarRange, CircleDollarSign, Tags, type LucideIcon } from "lucide-react";

import { formatCurrency } from "@/libs/utils/format";
import type { AppSettings, SettingKey } from "../types/settings.types";

/** واحد نمایش مقدار تنظیمات. */
type SettingUnit = "nights" | "guests" | "days" | "minutes" | "percent" | "toman" | "count";

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

/** قالب‌بندی مقدار تنظیمات برای نمایش. */
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

export type { SettingUnit };
export type SettingsSnapshot = AppSettings;
