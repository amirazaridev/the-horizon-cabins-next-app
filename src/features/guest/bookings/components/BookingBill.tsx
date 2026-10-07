import { Receipt } from "lucide-react";
import type { ReactNode } from "react";

import CardDashContainer from "@/components/ui/CardDashContainer";
import {
  formatJalaliDayMonth,
  formatToman,
  toFaNumber,
} from "@/features/guest/shared/lib/format";
import type {
  GuestBooking,
  GuestBookingNight,
} from "../types/guest-booking.types";

type Props = { booking: GuestBooking };

/**
 * صورت‌حساب رزرو — اقلام، جمع اقامت و مبلغ کل.
 *
 * ⚠️ اقلام از `booking.nights[]` ساخته می‌شوند (همان `BookingNight` بک‌اند)،
 * چون موتور قیمت‌گذاری برای هر شب می‌تواند افزایش آخر هفته یا تخفیف اقامت
 * بلند اعمال کند. `cabinPrice` **جمع کل اقامت** است، نه نرخ شب.
 *
 * ⚠️ وقتی نرخ همه‌ی شب‌ها یکسان است، فهرست شب‌به‌شب نمایش داده نمی‌شود
 * (تکرار بی‌فایده) و به‌جایش یک ردیف خلاصه با «N شب × نرخ» می‌آید.
 *
 * TODO(backend): با اضافه‌شدن کارمزد خدمات/مالیات به پاسخ، هر کدام یک
 * `<BillRow>` جدید در همین لیست می‌شوند.
 */
export default function BookingBill({ booking }: Props): ReactNode {
  const { cabin, cabinPrice, numNights, totalPrice } = booking;
  const nights = booking.nights ?? [];

  const pricesVary = new Set(nights.map((night) => night.finalPrice)).size > 1;
  const adjustment = totalPrice - cabinPrice;

  return (
    <CardDashContainer noTransition className="p-5 sm:p-6">
      <header className="flex items-center gap-3">
        <span className="bg-primary-400/10 text-primary-500 grid size-9 shrink-0 place-items-center rounded-xl">
          <Receipt className="size-4.5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-text text-base font-bold">صورت‌حساب</h2>
          <p className="text-text-gray mt-0.5 text-xs">
            جزئیات هزینه‌های این رزرو
          </p>
        </div>
      </header>

      <ul className="border-border divide-border mt-5 divide-y border-y">
        {pricesVary ? (
          nights.map((night, index) => (
            <NightRow key={night.date} night={night} index={index} />
          ))
        ) : (
          <BillRow
            title={`اقامت در ${cabin.name}`}
            hint={
              nights.length > 0
                ? `${toFaNumber(numNights)} شب × ${formatToman(nights[0].finalPrice)}`
                : `${toFaNumber(numNights)} شب`
            }
            value={formatToman(cabinPrice)}
          />
        )}

        {adjustment !== 0 && (
          <BillRow
            title={adjustment < 0 ? "تخفیف" : "هزینه‌ی خدمات"}
            hint="اعمال‌شده روی این رزرو"
            value={formatToman(adjustment)}
          />
        )}
      </ul>

      {/* جمع اقامت — فقط وقتی اقلام شب‌به‌شب تفکیک شده‌اند تا تکراری نشود. */}
      {pricesVary && (
        <div className="mt-4 flex items-center justify-between gap-3 text-sm">
          <span className="text-text-gray">
            جمع اقامت ({toFaNumber(numNights)} شب)
          </span>
          <span className="text-text font-semibold tabular-nums">
            {formatToman(cabinPrice)}
          </span>
        </div>
      )}

      <div
        className={`flex items-center justify-between gap-3 ${
          pricesVary ? "border-border mt-3 border-t pt-3" : "mt-4"
        }`}
      >
        <span className="text-text text-sm font-semibold">
          مبلغ کل قابل پرداخت
        </span>
        <span className="text-primary-500 text-lg font-extrabold tabular-nums">
          {formatToman(totalPrice)}
        </span>
      </div>
    </CardDashContainer>
  );
}

/** ردیف یک شب — تاریخ، برچسب تخفیف/افزایش و قیمت نهایی آن شب. */
function NightRow({
  night,
  index,
}: {
  night: GuestBookingNight;
  index: number;
}): ReactNode {
  const deltaPercent = Math.round(
    ((night.finalPrice - night.basePrice) / night.basePrice) * 100,
  );

  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-text-gray text-[11px] tabular-nums">
          شب {toFaNumber(index + 1)}
        </span>
        <span className="text-text text-sm font-medium">
          {formatJalaliDayMonth(night.date)}
        </span>
        {deltaPercent !== 0 && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              deltaPercent > 0
                ? "bg-primary-400/15 text-primary-600 dark:text-primary-300"
                : "bg-secondary-400/15 text-secondary-600 dark:text-secondary-300"
            }`}
          >
            {deltaPercent > 0 ? "افزایش" : "تخفیف"}{" "}
            {toFaNumber(Math.abs(deltaPercent))}٪
          </span>
        )}
      </span>
      <span className="text-text shrink-0 text-sm font-semibold tabular-nums">
        {formatToman(night.finalPrice)}
      </span>
    </li>
  );
}

function BillRow({
  title,
  hint,
  value,
}: {
  title: string;
  hint: string;
  value: string;
}): ReactNode {
  return (
    <li className="flex items-start justify-between gap-3 py-3.5">
      <span className="min-w-0">
        <span className="text-text block text-sm font-medium">{title}</span>
        <span className="text-text-gray mt-0.5 block text-xs">{hint}</span>
      </span>
      <span className="text-text shrink-0 text-sm font-semibold tabular-nums">
        {value}
      </span>
    </li>
  );
}
