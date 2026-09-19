"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";

type Props = {
  onDone: () => void;
};

/**
 * پنل تستی تاریخ سفر — فعلاً روی نتایج اثر نمی‌گذارد و در URL ذخیره نمی‌شود.
 * بعداً date picker همین‌جا جایگزین می‌شود.
 */
export default function DatePanel({ onDone }: Props) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const clear = () => {
    setCheckIn("");
    setCheckOut("");
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="bg-primary-400/15 flex size-9 items-center justify-center rounded-full">
          <CalendarDays className="text-primary-400 size-4" />
        </span>
        <div>
          <p className="text-text text-sm font-bold">تاریخ سفر</p>
          <p className="text-text-gray text-xs">پنل تستی — به‌زودی date picker</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-text-gray mb-1.5 block text-xs">تاریخ ورود</span>
          <input
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            placeholder="۱۴۰۵/۰۷/۰۱"
            inputMode="numeric"
            className="bg-background-2 text-text w-full rounded-xl border border-foreground/10 px-3 py-2.5 text-sm outline-none placeholder:text-text-gray/60 focus:border-primary-400"
          />
        </label>
        <label className="block">
          <span className="text-text-gray mb-1.5 block text-xs">تاریخ خروج</span>
          <input
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            placeholder="۱۴۰۵/۰۷/۰۳"
            inputMode="numeric"
            className="bg-background-2 text-text w-full rounded-xl border border-foreground/10 px-3 py-2.5 text-sm outline-none placeholder:text-text-gray/60 focus:border-primary-400"
          />
        </label>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={clear}
          className="text-text-gray flex-1 rounded-xl border border-foreground/10 py-2.5 text-sm font-medium transition-colors hover:text-text"
        >
          حذف
        </button>
        <button
          type="button"
          onClick={onDone}
          className="bg-primary-400 flex-1 rounded-xl py-2.5 text-sm font-bold text-black transition-transform active:scale-95"
        >
          ثبت (تستی)
        </button>
      </div>
    </div>
  );
}
