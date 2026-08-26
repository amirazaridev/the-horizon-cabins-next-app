import { CalendarDays } from "lucide-react";
import type { ReactNode } from "react";

export default function DateSelectorPanel(): ReactNode {
  return (
    <div className="lg:col-span-3 flex h-full min-h-105 flex-col overflow-hidden rounded-3xl border border-white/5 bg-surface/60 backdrop-blur-sm">
      <div className="flex items-center gap-3 border-b border-white/5 px-6 py-4">
        <CalendarDays className="text-primary-400 size-5" />
        <h3 className="font-bold text-white">انتخاب تاریخ اقامت</h3>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
          <CalendarDays className="mb-4 size-12 text-white/20" />
          <p className="font-medium text-white/60">تقویم انتخاب تاریخ</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/35">
            تاریخ picker برای انتخاب بازه ورود و خروج به‌زودی اینجا قرار می‌گیرد
          </p>
        </div>
      </div>
    </div>
  );
}
