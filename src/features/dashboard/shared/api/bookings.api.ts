import "server-only";

import { authFetch } from "@/libs/api/authFetch";

/** وضعیت‌هایی که ادمین/مالک می‌تواند به آن‌ها گذار کند. */
export type BookingStatusTransition = "checkedIn" | "checkedOut" | "cancelled";

/** نتیجه‌ی خام ترنسپورت — پیش از تفسیرِ هر مصرف‌کننده. */
export type BookingStatusTransitionResult =
  | { ok: true; data: unknown }
  | { ok: false; status: number };

export async function requestBookingStatusTransition(
  bookingId: number,
  status: BookingStatusTransition,
): Promise<BookingStatusTransitionResult> {
  const res = await authFetch(`bookings/${bookingId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    cache: "no-store",
  });

  if (!res.ok) return { ok: false, status: res.status };

  const data = (await res.json().catch(() => null)) as unknown;
  return { ok: true, data };
}
