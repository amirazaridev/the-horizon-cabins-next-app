"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CalendarSearch } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/libs/utils/format";
import { toFaNumber } from "../../utils/booking";
import { useBooking } from "./BookingProvider";

/**
 * نوار ثابت رزرو در موبایل.
 *
 * دو نکته‌ی مهم:
 *  ۱) `hz-safe-b` فاصله‌ی امن پایین (safe-area) را رعایت می‌کند تا روی
 *     گوشی‌های notch‌دار دکمه زیر نوار خانه‌ی سیستم نرود. فضای اشغال‌شده‌ی
 *     این نوار هم در `CabinDetail` با padding-bottom رزرو شده است.
 *  ۲) وقتی فوتر وارد دید می‌شود نوار کنار می‌رود؛ وگرنه روی لینک‌های
 *     فوتر می‌افتاد و آن‌ها را غیرقابل کلیک می‌کرد.
 *
 * ⚠️ عدد نمایش‌داده‌شده با انتخاب بازه عوض می‌شود (مثل aside): تا وقتی بازه
 * ناقص است «شروع از» کمترین نرخ شب است و از لحظه‌ی کامل‌شدن بازه، مبلغ نهایی
 * اقامت. هر دو از قیمت واقعی تقویم می‌آیند.
 */
export default function MobileBookingBar(): ReactNode {
  const { price, startingNight, isComplete, nights, isSheetOpen, openSheet } =
    useBooking();
  const [isFooterVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => setFooterVisible(entries[0]?.isIntersecting ?? false),
      { threshold: 0 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const amount = isComplete ? price.total : (startingNight?.finalPrice ?? 0);
  const original = isComplete ? price.gross : (startingNight?.basePrice ?? 0);
  const hasDiscount = original > amount;
  const discountPercent = hasDiscount
    ? Math.round(((original - amount) / original) * 100)
    : 0;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 motion-reduce:transition-none lg:hidden ${
        isFooterVisible ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="border-foreground/10 bg-surface/95 hz-safe-b border-t px-4 pt-3 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-text flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold tabular-nums">
                {formatCurrency(amount)}
              </span>
              <span className="text-text-gray text-xs font-medium">
                {isComplete ? `تومان — ${toFaNumber(nights)} شب` : "تومان / شب"}
              </span>
            </p>

            {hasDiscount ? (
              <p className="text-text-gray mt-0.5 flex items-center gap-2 text-xs">
                <span className="line-through tabular-nums">
                  {formatCurrency(original)}
                </span>
                <span className="bg-primary-400 rounded-full px-2 py-0.5 text-[10px] font-bold text-black">
                  {toFaNumber(discountPercent)}٪ تخفیف
                </span>
              </p>
            ) : (
              <p className="text-text-gray mt-0.5 text-xs">
                {isComplete
                  ? "مبلغ نهایی اقامت"
                  : "قیمت نهایی برای هر شب اقامت"}
              </p>
            )}
          </div>

          <Button
            shape="xl"
            onClick={openSheet}
            className="shrink-0 px-6"
            aria-haspopup="dialog"
            aria-expanded={isSheetOpen}
          >
            <CalendarSearch className="size-5" />
            {isComplete ? "رزرو" : "انتخاب تاریخ"}
          </Button>
        </div>
      </div>
    </div>
  );
}
