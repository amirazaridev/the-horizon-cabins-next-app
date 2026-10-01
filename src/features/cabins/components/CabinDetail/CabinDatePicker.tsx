"use client";

import { CalendarDays } from "lucide-react";
import type { ReactNode } from "react";
import DateRangePanel from "@/components/ui/Filter/panels/DateRangePanel";
import { toFaNumber } from "../../utils/booking";
import { useBooking } from "./BookingProvider";

/**
 * تقویم شمسی داخل صفحه‌ی جزئیات (سکشن «نرخ و رزرو»).
 *
 * روی همان هسته‌ی مشترک `DateRangePanel` سوار است — دقیقاً همان
 * کامپوننتی که سرچ لندینگ و فیلتر `/cabins` استفاده می‌کنند. پس تقویم،
 * تم، دکمه‌ی «حذف تاریخ» و تفاوت یک‌ماه/دوماه موبایل و دسکتاپ همه
 * تک‌نسخه‌اند و اینجا فقط قاب و سرتیتر اضافه شده است.
 *
 * state رزرو از `useBooking` می‌آید؛ پس انتخاب اینجا بلافاصله در aside،
 * نوار موبایل و خلاصه‌ی قیمت دیده می‌شود.
 *
 * ⚠️ TODO(backend): بک‌اند فهرست روزهای رزروشده نمی‌دهد. `RangeDatePicker`
 * پراپ `disabledDates` را پشتیبانی می‌کند؛ با اضافه‌شدن اندپوینت، فقط
 * کافی است همان آرایه به `DateRangePanel` منتقل شود (مسیر داده:
 * `/api/v1/cabins/:id/availability`).
 */
export default function CabinDatePicker(): ReactNode {
  const { range, setRange, clearRange, nights, isComplete } = useBooking();

  return (
    <div className="border-foreground/10 bg-surface/60 overflow-hidden rounded-3xl border shadow-md backdrop-blur-sm">
      <div className="border-foreground/5 flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <CalendarDays className="text-primary-400 size-5" aria-hidden="true" />
          <h3 className="text-text font-bold">انتخاب تاریخ اقامت</h3>
        </div>

        {isComplete && (
          <span className="bg-primary-400/10 text-primary-600 dark:text-primary-400 rounded-full px-3 py-1 text-xs font-bold tabular-nums">
            {toFaNumber(nights)} شب
          </span>
        )}
      </div>

      <div className="p-4 sm:p-6">
        {/*
          ⚠️ `hz-reserve-calendar` ارتفاع تقویم را رزرو می‌کند.
          `react-multi-date-picker` فقط روی کلاینت رندر می‌شود (در HTML سرور
          جعبه‌اش خالی است)، پس بدون این رزرو، صفحه بعد از hydration حدود
          ۳۳۰ پیکسل جهش می‌کرد (CLS). کلاس در `globals.css` تعریف شده و
          عمداً از بیرون اعمال می‌شود تا سرچ لندینگ و فیلتر `/cabins` که
          همین هسته را استفاده می‌کنند تغییری نبینند.
        */}
        <DateRangePanel
          className="hz-reserve-calendar"
          value={range}
          onChange={setRange}
          showClear
          onClear={clearRange}
          clearLabel="حذف تاریخ"
        />
      </div>

      <p className="border-foreground/5 text-text-gray border-t px-5 py-3 text-xs leading-relaxed sm:px-6">
        روزهای پیش از امروز قابل انتخاب نیستند. با انتخاب تاریخ ورود، تقویم
        منتظر تاریخ خروج می‌ماند و بعد از آن مبلغ کل در کنار همین تقویم و در
        خلاصه‌ی رزرو محاسبه می‌شود.
      </p>
    </div>
  );
}
