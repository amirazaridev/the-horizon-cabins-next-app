"use client";

import PriceRangePanel from "@/components/ui/Filter/panels/PriceRangePanel";
import type { BudgetRange } from "../../types/search.types";
import { budgetBoundsFor, budgetModeFor } from "../../utils/budget";

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
  /**
   * تعداد شب بازه‌ی انتخاب‌شده.
   *
   * صفر یعنی «بدون تاریخ» → بودجه‌ی **هر شب** (سقف ۳۰ میلیون).
   * بزرگ‌تر از صفر یعنی «با تاریخ» → بودجه‌ی **کل سفر** و سقف اسلایدر
   * ۳۰ میلیون × تعداد شب.
   */
  nights?: number;
};

/**
 * آداپتور «بازه‌ی بودجه» برای سرچ اصلی.
 *
 * همان `PriceRangePanel` مشترک را رندر می‌کند؛ تفاوتش متن راهنما، برچسب
 * دکمه‌ها و **محدوده‌ی اسلایدر** است که با حالت (هر شب / کل سفر) عوض می‌شود.
 */
export default function BudgetPanel({
  value,
  onChange,
  onDone,
  onApply,
  commitFullRange,
  nights = 0,
}: Props) {
  const mode = budgetModeFor(nights);
  const bounds = budgetBoundsFor(nights);

  return (
    <PriceRangePanel
      value={value}
      onChange={onChange}
      onDone={onDone}
      onApply={onApply}
      commitFullRange={commitFullRange}
      min={bounds.min}
      max={bounds.max}
      hint={
        mode === "total"
          ? `بودجه‌ی کل سفر برای ${nights.toLocaleString("fa-IR")} شب اقامت. مبلغ به تومان است.`
          : "بازه‌ی بودجه‌ای که برای هر شب اقامت در نظر دارید. قیمت‌ها به تومان و شبانه است."
      }
      clearLabel="حذف بودجه"
    />
  );
}
