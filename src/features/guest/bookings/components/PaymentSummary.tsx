import { CreditCard, Info, ShieldCheck, TimerReset } from "lucide-react";
import type { ReactNode } from "react";

import Button from "@/components/ui/Button";
import CardDashContainer from "@/components/ui/CardDashContainer";
import { formatToman } from "@/features/guest/shared/lib/format";
import type { GuestBooking } from "../types/guest-booking.types";
import CancelBookingButton from "./CancelBookingButton";

type Props = { booking: GuestBooking };

/**
 * ستون کنش‌های صفحه‌ی پرداخت — مبلغ نهایی، دکمه‌ی پرداخت و لغو رزرو.
 *
 * ⚠️ **دکمه‌ی پرداخت عمداً غیرفعال است**: درگاه پرداخت هنوز در دسترس نیست.
 * به‌جای رهاکردن کاربر با یک دکمه‌ی بی‌واکنش، زیر آن صریح توضیح داده شده
 * که این قابلیت به‌زودی فعال می‌شود.
 *
 * TODO(backend): اندپوینت پرداخت از قبل در بک‌اند هست — `POST /bookings/:id/pay`
 * — ولی درگاه را شبیه‌سازی می‌کند (`simulatePaymentGateway` فقط یک UUID
 * می‌سازد). با آماده‌شدن درگاه واقعی: Server Action → دریافت لینک پرداخت →
 * `redirect` مرورگر به صفحه‌ی بانک؛ همین دکمه فعال می‌شود.
 */
export default function PaymentSummary({ booking }: Props): ReactNode {
  return (
    <CardDashContainer noTransition className="flex flex-col gap-5 p-5 sm:p-6">
      <div>
        <p className="text-text-gray text-xs">مبلغ قابل پرداخت</p>
        <p className="text-text mt-1.5 text-2xl font-extrabold tabular-nums">
          {formatToman(booking.totalPrice)}
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <Button
          type="button"
          shape="xl"
          fullWidth
          disabled
          title="درگاه پرداخت هنوز فعال نشده است"
        >
          <CreditCard className="size-4" />
          پرداخت و انتقال به درگاه
        </Button>

        <p className="text-text-gray flex items-start gap-2 text-[11px] leading-relaxed">
          <Info className="mt-px size-3.5 shrink-0" />
          <span>
            درگاه پرداخت هنوز در دسترس نیست؛ به‌محض فعال‌شدن، با زدن این دکمه
            به صفحه‌ی امن بانک منتقل می‌شوید.
          </span>
        </p>
      </div>

      {/* لغو رزرو — کنش مخرب، جدا از کنش اصلی و با تأییدیه. */}
      <CancelBookingButton
        bookingId={booking.id}
        redirectTo="/account/bookings"
        fullWidth
      />

      <ul className="border-border text-text-gray space-y-2.5 border-t pt-4 text-xs">
        <li className="flex items-start gap-2">
          <ShieldCheck className="text-secondary-500 mt-px size-3.5 shrink-0" />
          پرداخت از طریق درگاه امن بانکی انجام می‌شود.
        </li>
        <li className="flex items-start gap-2">
          <TimerReset className="text-secondary-500 mt-px size-3.5 shrink-0" />
          در صورت لغو خودکار رزرو، مبلغی از شما کسر نمی‌شود.
        </li>
      </ul>
    </CardDashContainer>
  );
}
