import {
  BedDouble,
  CalendarDays,
  CalendarX,
  Hash,
  Mail,
  Moon,
  Phone,
  Timer,
  UserRound,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

import CardDashContainer from "@/components/ui/CardDashContainer";
import {
  formatJalaliDate,
  formatJalaliDateTime,
  toFaNumber,
} from "@/features/guest/shared/lib/format";
import type { GuestBooking } from "../types/guest-booking.types";

type Props = {
  booking: GuestBooking;
  /** اطلاعات کاربر — از پروفایل؛ اگر در دسترس نبود از خود رزرو پر می‌شود. */
  user: { fullName: string; email: string; phoneNumber?: string };
};

/**
 * اطلاعات رزرو و کاربر — دو کارت خوانا برای صفحه‌ی پرداخت.
 *
 * ⚠️ همه‌ی تاریخ‌ها با توابع `lib/format` جلالی می‌شوند تا این صفحه هم مثل
 * کارت رزرو، یک زبان نمایش واحد داشته باشد.
 */
export default function BookingDetails({ booking, user }: Props): ReactNode {
  return (
    <>
      <CardDashContainer noTransition className="p-5 sm:p-6">
        <SectionHeading
          icon={<BedDouble className="size-4.5" />}
          title="اطلاعات رزرو"
        />

        <dl className="mt-4 space-y-3.5">
          <DetailRow
            icon={<Hash className="size-4" />}
            label="کد رزرو"
            value={toFaNumber(booking.id)}
          />
          <DetailRow
            icon={<BedDouble className="size-4" />}
            label="اقامتگاه"
            value={booking.cabin.name}
          />
          <DetailRow
            icon={<CalendarDays className="size-4" />}
            label="تاریخ ورود"
            value={formatJalaliDate(booking.startDate)}
          />
          <DetailRow
            icon={<CalendarX className="size-4" />}
            label="تاریخ خروج"
            value={formatJalaliDate(booking.endDate)}
          />
          <DetailRow
            icon={<Moon className="size-4" />}
            label="مدت اقامت"
            value={`${toFaNumber(booking.numNights)} شب`}
          />
          <DetailRow
            icon={<Users className="size-4" />}
            label="تعداد مهمان"
            value={`${toFaNumber(booking.numGuests)} نفر`}
          />
          <DetailRow
            icon={<Timer className="size-4" />}
            label="مهلت پرداخت"
            value={formatJalaliDateTime(booking.paymentDeadline)}
          />
        </dl>
      </CardDashContainer>

      <CardDashContainer noTransition className="p-5 sm:p-6">
        <SectionHeading
          icon={<UserRound className="size-4.5" />}
          title="اطلاعات کاربر"
        />

        <dl className="mt-4 space-y-3.5">
          <DetailRow
            icon={<UserRound className="size-4" />}
            label="نام و نام خانوادگی"
            value={user.fullName}
          />
          {/* ردیف‌های خالی رندر نمی‌شوند تا کارت ناقص به‌نظر نرسد. */}
          {user.email && (
            <DetailRow
              icon={<Mail className="size-4" />}
              label="ایمیل"
              value={user.email}
              dir="ltr"
            />
          )}
          {user.phoneNumber && (
            <DetailRow
              icon={<Phone className="size-4" />}
              label="شماره موبایل"
              value={user.phoneNumber}
              dir="ltr"
            />
          )}
        </dl>
      </CardDashContainer>
    </>
  );
}

function SectionHeading({
  icon,
  title,
}: {
  icon: ReactNode;
  title: string;
}): ReactNode {
  return (
    <header className="flex items-center gap-3">
      <span className="bg-primary-400/10 text-primary-500 grid size-9 shrink-0 place-items-center rounded-xl">
        {icon}
      </span>
      <h2 className="text-text text-base font-bold">{title}</h2>
    </header>
  );
}

function DetailRow({
  icon,
  label,
  value,
  dir,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}): ReactNode {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-text-gray flex shrink-0 items-center gap-2 text-xs">
        <span className="text-primary-400">{icon}</span>
        {label}
      </dt>
      <dd
        className="text-text min-w-0 truncate text-sm font-semibold"
        dir={dir}
      >
        {value}
      </dd>
    </div>
  );
}
