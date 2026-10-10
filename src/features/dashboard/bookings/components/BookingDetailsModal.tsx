"use client";

import type { ReactNode } from "react";
import { BedDouble, CalendarClock, User, Users } from "lucide-react";

import Modal from "@/components/ui/Modal";
import { formatCurrency } from "@/libs/utils/format";
import { formatJalaliFull, formatJalaliTime } from "@/libs/utils/jalali";
import { CANCELLATION_REASON_LABELS } from "@/features/guest/bookings/constants/booking-status";
import type { GuestBooking } from "@/features/guest/bookings/types/guest-booking.types";
import BookingStatusBadge from "./BookingStatusBadge";

interface BookingDetailsModalProps {
  booking: GuestBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

/** مودال «جزییات رزرو» — خلاصه‌ی کامل یک رزرو بدون ترک صفحه. */
export default function BookingDetailsModal({
  booking,
  isOpen,
  onClose,
}: BookingDetailsModalProps): ReactNode {
  if (!booking) return null;

  const nights = booking.nights ?? [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="جزییات رزرو"
      description={`کد رزرو: ${booking.id}`}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <BookingStatusBadge status={booking.status} />
          <span className="text-text text-lg font-extrabold tabular-nums">
            {formatCurrency(booking.totalPrice)} تومان
          </span>
        </div>

        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailRow icon={<User className="size-4" />} label="مهمان">
            {booking.guest?.fullName ?? "—"}
          </DetailRow>
          <DetailRow icon={<BedDouble className="size-4" />} label="اقامتگاه">
            {booking.cabin?.name ?? "—"}
          </DetailRow>
          <DetailRow icon={<CalendarClock className="size-4" />} label="ورود">
            {formatJalaliFull(booking.startDate)}
          </DetailRow>
          <DetailRow icon={<CalendarClock className="size-4" />} label="خروج">
            {formatJalaliFull(booking.endDate)}
          </DetailRow>
          <DetailRow label="تعداد شب">{booking.numNights.toLocaleString("fa-IR")} شب</DetailRow>
          <DetailRow icon={<Users className="size-4" />} label="تعداد مهمان">
            {booking.numGuests.toLocaleString("fa-IR")} نفر
          </DetailRow>
          <DetailRow label="تاریخ ثبت">{formatJalaliFull(booking.createdAt)}</DetailRow>
          <DetailRow label="ساعت ثبت">{formatJalaliTime(booking.createdAt)}</DetailRow>
        </dl>

        {(booking.paymentDeadline || booking.paidAt) && (
          <section className="border-border bg-background rounded-2xl border p-4">
            <h3 className="text-text mb-3 text-sm font-bold">پرداخت</h3>
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {booking.paymentDeadline && (
                <DetailRow label="مهلت پرداخت">
                  {formatJalaliFull(booking.paymentDeadline)} — {formatJalaliTime(booking.paymentDeadline)}
                </DetailRow>
              )}
              {booking.paidAt && (
                <DetailRow label="زمان پرداخت">{formatJalaliFull(booking.paidAt)}</DetailRow>
              )}
              {booking.paymentReference && (
                <DetailRow label="کد پیگیری">{booking.paymentReference}</DetailRow>
              )}
            </dl>
          </section>
        )}

        {booking.status === "cancelled" && (
          <section className="border-danger/30 bg-danger/5 rounded-2xl border p-4">
            <h3 className="text-danger mb-3 text-sm font-bold">لغو رزرو</h3>
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {booking.cancelledAt && (
                <DetailRow label="زمان لغو">{formatJalaliFull(booking.cancelledAt)}</DetailRow>
              )}
              {booking.cancellationReason && (
                <DetailRow label="دلیل لغو">
                  {CANCELLATION_REASON_LABELS[booking.cancellationReason]}
                </DetailRow>
              )}
            </dl>
          </section>
        )}

        {nights.length > 0 && (
          <section>
            <h3 className="text-text mb-3 text-sm font-bold">
              نرخ هر شب ({nights.length.toLocaleString("fa-IR")} شب)
            </h3>
            <div className="border-border overflow-hidden rounded-2xl border">
              <table className="w-full text-sm">
                <thead className="bg-background-2">
                  <tr className="text-text-gray text-xs">
                    <th scope="col" className="px-3 py-2 text-start font-semibold">
                      تاریخ
                    </th>
                    <th scope="col" className="px-3 py-2 text-end font-semibold">
                      تخفیف
                    </th>
                    <th scope="col" className="px-3 py-2 text-end font-semibold">
                      افزایش
                    </th>
                    <th scope="col" className="px-3 py-2 text-end font-semibold">
                      نرخ نهایی
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {nights.map((night) => (
                    <tr key={night.date} className="border-border/60 border-t">
                      <td className="text-text px-3 py-2">{formatJalaliFull(night.date)}</td>
                      <td className="text-text-gray px-3 py-2 text-end tabular-nums">
                        {night.discountPercent > 0 ? `${night.discountPercent.toLocaleString("fa-IR")}٪` : "—"}
                      </td>
                      <td className="text-text-gray px-3 py-2 text-end tabular-nums">
                        {night.surchargePercent > 0 ? `${night.surchargePercent.toLocaleString("fa-IR")}٪` : "—"}
                      </td>
                      <td className="text-text px-3 py-2 text-end font-semibold tabular-nums">
                        {formatCurrency(night.finalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {booking.observations && (
          <section className="border-border bg-background rounded-2xl border p-4">
            <h3 className="text-text mb-2 text-sm font-bold">توضیحات مهمان</h3>
            <p className="text-text-gray text-sm leading-relaxed whitespace-pre-wrap">
              {booking.observations}
            </p>
          </section>
        )}
      </div>
    </Modal>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon?: ReactNode;
  label: string;
  children: ReactNode;
}): ReactNode {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-text-gray flex items-center gap-1.5 text-xs">
        {icon}
        {label}
      </dt>
      <dd className="text-text truncate text-sm font-semibold">{children}</dd>
    </div>
  );
}
