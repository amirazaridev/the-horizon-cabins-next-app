"use client";

import type { ReactNode } from "react";

import AppShell from "@/components/layout/shell/AppShell";
import Logo from "@/components/ui/Logo";
import { GUEST_NAV_ITEMS } from "../constants/guest-nav-items";
import GuestAccountSummary from "./GuestAccountSummary";
import GuestHeader from "./GuestHeader";

type Props = {
  /** ایمیل کاربر وارد‌شده — از Server Component والد تزریق می‌شود. */
  email: string;
  children: ReactNode;
};

/**
 * پوسته‌ی ناحیه‌ی مهمان — همان `AppShell` پنل مدیریت با تنظیمات مهمان.
 *
 * ⚠️ ناحیه‌ی مهمان از `(main)` جدا شده و نوبار/فوتر سایت را ندارد؛
 * چیدمانش عیناً مانند داشبورد است (سایدبار + هدر + ناحیه‌ی محتوا) تا هر
 * دو ناحیه یک تجربه‌ی واحد بدهند.
 */
export default function GuestShell({ email, children }: Props): ReactNode {
  return (
    <AppShell
      items={GUEST_NAV_ITEMS}
      brand={<Logo />}
      profile={<GuestAccountSummary email={email} />}
      header={<GuestHeader />}
    >
      {children}
    </AppShell>
  );
}
