import type { Metadata } from "next";
import type { ReactNode } from "react";

import GuestShell from "@/features/guest/shared/components/GuestShell";
import { requireGuestArea } from "@/features/auth/guards/server-guards";

export const metadata: Metadata = {
  title: {
    default: "حساب کاربری",
    template: "حساب کاربری | %s",
  },
};

/**
 * Layout ناحیه‌ی مهمان — یک Server Component.
 *
 * ⚠️ این گروه از `(main)` جدا است (مثل `(dashboard)`) و نوبار/فوتر سایت را
 * رندر نمی‌کند؛ چیدمانش همان `AppShell` داشبورد است.
 *
 * ⚠️ گارد سروری «دفاع در عمق»: کاربر بدون نشست به `/login` و admin/owner به
 * `/dashboard` هدایت می‌شود؛ سپس ایمیل کاربر به پوسته‌ی کلاینتی تزریق
 * می‌گردد تا حالت درست از همان رندر اول دیده شود.
 */
export default async function GuestRootLayout({
  children,
}: {
  children: ReactNode;
}): Promise<ReactNode> {
  const user = await requireGuestArea("/account");

  return <GuestShell email={user.email}>{children}</GuestShell>;
}
