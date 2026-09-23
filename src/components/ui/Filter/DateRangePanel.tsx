"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import RangeDatePicker, {
  type DateRange,
} from "@/components/ui/RangeDatePicker";

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
}: Props) {
  const isNarrow = useMediaQuery("(max-width: 640px)");

  const hasSelection = value.from !== null || value.to !== null;

  return (
    <div>
      <RangeDatePicker
        value={value}
        onChange={onChange}
        onComplete={onComplete}
        numberOfMonths={isNarrow ? 1 : 2}
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
