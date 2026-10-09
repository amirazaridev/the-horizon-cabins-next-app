"use client";

import { CalendarDays } from "lucide-react";
import { useCallback, type ReactNode } from "react";
import DateRangePanel from "@/components/ui/Filter/panels/DateRangePanel";
import type { CalendarDayPrice } from "@/components/ui/RangeDatePicker";
import { toFaNumber } from "../../utils/booking";
import { useBooking } from "./BookingProvider";
import styles from "./CabinDatePicker.module.css";

/**
 * تقویم شمسی داخل صفحه‌ی جزئیات (سکشن «نرخ و رزرو»).
 *
 * روی همان هسته‌ی مشترک `DateRangePanel` سوار است — دقیقاً همان
 * کامپوننتی که سرچ لندینگ و فیلتر `/cabins` استفاده می‌کنند. پس تقویم،
 * تم، دکمه‌ی «حذف تاریخ» و تفاوت یک‌ماه/دوماه موبایل و دسکتاپ همه
 * تک‌نسخه‌اند و اینجا فقط قاب و سرتیتر اضافه شده است.
 *
 * ⚠️ اینجا سه چیز از داده‌ی سرور به تقویم تزریق می‌شود:
 *   ۱) `minDate`/`maxDate` — افق رزرو از تنظیمات بک‌اند؛ روزهای بعد از سقف
 *      غیرفعال می‌شوند.
 *   ۲) `disabledDates` — روزهایی که قبلاً رزرو شده‌اند.
 *   ۳) `dayPrice` — نرخ شب هر روز؛ با دادنش تقویم وارد حالت «دارای نرخ»
 *      می‌شود و زیر شماره‌ی روز، قیمت (و برای روزهای دارای تخفیف، نرخ پایه‌ی
 *      خط‌خورده + نرخ نهایی) نمایش داده می‌شود.
 *
 * state رزرو از `useBooking` می‌آید؛ پس انتخاب اینجا بلافاصله در aside،
 * نوار موبایل و خلاصه‌ی قیمت دیده می‌شود.
 */
export default function CabinDatePicker(): ReactNode {
  const {
    range,
    setRange,
    clearRange,
    nights,
    isComplete,
    priceForDate,
    disabledDates,
    minDate,
    maxDate,
    settings,
  } = useBooking();

  /**
   * نگاشت قیمت دامنه به شکل عمومیِ تقویم.
   *
   * ⚠️ `RangeDatePicker` یک کامپوننت `components/ui` است و نباید تایپ دامنه‌ی
   * کابین را بشناسد؛ پس همین‌جا `CabinCalendarDay` به `CalendarDayPrice`
   * تبدیل می‌شود.
   */
  const dayPrice = useCallback(
    (date: Date): CalendarDayPrice | null => {
      const day = priceForDate(date);
      if (!day) return null;
      return {
        basePrice: day.basePrice,
        finalPrice: day.finalPrice,
        discounted: day.finalPrice < day.basePrice,
      };
    },
    [priceForDate],
  );

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
          ⚠️ `styles.reserveCalendar` ارتفاع تقویم را رزرو می‌کند
          (`react-multi-date-picker` فقط روی کلاینت رندر می‌شود؛ در HTML
          سرور جعبه‌اش خالی است و بدون این رزرو، صفحه بعد از hydration
          حدود ۳۳۰ پیکسل جهش می‌کرد). تعریفش در
          `CabinDatePicker.module.css` است — چون تنها مصرف‌کننده‌اش همین
          صفحه است — و عمداً از بیرون اعمال می‌شود تا سرچ لندینگ و فیلتر
          `/cabins` که همین هسته را استفاده می‌کنند تغییری نبینند.
        */}
        <DateRangePanel
          className={styles.reserveCalendar}
          value={range}
          onChange={setRange}
          minDate={minDate}
          maxDate={maxDate}
          disabledDates={disabledDates}
          dayPrice={dayPrice}
          showClear
          onClear={clearRange}
          clearLabel="حذف تاریخ"
        />
      </div>

      <p className="border-foreground/5 text-text-gray border-t px-5 py-3 text-xs leading-relaxed sm:px-6">
        روزهای پیش از امروز و روزهای رزرو‌شده قابل انتخاب نیستند و رزرو تا
        حداکثر {toFaNumber(settings.maxAdvanceBookingDays)} روز آینده ممکن است.
        با انتخاب تاریخ ورود، تقویم منتظر تاریخ خروج می‌ماند و بعد از آن مبلغ کل
        در کنار همین تقویم و در خلاصه‌ی رزرو محاسبه می‌شود.
      </p>
    </div>
  );
}
