"use client";

import PriceRangePanel from "@/components/ui/Filter/panels/PriceRangePanel";
import type { BudgetRange } from "../../types/search.types";

type Props = {
  /** بازه‌ی اعمال‌شده‌ی فعلی (null یعنی بدون محدودیت) */
  value: BudgetRange | null;
  onChange: (value: BudgetRange | null) => void;
  onDone: () => void;
  /**
   * فقط با کلیک روی «اعمال» صدا زده می‌شود (نه «حذف بودجه»).
   * سرچ اصلی از این استفاده می‌کند تا همان کلیک، جستجو را هم اجرا کند.
   */
  onApply?: (value: BudgetRange | null) => void;
  /**
   * اگر `true` باشد، بازه‌ی کامل هم صریحاً `{min, max}` ثبت می‌شود
   * (به‌جای `null`). سرچ لندینگ این را `true` می‌فرستد تا «اعمال» همیشه
   * یک جستجوی واقعی بسازد و بخش پیش‌نمایش باز شود.
   */
  commitFullRange?: boolean;
};

/**
 * آداپتور «بازه‌ی بودجه‌ی هر شب» برای سرچ اصلی.
 *
 * همان `PriceRangePanel` مشترک را رندر می‌کند؛ تفاوتش فقط متن راهنما و
 * برچسب دکمه‌هاست. این‌طور اسلایدر قیمت `/cabins` و اسلایدر بودجه‌ی سرچ
 * یک پیاده‌سازی واحد دارند و از هم واگرا نمی‌شوند.
 */
export default function BudgetPanel({
  value,
  onChange,
  onDone,
  onApply,
  commitFullRange,
}: Props) {
  return (
    <PriceRangePanel
      value={value}
      onChange={onChange}
      onDone={onDone}
      onApply={onApply}
      commitFullRange={commitFullRange}
      hint="بازه‌ی بودجه‌ای که برای هر شب اقامت در نظر دارید. قیمت‌ها به تومان و شبانه است."
      clearLabel="حذف بودجه"
    />
  );
}
