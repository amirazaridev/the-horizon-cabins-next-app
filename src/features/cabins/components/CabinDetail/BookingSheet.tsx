"use client";

import type { ReactNode } from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import { getBookingPanelLabels } from "../../utils/booking";
import BookingSummary from "./BookingSummary";
import { useBooking } from "./BookingProvider";

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
