import {
  ArrowLeft,
  Ban,
  CalendarDays,
  CreditCard,
  Moon,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import Button from "@/components/ui/Button";
import {
  BOOKING_STATUS_META,
  CANCELLATION_REASON_LABELS,
} from "../constants/booking-status";
import {
  formatJalaliDate,
  formatStayRange,
  formatToman,
  toFaNumber,
} from "@/features/guest/shared/lib/format";
import type { GuestBooking } from "../types/guest-booking.types";
import CancelBookingButton from "./CancelBookingButton";
import InfoCell from "./InfoCell";
import PaymentDeadlineNotice from "./PaymentDeadlineNotice";

type Props = { booking: GuestBooking };

/** مسیر صفحه‌ی پرداخت نهایی — تنها جای ساخت این آدرس. */
function paymentHref(bookingId: number): string {
  return `/account/bookings/${bookingId}/pay`;
}

/**
 * کارت یک رزرو — کامپوننت **نمایشی** و بدون state/fetch.
 *
 * همه‌ی متن‌ها از توابع قالب‌بندی می‌آیند و رنگ/برچسب وضعیت از
 * `BOOKING_STATUS_META` تا هیچ‌جا متن یا رنگ هاردکد نشود.
 *
 * ⚠️ رزرو «در انتظار پرداخت» یک مسیر کنشی جدا دارد: هشدار مهلت + دو کنش
 * «پرداخت» (اصلی) و «لغو رزرو» (مخرب). «مشاهده اقامتگاه» هم عمداً از یک
 * دکمه‌ی هم‌وزن به یک لینک کم‌رنگ تنزل کرده تا با کنش اصلی رقابت نکند.
 */
export default function BookingCard({ booking }: Props): ReactNode {
  const meta = BOOKING_STATUS_META[booking.status];
  const StatusIcon = meta.icon;
  const isPending = booking.status === "pending";

  return (
    <article className="border-foreground/10 bg-surface/70 hover:border-primary-400/30 relative overflow-hidden rounded-3xl border shadow-sm backdrop-blur-sm transition-colors">
      {/* نوار رنگی وضعیت در لبه‌ی شروع (راست در RTL) */}
      <span
        className={`absolute inset-y-0 right-0 w-1 ${meta.dotClass}`}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className={`grid size-11 shrink-0 place-items-center rounded-2xl border ${meta.badgeClass}`}
            >
              <StatusIcon className="size-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-text truncate text-base font-bold">
                {booking.cabin.name}
              </h3>
              <p className="text-text-gray mt-1 text-xs">
                کد رزرو: {toFaNumber(booking.id)}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${meta.badgeClass}`}
          >
            <StatusIcon className="size-3.5" />
            {meta.label}
          </span>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <InfoCell
            icon={<CalendarDays className="size-4" />}
            label="بازه اقامت"
            value={formatStayRange(booking.startDate, booking.endDate)}
          />
          <InfoCell
            icon={<Moon className="size-4" />}
            label="مدت اقامت"
            value={`${toFaNumber(booking.numNights)} شب`}
          />
          <InfoCell
            icon={<Users className="size-4" />}
            label="تعداد مهمان"
            value={`${toFaNumber(booking.numGuests)} نفر`}
          />
        </div>

        {/* هشدار مهلت پرداخت + شمارش معکوس (جای یادداشت متنی قبلی) */}
        {isPending && (
          <PaymentDeadlineNotice deadline={booking.paymentDeadline} />
        )}

        <BookingNotice booking={booking} />

        {isPending ? (
          <PendingFooter booking={booking} />
        ) : (
          <footer className="border-foreground/10 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <div>
              <p className="text-text-gray text-xs">مبلغ کل</p>
              <p className="text-text mt-0.5 text-lg font-extrabold">
                {formatToman(booking.totalPrice)}
              </p>
            </div>
            <Button
              href={`/cabins/${booking.cabin.id}`}
              variant="outline"
              size="md"
              shape="xl"
            >
              مشاهده اقامتگاه
            </Button>
          </footer>
        )}
      </div>
    </article>
  );
}

/**
 * پاورقی کارت رزرو «در انتظار پرداخت».
 *
 * چیدمان: مبلغ + لینک کم‌رنگ «مشاهده اقامتگاه» در یک ردیف، و کنش‌ها در
 * ردیف پایین. در RTL کنش اصلی («پرداخت») سمت راست می‌نشیند و «لغو» کنارش
 * می‌آید؛ در موبایل تمام‌عرض و روی هم می‌آیند تا هدف لمسی بزرگ بماند.
 */
function PendingFooter({ booking }: { booking: GuestBooking }): ReactNode {
  return (
    <footer className="border-foreground/10 flex flex-col gap-4 border-t pt-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-text-gray text-xs">مبلغ قابل پرداخت</p>
          <p className="text-text mt-0.5 text-lg font-extrabold">
            {formatToman(booking.totalPrice)}
          </p>
        </div>

        <Link
          href={`/cabins/${booking.cabin.id}`}
          className="text-text-gray hover:text-primary-400 inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
        >
          مشاهده اقامتگاه
          <ArrowLeft className="size-3.5" />
        </Link>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          href={paymentHref(booking.id)}
          size="md"
          shape="xl"
          className="sm:flex-1"
        >
          <CreditCard className="size-4" />
          پرداخت
        </Button>

        <CancelBookingButton bookingId={booking.id} className="sm:w-40" />
      </div>
    </footer>
  );
}

/** یادداشت زمینه‌ای مخصوص هر وضعیت — برای بقیه‌ی وضعیت‌ها چیزی رندر نمی‌شود. */
function BookingNotice({ booking }: { booking: GuestBooking }): ReactNode {
  if (booking.status === "cancelled") {
    const reason = booking.cancellationReason
      ? CANCELLATION_REASON_LABELS[booking.cancellationReason]
      : "این رزرو لغو شده است";

    return (
      <div className="border-danger/25 bg-danger/10 text-danger-strong dark:text-red-300 flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-xs leading-relaxed">
        <Ban className="mt-px size-4 shrink-0" />
        <span>
          {reason}
          {booking.cancelledAt && ` — ${formatJalaliDate(booking.cancelledAt)}`}
        </span>
      </div>
    );
  }

  return null;
}
