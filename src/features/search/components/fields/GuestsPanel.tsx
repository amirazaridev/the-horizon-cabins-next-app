"use client";

import { Users } from "lucide-react";

import Counter from "@/components/ui/Counter";
import { GUESTS_MAX, GUESTS_MIN } from "../../types/search.types";

type Props = {
  /** مقدار واقعی draft؛ `null` یعنی کاربر هنوز مهمان انتخاب نکرده */
  value: number | null;
  onChange: (value: number) => void;
  onDone: () => void;
};

/**
 * انتخاب تعداد مهمان با شمارنده — بازه‌ی سرچ اصلی: ۱ تا ۱۰ نفر.
 *
 * نکته‌ی مهم: اگر مقدار `null` باشد، شمارنده حداقل (۱) را نشان می‌دهد.
 * برای اینکه نمایش و مقدار واقعی از هم جدا نمانند، دکمه‌ی «تایید» همان
 * مقدار نمایش‌داده‌شده را ثبت می‌کند و بعد پنل را می‌بندد.
 */
export default function GuestsPanel({ value, onChange, onDone }: Props) {
  const shown = value ?? GUESTS_MIN;

  const handleDone = () => {
    if (value === null) onChange(shown);
    onDone();
  };

  return (
    <div className="flex flex-col gap-4">
      <Counter
        label="تعداد مهمان"
        hint="حداقل ظرفیت موردنیاز اقامتگاه"
        icon={<Users className="size-4" />}
        value={shown}
        onChange={onChange}
        min={GUESTS_MIN}
        max={GUESTS_MAX}
      />

      <button
        type="button"
        onClick={handleDone}
        className="bg-primary-400 w-full rounded-xl py-3 text-sm font-bold text-black transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      >
        تایید
      </button>
    </div>
  );
}
