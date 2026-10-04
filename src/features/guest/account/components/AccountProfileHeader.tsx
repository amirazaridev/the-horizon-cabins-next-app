import type { ReactNode } from "react";

import type { GuestAccountProfile } from "../types/guest-account.types";

type Props = { profile: GuestAccountProfile };

/**
 * سرصفحه‌ی پروفایل — کامپوننت نمایشی.
 *
 * این صفحه فقط برای نقش `guest` است (لایه‌ی گارد)، پس برچسب نقش ثابت
 * «مهمان» است.
 */
export default function AccountProfileHeader({ profile }: Props): ReactNode {
  const initial =
    (profile.fullName.trim() || profile.email).charAt(0).toUpperCase() || "؟";

  return (
    <section className="border-foreground/10 bg-surface/70 relative overflow-hidden rounded-3xl border p-5 shadow-sm backdrop-blur-sm sm:p-6">
      <div
        className="bg-primary-400/10 pointer-events-none absolute -top-20 -left-12 size-48 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-wrap items-center gap-4">
        <span className="from-primary-400 to-primary-600 grid size-16 shrink-0 place-items-center rounded-2xl bg-linear-to-br text-2xl font-bold text-white">
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
    </section>
  );
}
