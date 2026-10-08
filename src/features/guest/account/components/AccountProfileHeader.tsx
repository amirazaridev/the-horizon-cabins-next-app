import type { ReactNode } from "react";

import CardDashContainer from "@/components/ui/CardDashContainer";
import { toFaNumber } from "@/features/guest/shared/lib/format";
import type { GuestAccountProfile } from "../types/guest-account.types";

type Props = { profile: GuestAccountProfile };

/**
 * فیلدهایی که «تکمیل پروفایل» را می‌سازند.
 *
 * ⚠️ عمداً همان فیلدهای قابل‌ویرایشِ فرم است؛ ایمیل حساب چون همیشه پر است
 * در محاسبه نمی‌آید تا درصد گمراه‌کننده نشود.
 */
function profileCompleteness(profile: GuestAccountProfile): number {
  const fields = [
    profile.fullName,
    profile.gender,
    profile.phoneNumber,
    profile.nationalId,
    profile.dateOfBirth,
  ];
  const filled = fields.filter((value) => value.trim() !== "").length;
  return Math.round((filled / fields.length) * 100);
}

/**
 * سرصفحه‌ی پروفایل — کامپوننت نمایشی.
 *
 * این صفحه فقط برای نقش `guest` است (لایه‌ی گارد)، پس برچسب نقش ثابت
 * «مهمان» است. نوار «تکمیل پروفایل» بازخورد سریع می‌دهد که چه مقدار از
 * مشخصات ثبت شده و کاربر را به تکمیل فرم ترغیب می‌کند.
 */
export default function AccountProfileHeader({ profile }: Props): ReactNode {
  const initial =
    (profile.fullName.trim() || profile.email).charAt(0).toUpperCase() || "؟";
  const percent = profileCompleteness(profile);

  return (
    /* همان کارت مشترک پنل (`CardDashContainer`) تا ظاهر ناحیه‌ی مهمان با
       داشبورد مدیریت یکدست بماند. */
    <CardDashContainer
      noTransition
      className="relative overflow-hidden p-5 sm:p-6"
    >
      <div
        className="bg-primary-400/10 pointer-events-none absolute -top-20 -left-12 size-48 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-wrap items-center gap-4">
        <span className="from-primary-400 to-primary-600 ring-primary-400/15 grid size-16 shrink-0 place-items-center rounded-2xl bg-linear-to-br text-2xl font-bold text-white ring-4">
          {initial}
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-text truncate text-lg font-bold">
            {profile.fullName || "کاربر مهمان"}
          </h2>
          <p className="text-text-gray mt-1 truncate text-sm" dir="ltr">
            {profile.email}
          </p>
        </div>

        <span className="border-primary-400/40 bg-primary-400/15 text-primary-600 dark:text-primary-300 shrink-0 rounded-full border px-3 py-1 text-xs font-semibold">
          مهمان
        </span>
      </div>

      {/* نوار تکمیل پروفایل */}
      <div className="border-border/70 relative mt-5 border-t pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-text-gray text-xs">تکمیل پروفایل</span>
          <span className="text-text text-xs font-bold">
            {toFaNumber(percent)}٪
          </span>
        </div>

        <div
          className="bg-foreground/10 mt-2 h-1.5 w-full overflow-hidden rounded-full"
          role="progressbar"
          aria-label="تکمیل پروفایل"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="from-primary-400 to-primary-600 h-full rounded-full bg-linear-to-r transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </CardDashContainer>
  );
}
