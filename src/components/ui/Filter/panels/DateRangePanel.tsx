"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import RangeDatePicker, {
  type CalendarDayPrice,
  type DateRange,
  type DayOccupancy,
} from "@/components/ui/RangeDatePicker";
import { RANGE_PICKER_NARROW_QUERY } from "./range-picker-breakpoint";

export type { DateRange };

type Props = {
  /** بازه فعلی (controlled) */
  value: DateRange;
  /**
   * با هر کلیک روی تقویم صدا زده می‌شود — حتی بازه ناقص (فقط ورود).
   * مقصد نوشتن با مصرف‌کننده است:
   * - فیلتر cabins: بلافاصله در URL (checkIn/checkOut) ثبت می‌شود؛
   * - سرچ landing: در state محلی ثبت می‌شود.
   */
  onChange: (range: DateRange) => void;
  /** بعد از کامل شدن بازه (انتخاب خروج) صدا زده می‌شود */
  onComplete?: () => void;
  /** نمایش دکمه «حذف تاریخ» زیر تقویم */
  showClear?: boolean;
  onClear?: () => void;
  clearLabel?: string;
  /** کمینه/بیشینه‌ی تاریخ‌های قابل‌انتخاب — به تقویم پاس داده می‌شوند. */
  minDate?: Date;
  maxDate?: Date;
  /** روزهای رزرو‌شده که باید غیرفعال شوند. */
  disabledDates?: Date[];
  /** نرخ شب هر روز — با دادنش، قیمت داخل سلول‌های تقویم نمایش داده می‌شود. */
  dayPrice?: (date: Date) => CalendarDayPrice | null;
  /**
   * وضعیت اشغال هر روز — هاشور کامل (کاملاً رزرو) یا نصفه (روز ورود/خروجِ
   * یک رزرو). روزهای نیمه‌آزاد قابل کلیک می‌مانند.
   */
  dayOccupancy?: (date: Date) => DayOccupancy;
  /**
   * کلاس تکمیلی روی ریشه — برای رزرو ارتفاع تقویم در مصرف‌کننده‌هایی که
   * بعد از hydration جهش چیدمان می‌گیرند (مثل صفحه‌ی جزئیات اقامتگاه).
   */
  className?: string;
};

/**
 * هسته مشترک انتخاب بازه تاریخ (تقویم شمسی دوقلو) برای FilterCard.
 * هم سرچ لندینگ و هم فیلتر cabins از همین کامپوننت استفاده می‌کنند؛
 * تفاوت رفتار (URL در برابر state) در آداپتور هر فیچر می‌ماند.
 */
export default function DateRangePanel({
  value,
  onChange,
  onComplete,
  showClear = false,
  onClear,
  clearLabel = "حذف تاریخ",
  minDate,
  maxDate,
  disabledDates,
  dayPrice,
  dayOccupancy,
  className = "",
}: Props) {
  /*
    فقط تعداد ماه‌ها را تعیین می‌کند؛ **چیدمان** را
    `RangeDatePicker/style.module.css` به‌صورت موبایل‌محور کنترل می‌کند.
    ⚠️ تکیه‌کردن به این مقدار به‌تنهایی کافی نیست: در اولین رندر کلاینت
    (قبل از اجرای افکتِ `useMediaQuery`) مقدار `false` است، پس تقویم با
    ۲ ماه mount می‌شود. برای همین CSS هم مستقلاً تک‌ماه را تضمین می‌کند.
  */
  const isNarrow = useMediaQuery(RANGE_PICKER_NARROW_QUERY);

  const hasSelection = value.from !== null || value.to !== null;

  return (
    <div className={className}>
      <RangeDatePicker
        value={value}
        onChange={onChange}
        onComplete={onComplete}
        numberOfMonths={isNarrow ? 1 : 2}
        minDate={minDate}
        maxDate={maxDate}
        disabledDates={disabledDates}
        dayPrice={dayPrice}
        dayOccupancy={dayOccupancy}
      />

      {showClear && (
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            disabled={!hasSelection}
            className="text-text-gray border-foreground/10 hover:text-text flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40"
          >
            {clearLabel}
          </button>
        </div>
      )}
    </div>
  );
}
