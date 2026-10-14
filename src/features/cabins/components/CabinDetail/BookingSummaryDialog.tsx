"use client";

import type { ReactNode } from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import Modal from "@/components/ui/Modal";
import useMediaQuery from "@/hooks/useMediaQuery";
import { getBookingPanelLabels } from "../../utils/booking";
import BookingSummary from "./BookingSummary";
import { useBooking } from "./BookingProvider";

const COMPACT_QUERY = "(max-width: 1023.5px)";

export default function BookingSummaryDialog(): ReactNode {
  const {
    isSummaryOpen,
    closeSummary,
    nights,
    scrollToRateSection,
    isComplete,
  } = useBooking();
  const isCompact = useMediaQuery(COMPACT_QUERY);

  const title = getBookingPanelLabels(isComplete).heading;
  const description =
    nights > 0
      ? `${nights.toLocaleString("fa-IR")} شب اقامت — هزینه‌ها به‌صورت شفاف محاسبه شده است.`
      : "تاریخ ورود، تاریخ خروج و تعداد نفرات را مشخص کنید.";

  /** کلیک روی فیلد تاریخ: اول لایه بسته شود، بعد صفحه به تقویم برود */
  const handleRequestDates = () => {
    closeSummary();
    window.setTimeout(scrollToRateSection, 0);
  };

  if (isCompact) {
    return (
      <BottomSheet
        open={isSummaryOpen}
        onClose={closeSummary}
        title={title}
        description={description}
      >
        <BookingSummary
          showCta
          showHeading={false}
          onRequestDates={handleRequestDates}
        />
      </BottomSheet>
    );
  }

  return (
    <Modal
      isOpen={isSummaryOpen}
      onClose={closeSummary}
      size="md"
      title={title}
      description={description}
    >
      <BookingSummary
        showCta
        showHeading={false}
        onRequestDates={handleRequestDates}
      />
    </Modal>
  );
}
