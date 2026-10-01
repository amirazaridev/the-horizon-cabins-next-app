"use client";

import type { ReactNode } from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import { getBookingPanelLabels } from "../../utils/booking";
import BookingSummary from "./BookingSummary";
import { useBooking } from "./BookingProvider";

/**
 * باتم‌شیت رزرو موبایل.
 *
 * فقط از نوار ثابت موبایل باز می‌شود، پس روی دسکتاپ هیچ‌وقت `open` نمی‌شود
 * و نیازی به گارد media query ندارد.
 *
 * عنوان شیت همان عنوان شرطی پنل است («نرخ هر شب» / «صورت‌حساب») و به
 * `BookingSummary` می‌گوییم عنوان را دوباره رندر نکند (`showHeading={false}`).
 *
 * کلیک روی فیلد تاریخ داخل شیت، اول شیت را می‌بندد و بعد صفحه را به سکشن
 * تقویم می‌برد؛ اگر برعکس عمل شود، شیت روی تقویم باز می‌ماند و کاربر آن را
 * نمی‌بیند.
 */
export default function BookingSheet(): ReactNode {
  const { isSheetOpen, closeSheet, scrollToRateSection, isComplete } =
    useBooking();

  const handleRequestDates = () => {
    closeSheet();
    // یک فریم صبر می‌کنیم تا انیمیشن بستن شروع شود و اسکرول روان بماند
    window.setTimeout(scrollToRateSection, 0);
  };

  return (
    <BottomSheet
      open={isSheetOpen}
      onClose={closeSheet}
      title={getBookingPanelLabels(isComplete).heading}
      description="تاریخ ورود، تاریخ خروج و تعداد نفرات را مشخص کنید."
    >
      <BookingSummary
        showCta
        showHeading={false}
        onRequestDates={handleRequestDates}
      />
    </BottomSheet>
  );
}
