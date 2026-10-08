import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getGuestAccountProfile } from "@/features/guest/account/services/account.service";
import BookingBill from "@/features/guest/bookings/components/BookingBill";
import BookingDetails from "@/features/guest/bookings/components/BookingDetails";
import PaymentDeadlineNotice from "@/features/guest/bookings/components/PaymentDeadlineNotice";
import PaymentSummary from "@/features/guest/bookings/components/PaymentSummary";
import { getGuestBookingsRepository } from "@/features/guest/bookings/services/guest-bookings.repository";
import GuestPageHeader from "@/features/guest/shared/components/GuestPageHeader";

export const metadata: Metadata = { title: "پرداخت رزرو" };

type Props = { params: Promise<{ bookingId: string }> };

/**
 * صفحه‌ی پرداخت نهایی یک رزرو — Server Component.
 *
 * چیدمان (طبق اصول checkout): هشدار مهلت در بالای صفحه تا اولین چیزی باشد
 * که دیده می‌شود، سپس جزئیات در ستون اصلی و کنش‌ها (مبلغ، پرداخت، لغو) در
 * ستون کنارِ چسبان.
 *
 * ⚠️ این صفحه فقط برای رزرو «در انتظار پرداخت» معنا دارد؛ بقیه به لیست
 * رزروها برگردانده می‌شوند تا کاربر در صفحه‌ی بی‌ربط سرگردان نشود.
 */
export default async function BookingPaymentPage({
  params,
}: Props): Promise<ReactNode> {
  const { bookingId } = await params;
  const id = Number(bookingId);
  if (!Number.isInteger(id)) notFound();

  const booking = await getGuestBookingsRepository().getById(id);
  if (!booking) notFound();

  if (booking.status !== "pending") redirect("/account/bookings");

  // اطلاعات کاربر از پروفایل واقعی می‌آید؛ اگر در دسترس نبود، نام ثبت‌شده
  // روی خود رزرو نمایش داده می‌شود (صفحه نباید به‌خاطر این ناقص بماند).
  const profile = await getGuestAccountProfile();

  const user = {
    fullName: profile?.fullName || booking.guest.fullName,
    email: profile?.email ?? "",
    phoneNumber: profile?.phoneNumber || undefined,
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <Link
        href="/account/bookings"
        className="text-text-gray hover:text-primary-400 inline-flex w-fit items-center gap-1.5 text-xs font-medium transition-colors"
      >
        <ArrowRight className="size-3.5" />
        بازگشت به رزروهای من
      </Link>

      <GuestPageHeader
        title="پرداخت رزرو"
        description="صورت‌حساب و اطلاعات رزرو را بررسی کنید و پرداخت را نهایی کنید."
      />

      <PaymentDeadlineNotice
        deadline={booking.paymentDeadline}
        variant="page"
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="flex flex-col gap-5 lg:col-span-3">
          <BookingBill booking={booking} />
          <BookingDetails booking={booking} user={user} />
        </div>

        <aside className="lg:col-span-2">
          <div className="lg:sticky lg:top-24">
            <PaymentSummary booking={booking} />
          </div>
        </aside>
      </div>
    </div>
  );
}
