"use client";

import { useState } from "react";

import BudgetSlider from "./BudgetSlider";
import {
  BUDGET_MAX,
  BUDGET_MIN,
  BUDGET_STEP,
} from "../../types/search.types";
import {
  formatBudgetLabel,
  formatBudgetValue,
} from "../../utils/search-summary";

type Props = {
  /** مقدار اعمال‌شده‌ی فعلی (null یعنی بدون محدودیت) */
  value: number | null;
  onChange: (value: number | null) => void;
  onDone: () => void;
};

/**
 * پنل بودجه با جریان صریح draft → اعمال.
 *
 * کشیدن اسلایدر فقط state محلی این پنل را عوض می‌کند و هیچ درخواستی
 * نمی‌فرستد؛ فقط با فشردن «اعمال» مقدار به سرچ منتقل می‌شود.
 */
export default function BudgetPanel({ value, onChange, onDone }: Props) {
  const [draftValue, setDraftValue] = useState<number>(value ?? BUDGET_MAX);

  const isUnlimited = draftValue >= BUDGET_MAX;
  const isApplied = value !== null;
  const isDirty = (value ?? BUDGET_MAX) !== draftValue;

  const apply = () => {
    onChange(isUnlimited ? null : draftValue);
    onDone();
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-text-gray text-xs leading-6">
        حداکثر بودجه‌ی شما برای هر شب اقامت. قیمت‌ها به تومان و شبانه است.
      </p>

      <BudgetSlider
        value={draftValue}
        min={BUDGET_MIN}
        max={BUDGET_MAX}
        step={BUDGET_STEP}
        onChange={setDraftValue}
        formatValue={(next) =>
          next >= BUDGET_MAX ? "بدون محدودیت" : formatBudgetValue(next)
        }
        ariaLabel="حداکثر بودجه‌ی هر شب"
      />

      {!isUnlimited && (
        <p className="text-text text-sm font-bold">
          {formatBudgetLabel(draftValue)}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={apply}
          className="bg-primary-400 hover:bg-primary-500 flex-1 rounded-xl py-2.5 text-sm font-bold text-black transition-colors active:scale-[0.98]"
        >
          اعمال
        </button>

        {isApplied && (
          <button
            type="button"
            onClick={() => {
              setDraftValue(BUDGET_MAX);
              onChange(null);
              onDone();
            }}
            className="border-border text-text-gray hover:text-text flex-1 rounded-xl border py-2.5 text-sm font-bold transition-colors"
          >
            حذف بودجه
          </button>
        )}
      </div>

      {isDirty && (
        <p className="text-text-gray text-center text-[11px]">
          مقدار جدید تا فشردن «اعمال» روی نتایج اثر ندارد.
        </p>
      )}
    </div>
  );
}
