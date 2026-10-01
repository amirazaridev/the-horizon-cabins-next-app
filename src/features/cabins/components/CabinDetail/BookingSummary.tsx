"use client";

import { CalendarDays, Check, MoveLeft, Phone, Users } from "lucide-react";
import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import Counter from "@/components/ui/Counter";
import { formatJalaliDate } from "@/components/ui/RangeDatePicker";
import { SUPPORT_PHONE_HREF } from "@/constants/suport-phone";
import PriceDisplay from "@/features/cabins/components/PriceDisplay";
import { formatCurrency } from "@/libs/utils/format";
import { BOOKING_PERKS } from "../../constants";
import { toFaNumber } from "../../utils/booking";
import { useBooking } from "./BookingProvider";

type Props = {
  /** نمایش دکمه‌ی رزرو و مشاوره */
  showCta?: boolean;
  /**
   * کلیک روی فیلد تاریخ. پیش‌فرض: اسکرول به سکشن تقویم.
   * باتم‌شیت این را override می‌کند تا اول خودش بسته شود.
   */
  onRequestDates?: () => void;
  className?: string;
};

/**
 * محتوای مشترک رزرو — یک نسخه برای هر سه جا.
 *
 * aside چسبان دسکتاپ، باتم‌شیت موبایل و مودال خلاصه‌ی قیمت دقیقاً همین
 * کامپوننت را رندر می‌کنند؛ پس منطق قیمت و چیدمان در یک جا زندگی می‌کند و
 * هیچ‌وقت سه نسخه‌ی متفاوت از «مبلغ قابل پرداخت» به کاربر نشان داده نمی‌شود.
 */
export default function BookingSummary({
  showCta = false,
  onRequestDates,
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
    <div className={`flex flex-col gap-5 ${className}`}>
      <PriceDisplay
        price={price.regularPerNight}
        discount={price.regularPerNight - price.perNight}
        perNightText="قیمت هر شب اقامت"
      />

      {/* فیلدهای تاریخ — کلیک، کاربر را به تقویم می‌برد */}
      <div className="grid grid-cols-2 gap-3">
        {stages.map((stage) => (
          <button
            key={stage.key}
            type="button"
            onClick={handleDatesClick}
            className={`rounded-2xl border px-3.5 py-3 text-start transition-colors ${
              stage.active
                ? "border-primary-400/60 bg-primary-400/10"
                : "border-foreground/10 bg-background-2 hover:border-primary-400/40"
            }`}
          >
            <span className="text-text-gray flex items-center gap-1.5 text-xs font-medium">
              <CalendarDays className="size-3.5" />
              {stage.label}
            </span>
            <span
              className={`mt-1 block text-sm font-bold ${
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
        hint={`حداکثر ظرفیت این اقامتگاه ${toFaNumber(maxCapacity)} نفر است`}
        icon={<Users className="size-4" />}
      />

      {/* خلاصه‌ی قیمت — فقط بعد از کامل‌شدن بازه */}
      <div
        aria-live="polite"
        className="border-foreground/10 border-y py-5"
      >
        {isComplete ? (
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-text-gray">
                {`${formatCurrency(price.perNight)} تومان × ${toFaNumber(nights)} شب`}
              </dt>
              <dd className="text-text font-bold tabular-nums">
                {formatCurrency(price.total)}
              </dd>
            </div>

            {price.discount > 0 && (
              <div className="flex items-center justify-between gap-3">
                <dt className="text-text-gray">
                  تخفیف ({toFaNumber(price.discountPercent)}٪)
                </dt>
                <dd className="text-secondary-500 font-bold tabular-nums">
                  {`− ${formatCurrency(price.discount)}`}
                </dd>
              </div>
            )}

            <div className="border-foreground/10 flex items-center justify-between gap-3 border-t pt-3">
              <dt className="text-text font-bold">مبلغ قابل پرداخت</dt>
              <dd className="text-text text-base font-extrabold tabular-nums">
                {`${formatCurrency(price.total)} تومان`}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-text-gray text-center text-xs leading-relaxed">
            {range.from
              ? "حالا تاریخ خروج را انتخاب کنید تا مبلغ کل محاسبه شود."
              : "برای دیدن مبلغ کل، ابتدا تاریخ ورود و خروج را انتخاب کنید."}
          </p>
        )}

        <div className="border-foreground/10 mt-5 space-y-3 border-t pt-5 text-sm">
          {BOOKING_PERKS.map((perk) => (
            <p key={perk} className="text-text-gray flex items-center gap-3">
              <Check className="text-primary-400 size-4 shrink-0" />
              {perk}
            </p>
          ))}
        </div>
      </div>

      {showCta && (
        <div className="flex flex-col gap-3">
          <Button shape="xl" fullWidth disabled={!isComplete}>
            رزرو این اقامتگاه
            <MoveLeft className="size-5 transition-transform duration-300 group-hover:-translate-x-1" />
          </Button>
          <Button href={SUPPORT_PHONE_HREF} variant="outline" shape="xl">
            <Phone className="size-5" />
            مشاوره و تماس
          </Button>
          <p className="text-text-gray text-center text-xs">
            {isComplete
              ? "رزرو نهایی در صفحه پرداخت انجام می‌شود"
              : "برای فعال‌شدن دکمه‌ی رزرو، تاریخ ورود و خروج را کامل کنید"}
          </p>
        </div>
      )}
    </div>
  );
}
