"use client";

import type { ReactNode } from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import Modal from "@/components/ui/Modal";
import useMediaQuery from "@/hooks/useMediaQuery";
import { getBookingPanelLabels } from "../../utils/booking";
import BookingSummary from "./BookingSummary";
import { useBooking } from "./BookingProvider";

/**
 * زیر این عرض، خلاصه به‌شکل باتم‌شیت باز می‌شود.
 * هم‌مرز با `lg` انتخاب شده تا با نقطه‌ی شکست aside رزرو (`hidden lg:block`)
 * یکی باشد: در هر اندازه‌ای که aside دیده نمی‌شود، خلاصه از پایین می‌آید.
 */
const COMPACT_QUERY = "(max-width: 1023.5px)";

/**
 * خلاصه‌ی قیمت — به‌محض کامل‌شدن بازه (انتخاب تاریخ خروج) خودبه‌خود باز می‌شود.
 *
 * روی موبایل/تبلت **باتم‌شیت** است (همان کامپوننتی که با دکمه‌ی «رزرو» در
 * نوار ثابت پایین باز می‌شود) و از `lg` به بالا **مودال** وسط صفحه.
 *
 * ⚠️ انتخاب بین این دو با `useMediaQuery` انجام می‌شود، نه با رندر هر دو و
 * پنهان‌کردن یکی با CSS: تله‌ی فوکوسِ لایه‌ی پنهان هم فعال می‌ماند و چون
 * هیچ عنصر قابل فوکوسی ندارد (`display:none`)، لیسنرِ Tab آن مدام
 * `preventDefault` می‌زند و ناوبری کیبورد را می‌شکند.
 *
 * چرا `useMediaQuery` (که مقدار اولیه‌اش `false` است) اینجا CLS نمی‌سازد؟
 * چون این کامپوننت از ابتدای بارگذاری mount است و افکت `matchMedia` روی
 * mount اجرا می‌شود؛ پس تا وقتی کاربر تاریخی انتخاب کند، مقدار درست است.
 * علاوه بر آن، لایه‌ی شناور در HTML اولیه چیزی رندر نمی‌کند (`isOpen=false`).
 *
 * عنوان لایه همان عنوان شرطی پنل است («نرخ هر شب» / «صورت‌حساب») و
 * `BookingSummary` با `showHeading={false}` از تکرارش جلوگیری می‌کند.
 */
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
