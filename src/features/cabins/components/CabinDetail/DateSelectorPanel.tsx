import { CalendarDays } from "lucide-react";
import type { ReactNode } from "react";

export default function DateSelectorPanel(): ReactNode {
  return (
    <div className="border-foreground/10 bg-surface/60 flex h-full min-h-105 flex-col overflow-hidden rounded-3xl border shadow-md backdrop-blur-sm lg:col-span-3">
      <div className="border-foreground/5 flex items-center gap-3 border-b px-6 py-4">
        <CalendarDays className="text-primary-400 size-5" />
        <h3 className="text-text font-bold">انتخاب تاریخ اقامت</h3>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="border-foreground/15 flex w-full flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-16 text-center">
          <CalendarDays className="text-text-gray/30 mb-4 size-12" />
          <p className="text-text-gray font-medium">تقویم انتخاب تاریخ</p>
          <p className="text-text-gray/60 mt-2 max-w-xs text-sm leading-relaxed">
            تاریخ picker برای انتخاب بازه ورود و خروج به‌زودی اینجا قرار می‌گیرد
          </p>
        </div>
      </div>
    </div>
  );
}
