import type { ReactNode } from "react";

type Props = {
  /** ایمیل حساب — از نشست سروری. */
  email: string;
};

/**
 * بلوک «اطلاعات اکانت» سایدبار مهمان — نمایشی و بدون state.
 *
 * ⚠️ از صفحه‌ی تنظیمات (`AccountProfileHeader`) جدا است: آن یکی سرصفحه‌ی
 * صفحه با نام کامل است، این یکی خلاصه‌ی همیشه‌حاضر سایدبار.
 */
export default function GuestAccountSummary({ email }: Props): ReactNode {
  const initial = email.trim().charAt(0).toUpperCase() || "؟";

  return (
    <div className="border-border bg-foreground/5 flex items-center gap-3 rounded-2xl border p-3">
      <span className="from-primary-400 to-primary-600 grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-br text-sm font-bold text-white">
        {initial}
      </span>
      <span className="min-w-0">
        <span
          className="text-text block truncate text-xs font-semibold"
          dir="ltr"
        >
          {email}
        </span>
        <span className="text-text-gray mt-0.5 block text-[10px]">مهمان</span>
      </span>
    </div>
  );
}
