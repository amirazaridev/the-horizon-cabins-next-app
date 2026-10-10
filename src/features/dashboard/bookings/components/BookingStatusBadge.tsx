import type { ReactNode } from "react";

import { BOOKING_STATUS_META } from "@/features/guest/bookings/constants/booking-status";
import type { GuestBookingStatus } from "@/features/guest/bookings/types/guest-booking.types";

/**
 * چیپ وضعیت رزرو — رنگ/آیکون/برچسب از `BOOKING_STATUS_META` (تک‌منبع).
 */
export default function BookingStatusBadge({
  status,
}: {
  status: GuestBookingStatus;
}): ReactNode {
  const meta = BOOKING_STATUS_META[status];
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${meta.badgeClass}`}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      {meta.label}
    </span>
  );
}
