"use client";

import { Users } from "lucide-react";

import Counter from "@/components/ui/Counter";
import { GUESTS_MAX, GUESTS_MIN } from "../../types/search.types";

type Props = {
  value: number;
  onChange: (value: number) => void;
  onDone: () => void;
};

/** انتخاب تعداد مهمان با شمارنده — بازه‌ی سرچ اصلی: ۱ تا ۱۰ نفر */
export default function GuestsPanel({ value, onChange, onDone }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Counter
        label="تعداد مهمان"
        hint="حداقل ظرفیت موردنیاز اقامتگاه"
        icon={<Users className="size-4" />}
        value={value}
        onChange={onChange}
        min={GUESTS_MIN}
        max={GUESTS_MAX}
      />

      <button
        type="button"
        onClick={onDone}
        className="bg-primary-400 w-full rounded-xl py-3 text-sm font-bold text-black transition-transform active:scale-95"
      >
        تایید
      </button>
    </div>
  );
}
