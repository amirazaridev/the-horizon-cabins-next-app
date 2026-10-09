import { CalendarClock } from "lucide-react";

import CardDashContainer from "@/components/ui/CardDashContainer";
import { formatJalaliFull } from "../../lib/date-range";
import { formatCount, formatCountWithUnit } from "../../lib/metrics/format";
import { WidgetEmpty } from "../WidgetStates";
import {
  BOOKING_STATUS_LABELS,
  type DashboardBooking,
} from "../../types/dashboard.types";

interface ForwardBookingsProps {
  /** رزروهای پیش‌رو — از repository، مستقل از فیلتر بازه */
  forwardBookings: DashboardBooking[];
  /** «امروز» — مرجع محاسبه */
  today: Date;
}

const MAX_VISIBLE = 5;

/**
 * ویجت «رزروهای پیش‌رو».
 *
 * ⭐ **مستقل از بازهٔ انتخابی.** این ویجت همیشه از «امروز» تا افق پیش‌رو
 * (۹۰ روز) را نشان می‌دهد، حتی اگر کاربر بازه‌ی گذشه را فیلتر کرده باشد —
 * چون هدف آن «نبض فروش پیش‌رو» است، نه تحلیل بازه. برچسبِ بالای کارت این
 * موضوع را برای کاربر روشن می‌کند.
 */
export default function ForwardBookings({
  forwardBookings,
  today,
}: ForwardBookingsProps) {
  const total = forwardBookings.length;
  const upcomingNights = forwardBookings.reduce(
    (sum, booking) => sum + booking.numNights,
    0,
  );
  const visible = forwardBookings.slice(0, MAX_VISIBLE);

  return (
    <CardDashContainer className="flex w-full flex-col gap-5 overflow-x-hidden p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-text text-lg font-semibold">رزروهای پیش‌رو</h3>
          <p className="text-text-gray text-sm">
            از {formatJalaliFull(today)} به بعد
          </p>
        </div>

        <span className="border-primary-400/40 bg-primary-400/10 text-primary-500 inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
          <CalendarClock className="size-3.5" />
          مستقل از بازهٔ انتخابی
        </span>
      </div>

      {total > 0 && (
        <dl className="grid grid-cols-2 gap-3">
          <div className="border-border bg-background rounded-xl border px-3 py-2.5">
            <dt className="text-text-gray text-xs">تعداد رزرو پیش‌رو</dt>
            <dd className="text-text mt-0.5 text-lg font-bold tabular-nums">
              {formatCount(total)}
            </dd>
          </div>
          <div className="border-border bg-background rounded-xl border px-3 py-2.5">
            <dt className="text-text-gray text-xs">مجموع شب‌های رزروشده</dt>
            <dd className="text-text mt-0.5 text-lg font-bold tabular-nums">
              {formatCount(upcomingNights)}
            </dd>
          </div>
        </dl>
      )}

      {visible.length > 0 ? (
        <ul className="flex flex-col gap-3 overflow-y-auto">
          {visible.map((booking) => (
            <li
              key={booking.id}
              className="border-border bg-background flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3"
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-text truncate text-sm font-semibold">
                  {booking.guest?.fullName ?? "مهمان"}
                </span>
                <span className="text-text-gray truncate text-xs">
                  {booking.cabin?.name ?? "اقامتگاه"}
                </span>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-0.5">
                <span className="text-text text-xs font-semibold">
                  {formatJalaliFull(booking.startDate)}
                </span>
                <span className="text-text-gray text-xs">
                  {formatCountWithUnit(booking.numNights, "night")} ·{" "}
                  {BOOKING_STATUS_LABELS[booking.status]}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <WidgetEmpty
          label="رزرو پیش‌رویی ثبت نشده است"
          description="از امروز تا ۹۰ روز بعد رزروی وجود ندارد."
          icon={<CalendarClock className="size-5" strokeWidth={1.6} />}
        />
      )}

      {total > MAX_VISIBLE && (
        <p className="text-text-gray text-center text-xs">
          و {formatCount(Math.max(total - MAX_VISIBLE, 0))} رزرو دیگر…
        </p>
      )}
    </CardDashContainer>
  );
}
