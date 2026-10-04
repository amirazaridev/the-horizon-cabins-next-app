import { Ban, CalendarDays, Clock, Moon, Users } from "lucide-react";
import type { ReactNode } from "react";

import Button from "@/components/ui/Button";
import {
  BOOKING_STATUS_META,
  CANCELLATION_REASON_LABELS,
} from "../constants/booking-status";
import {
  formatJalaliDate,
  formatJalaliDateTime,
  formatStayRange,
  formatToman,
  toFaNumber,
} from "@/features/guest/shared/lib/format";
import type { GuestBooking } from "../types/guest-booking.types";

type Props = { booking: GuestBooking };

/**
 * کارت یک رزرو — کامپوننت **نمایشی** و بدون state/fetch.
 *
 * همه‌ی متن‌ها از توابع قالب‌بندی می‌آیند و رنگ/برچسب وضعیت از
 * `BOOKING_STATUS_META` تا هیچ‌جا متن یا رنگ هاردکد نشود.
 */
export default function BookingCard({ booking }: Props): ReactNode {
  const meta = BOOKING_STATUS_META[booking.status];
  const StatusIcon = meta.icon;

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

        <BookingNotice booking={booking} />

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
      </div>
    </article>
  );
}

function InfoCell({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}): ReactNode {
  return (
    <div className="border-foreground/10 bg-foreground/5 flex items-center gap-3 rounded-2xl border px-3.5 py-3">
      <span className="text-primary-400 shrink-0">{icon}</span>
      <span className="min-w-0">
        <span className="text-text-gray block text-[11px]">{label}</span>
        <span className="text-text mt-0.5 block truncate text-sm font-semibold">
          {value}
        </span>
      </span>
    </div>
  );
}

/** یادداشت زمینه‌ای مخصوص هر وضعیت — برای بقیه‌ی وضعیت‌ها چیزی رندر نمی‌شود. */
function BookingNotice({ booking }: { booking: GuestBooking }): ReactNode {
  if (booking.status === "pending") {
    return (
      <div className="border-primary-400/30 bg-primary-400/10 text-primary-600 dark:text-primary-300 flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-xs leading-relaxed">
        <Clock className="mt-px size-4 shrink-0" />
        <span>
          برای نهایی‌شدن رزرو، پرداخت را کامل کنید. مهلت پرداخت:{" "}
          {formatJalaliDateTime(booking.paymentDeadline)}
        </span>
      </div>
    );
  }

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
