"use client";

import type { ReactNode } from "react";
import Modal from "@/components/ui/Modal";
import BookingSummary from "./BookingSummary";
import { useBooking } from "./BookingProvider";

/**
 * مودال خلاصه‌ی قیمت.
 *
 * به‌محض کامل‌شدن بازه (انتخاب تاریخ خروج) خودبه‌خود باز می‌شود — هم در
 * دسکتاپ و هم در موبایل. محتوایش همان `BookingSummary` است، پس هیچ عددی
 * اینجا دستی محاسبه نمی‌شود و با aside/شیت همیشه یکی است.
 */
export default function BookingSummaryDialog(): ReactNode {
  const { isSummaryOpen, closeSummary, nights } = useBooking();

  return (
    <Modal
      isOpen={isSummaryOpen}
      onClose={closeSummary}
      size="md"
      title="خلاصه‌ی رزرو شما"
      description={
        nights > 0
          ? `${nights.toLocaleString("fa-IR")} شب اقامت — هزینه‌ها به‌صورت شفاف محاسبه شده است.`
          : undefined
      }
    >
      <BookingSummary showCta />
    </Modal>
  );
}
