export type DateRange = {
  from: Date | null;
  to: Date | null;
};

export type CalendarDayPrice = {
  /** نرخ پایه — وقتی `discounted` است، خط‌خورده نمایش داده می‌شود. */
  basePrice: number;
  /** نرخ نهایی قابل پرداخت آن شب. */
  finalPrice: number;
  /** آیا تخفیف دارد (نرخ نهایی کمتر از نرخ پایه است). */
  discounted: boolean;
};

export type DayOccupancy = "none" | "morning" | "afternoon" | "full";

/** مرحله‌ی انتخاب در تقویم دوقلو. */
export type RangeStage = "from" | "to" | "done";

export type RangeDatePickerProps = {
  value: DateRange;
  /** با هر انتخاب (نصفِ بازه یا کامل) صدا زده می‌شود */
  onChange: (next: DateRange) => void;
  /** بعد از انتخاب شدنِ تاریخ خروج، با بازه کامل صدا زده می‌شود */
  onComplete?: (range: { from: Date; to: Date }) => void;
  /** تعداد ماه‌های نمایش‌داده‌شده کنار هم (پیش‌فرض ۲) */
  numberOfMonths?: number;
  /** تاریخ‌های قبل از این غیرفعال می‌شوند (پیش‌فرض: امروز) */
  minDate?: Date;
  /** تاریخ‌های بعد از این غیرفعال می‌شوند (سقف افق رزرو). */
  maxDate?: Date;
  disabledDates?: Date[];
  dayTitle?: (date: Date) => string | null;
  dayPrice?: (date: Date) => CalendarDayPrice | null;
  dayOccupancy?: (date: Date) => DayOccupancy;
  className?: string;
};
