"use client";

import { Users } from "lucide-react";

import Counter from "@/components/ui/Counter";

type Props = {
  value: number;
  onChange: (value: number) => void;
  onDone: () => void;
};

const MAX_GUESTS = 10;

/** انتخاب تعداد مهمان با شمارنده + و - */
export default function GuestsPanel({ value, onChange, onDone }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Counter
        label="تعداد مهمان"
        hint="حداقل ظرفیت موردنیاز اقامتگاه"
        icon={<Users className="size-4" />}
        value={value}
        onChange={onChange}
        min={1}
        max={MAX_GUESTS}
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
