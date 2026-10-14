import type { PublicSettings } from "@/features/settings/types/public-settings.types";

export type CabinCalendarDay = {
  /** کلید تاریخ به‌شکل `YYYY-MM-DD` (بدون شیفت تایم‌زون). */
  date: string;
  basePrice: number;
  discountPercent: number;
  surchargePercent: number;
  /** قیمت نهایی آن شب پس از تخفیف/افزایش — واحد تومان. */
  finalPrice: number;
};

export type BookedRange = {
  /** `YYYY-MM-DD` */
  startDate: string;
  /** `YYYY-MM-DD` */
  endDate: string;
};

/** نقشه‌ی قیمت بر اساس کلید روز — برای جست‌وجوی O(1) هنگام رندر تقویم. */
export type CalendarPriceMap = Map<string, CabinCalendarDay>;

export type CabinBookingData = {
  /** تنظیمات عمومی مؤثر (افق رزرو، طول اقامت، ...). */
  settings: PublicSettings;
  /** قیمت شب‌های پنجره‌ی تقویم (صعودی). */
  calendarDays: CabinCalendarDay[];
  /** بازه‌های رزرو‌شده‌ی کابین (نیمه‌باز) — Provider آن‌ها را به روز غیرفعال تبدیل می‌کند. */
  bookedRanges: BookedRange[];
};
