"use client";

import PriceRangePanel from "@/components/ui/Filter/panels/PriceRangePanel";
import type { BudgetRange } from "../../types/search.types";

type Props = {
  /** بازه‌ی اعمال‌شده‌ی فعلی (null یعنی بدون محدودیت) */
  value: BudgetRange | null;
  onChange: (value: BudgetRange | null) => void;
  onDone: () => void;
};

/**
 * آداپتور «بازه‌ی بودجه‌ی هر شب» برای سرچ اصلی.
 *
 * همان `PriceRangePanel` مشترک را رندر می‌کند؛ تفاوتش فقط متن راهنما و
 * برچسب دکمه‌هاست. این‌طور اسلایدر قیمت `/cabins` و اسلایدر بودجه‌ی سرچ
 * یک پیاده‌سازی واحد دارند و از هم واگرا نمی‌شوند.
 */
export default function BudgetPanel({ value, onChange, onDone }: Props) {
  return (
    <PriceRangePanel
      value={value}
      onChange={onChange}
      onDone={onDone}
      hint="بازه‌ی بودجه‌ای که برای هر شب اقامت در نظر دارید. قیمت‌ها به تومان و شبانه است."
      clearLabel="حذف بودجه"
    />
  );
}
