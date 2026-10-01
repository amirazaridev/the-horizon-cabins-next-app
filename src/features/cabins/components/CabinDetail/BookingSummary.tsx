"use client";

import { CalendarDays, MoveLeft, Phone, Users } from "lucide-react";
import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import Counter from "@/components/ui/Counter";
import { formatJalaliDate } from "@/components/ui/RangeDatePicker";
import { SUPPORT_PHONE_HREF } from "@/constants/suport-phone";
import PriceDisplay from "@/features/cabins/components/PriceDisplay";
import { formatCurrency } from "@/libs/utils/format";
import { getBookingPanelLabels, toFaNumber } from "../../utils/booking";
import { useBooking } from "./BookingProvider";

type Props = {
  /** نمایش دکمه‌ی رزرو و مشاوره */
  showCta?: boolean;
  /**
   * کلیک روی فیلد تاریخ. پیش‌فرض: اسکرول به سکشن تقویم.
   * باتم‌شیت این را override می‌کند تا اول خودش بسته شود.
   */
  onRequestDates?: () => void;
  /**
   * رندر عنوان شرطی («نرخ هر شب» / «صورت‌حساب»).
   *
   * داخل aside که هدر لایه ندارد `true` می‌ماند؛ در باتم‌شیت و مودال
   * `false` می‌شود چون همان عنوان را در هدر خودِ لایه نشان می‌دهند و
   * وگرنه دوبار تکرار می‌شد.
   */
  showHeading?: boolean;
  className?: string;
};

/**
 * محتوای مشترک رزرو — یک نسخه برای هر سه جا.
 *
 * aside چسبان دسکتاپ، باتم‌شیت موبایل و مودال خلاصه دقیقاً همین کامپوننت
 * را رندر می‌کنند؛ پس منطق قیمت و چیدمان در یک جا زندگی می‌کند.
 *
 * **دو حالت نمایش:**
 *  • «نرخ هر شب» — تا وقتی بازه‌ی تاریخ کامل نشده: عدد بزرگ همان قیمت یک شب است.
 *  • «صورت‌حساب» — از همان رندری که بازه کامل می‌شود: عدد بزرگ مبلغ نهایی است.
 *
 * ⚠️ معیار تغییر حالت فقط کامل‌بودن بازه است، نه تعداد نفرات. شمارنده از
 * ابتدا مقدار دارد؛ اگر عنوان به آن گره بخورد، کاربر بعد از انتخاب تاریخ
 * تغییری نمی‌بیند و باید شمارنده را هم دست بزند.
 *
 * چیدمان عمداً فشرده است (فاصله‌های کوچک، فونت‌های ریزتر) تا پنل در ارتفاع
 * دید یک لپ‌تاپ جا شود؛ چون aside چسبان است و با صفحه اسکرول نمی‌شود، اگر
 * بلندتر از دید شود پایین پنل (دکمه‌ی رزرو) دست‌نیافتنی می‌ماند.
 */
export default function BookingSummary({
  showCta = false,
  onRequestDates,
  showHeading = true,
  className = "",
}: Props): ReactNode {
  const {
    range,
    nights,
    isComplete,
    guests,
    maxCapacity,
    price,
    setGuests,
    scrollToRateSection,
  } = useBooking();

  const labels = getBookingPanelLabels(isComplete);
  const handleDatesClick = onRequestDates ?? scrollToRateSection;

  const stages = [
    {
      key: "from" as const,
      label: "تاریخ ورود",
      value: formatJalaliDate(range.from),
      active: !range.from,
    },
    {
      key: "to" as const,
      label: "تاریخ خروج",
      value: formatJalaliDate(range.to),
      active: Boolean(range.from) && !range.to,
    },
  ];

  return (
    <div className={`flex flex-col gap-3.5 ${className}`}>
      {showHeading && (
        <h3 className="text-text text-base font-bold">{labels.heading}</h3>
      )}

      <PriceDisplay
        amount={isComplete ? price.total : price.perNight}
        originalAmount={isComplete ? price.gross : price.regularPerNight}
        caption={labels.amountCaption}
      />

      {/* فیلدهای تاریخ — کلیک، کاربر را به تقویم می‌برد */}
      <div className="grid grid-cols-2 gap-2">
        {stages.map((stage) => (
          <button
            key={stage.key}
            type="button"
            onClick={handleDatesClick}
            className={`rounded-xl border px-3 py-2 text-start transition-colors ${
              stage.active
                ? "border-primary-400/60 bg-primary-400/10"
                : "border-foreground/10 bg-background-2 hover:border-primary-400/40"
            }`}
          >
            <span className="text-text-gray flex items-center gap-1 text-[10px] font-medium">
              <CalendarDays className="size-3" />
              {stage.label}
            </span>
            <span
              className={`mt-0.5 block truncate text-xs font-bold ${
                stage.value ? "text-text" : "text-text-gray/60"
              }`}
            >
              {stage.value ?? "انتخاب کنید"}
            </span>
          </button>
        ))}
      </div>

      <Counter
        value={guests}
        onChange={setGuests}
        min={1}
        max={maxCapacity}
        label="تعداد نفرات"
        hint={`حداکثر ${toFaNumber(maxCapacity)} نفر`}
        icon={<Users className="size-4" />}
      />

      {/* جزییات حساب — ارتفاع خودکار؛ در صورت زیاد‌شدن محتوا فقط همین بخش اسکرول می‌شود */}
      <div className="border-foreground/10 overflow-hidden rounded-2xl border">
        <div className="border-foreground/10 flex items-center justify-between gap-2 border-b px-3.5 py-2.5">
          <h4 className="text-text text-xs font-extrabold">جزییات حساب</h4>
          {isComplete && (
            <span className="bg-primary-400/10 text-primary-600 dark:text-primary-400 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums">
              {toFaNumber(nights)} شب
            </span>
          )}
        </div>

        <div
          aria-live="polite"
          className="max-h-52 overflow-y-auto overscroll-contain px-3.5 py-3"
        >
          {isComplete ? (
            <dl className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-text-gray">
                  {`${formatCurrency(price.perNight)} × ${toFaNumber(nights)} شب`}
                </dt>
                <dd className="text-text font-bold tabular-nums">
                  {formatCurrency(price.gross)}
                </dd>
              </div>

              {price.discount > 0 && (
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-text-gray">
                    {`تخفیف (${toFaNumber(price.discountPercent)}٪)`}
                  </dt>
                  <dd className="text-secondary-500 font-bold tabular-nums">
                    {`− ${formatCurrency(price.discount)}`}
                  </dd>
                </div>
              )}

              <div className="border-foreground/10 flex items-center justify-between gap-3 border-t pt-2.5">
                <dt className="text-text font-bold">مبلغ قابل پرداخت</dt>
                <dd className="text-text text-sm font-extrabold tabular-nums">
                  {`${formatCurrency(price.total)} تومان`}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-text-gray text-xs leading-relaxed">
              برای دیدن جزییات حساب، تاریخ ورود و خروج را انتخاب کنید.
            </p>
          )}
        </div>
      </div>

      {showCta && (
        <div className="flex flex-col gap-2.5">
          <Button shape="xl" fullWidth disabled={!isComplete}>
            رزرو این اقامتگاه
            <MoveLeft className="size-5 transition-transform duration-300 group-hover:-translate-x-1" />
          </Button>
          <Button href={SUPPORT_PHONE_HREF} variant="outline" shape="xl">
            <Phone className="size-5" />
            مشاوره و تماس
          </Button>
          <p className="text-text-gray text-center text-[11px] leading-relaxed">
            {isComplete
              ? "رزرو نهایی در صفحه پرداخت انجام می‌شود"
              : "برای فعال‌شدن دکمه‌ی رزرو، تاریخ ورود و خروج را کامل کنید"}
          </p>
        </div>
      )}
    </div>
  );
}
