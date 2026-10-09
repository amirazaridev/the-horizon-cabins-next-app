import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getCurrentUser } from "@/features/auth/services/session.service";
import PaymentGatewayForm from "@/features/guest/bookings/components/PaymentGatewayForm";
import { getGuestBookingsRepository } from "@/features/guest/bookings/services/guest-bookings.repository";
import {
  formatJalaliDate,
  formatJalaliDateTime,
} from "@/features/guest/shared/lib/format";

export const metadata: Metadata = { title: "درگاه پرداخت" };

type Props = { params: Promise<{ bookingId: string }> };

/**
 * درگاه پرداخت **نمونه** (فقط طرح و ظاهر).
 *
 * ⚠️ چرا یک روت مستقل و بیرون از گروه‌های `(guest)`/`(main)`؟ چون در واقعیت
 * کاربر از سایت پذیرنده به **دامنه‌ی بانک** منتقل می‌شود. این روت فقط لِی‌اوت
 * ریشه را می‌گیرد، پس نوبار سایت و پوسته‌ی داشبورد را ندارد و همان حس
 * «بیرون از سایت» را می‌دهد.
 *
 * ⚠️ هیچ داده‌ی کارتی به بک‌اند نمی‌رود؛ فقط `POST /bookings/:id/pay` صدا زده
 * می‌شود (بک‌اند درگاه را شبیه‌سازی می‌کند) و رزرو `confirmed` می‌شود.
 */
export default async function PaymentGatewayPage({
  params,
}: Props): Promise<ReactNode> {
  const { bookingId } = await params;
  const id = Number(bookingId);
  if (!Number.isInteger(id)) notFound();

  // پرداخت نیاز به نشست دارد (اندپوینت بک‌اند محافظت‌شده است).
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?from=${encodeURIComponent(`/payment/gateway/${id}`)}`);
  }

  const booking = await getGuestBookingsRepository().getById(id);
  if (!booking) notFound();

  // فقط رزرو «در انتظار پرداخت» معنا دارد؛ بقیه به لیست رزروها برمی‌گردند.
  if (booking.status !== "pending") redirect("/account/bookings");

  return (
    <PaymentGatewayForm
      bookingId={booking.id}
      merchantName={booking.cabin.name}
      amount={booking.totalPrice}
      orderDateLabel={formatJalaliDate(booking.createdAt)}
      deadlineLabel={formatJalaliDateTime(booking.paymentDeadline)}
    />
  );
}
