"use client";

import { useState } from "react";
import DateRangePanel, {
  type DateRange,
} from "@/components/ui/filter/DateRangePanel";
import {
  formatDateParam,
  parseDateParam,
  type CabinDateValue,
} from "../../../lib/cabin-date";
import { useCabinQuery } from "../useCabinQuery";

type Props = {
  /**
   * حالت controlled (داخل FilterCard دسکتاپ):
   * value از searchParams می‌آید و onChange به URL می‌نویسد.
   * اگر onChange داده نشود، پنل خودش مستقیم با useCabinQuery کار می‌کند (موبایل).
   */
  value?: CabinDateValue;
  onChange?: (next: CabinDateValue) => void;
  /** بعد از کامل شدن بازه (انتخاب خروج) صدا زده می‌شود — معمولاً بستن پنل */
  onDone?: () => void;
};

function toRange(value: CabinDateValue): DateRange {
  return {
    from: parseDateParam(value.checkIn),
    to: parseDateParam(value.checkOut),
  };
}

/**
 * تاریخ سفر — آداپتور cabins روی هسته مشترک DateRangePanel.
 * برخلاف سرچ لندینگ (state محلی)، هر کلیک روی تقویم بلافاصله در
 * checkIn/checkOut آدرس ثبت می‌شود تا با URL همگام بماند.
 * فعلاً روی نتایج اثر نمی‌گذارد (دیتای اشغال نداریم).
 */
export default function DatePanel({ value, onChange, onDone }: Props) {
  const { searchParams, setParams } = useCabinQuery();

  const external: CabinDateValue = value ?? {
    checkIn: searchParams.get("checkIn"),
    checkOut: searchParams.get("checkOut"),
  };

  const commit = (next: CabinDateValue) => {
    if (onChange) onChange(next);
    else setParams({ checkIn: next.checkIn, checkOut: next.checkOut });
  };

  // درفت محلی برای پاسخ آنی UI؛ همگام‌سازی با URL ناوبری async است.
  // وقتی مقدار بیرونی (URL) عوض شد — مثلاً دکمه «حذف فیلترها» — درفت ریست می‌شود.
  const [draft, setDraft] = useState<DateRange>(() => toRange(external));
  const [lastSynced, setLastSynced] = useState(external);
  if (
    external.checkIn !== lastSynced.checkIn ||
    external.checkOut !== lastSynced.checkOut
  ) {
    setLastSynced(external);
    setDraft(toRange(external));
  }

  const handleChange = (range: DateRange) => {
    setDraft(range);
    commit({
      checkIn: range.from ? formatDateParam(range.from) : null,
      checkOut: range.to ? formatDateParam(range.to) : null,
    });
  };

  const clear = () => {
    setDraft({ from: null, to: null });
    commit({ checkIn: null, checkOut: null });
  };

  return (
    <DateRangePanel
      value={draft}
      onChange={handleChange}
      onComplete={onDone}
      showClear
      onClear={clear}
    />
  );
}
