"use client";

import { Mountain } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import AppShell from "@/components/layout/shell/AppShell";
import type { UserRole } from "@/features/auth/constants/auth-cookie";
import { visibleSidebarItems, visibleSidebarUtilityItems } from "../constants/sidebar-items";
import Header from "./Header";

type Props = {
  /** نقش کاربر — از Server Component والد تزریق می‌شود. */
  role: UserRole;
  /** شناسه‌ی کاربر — برای نمایش/اکشن‌های وابسته به کاربر. */
  userId: number;
  children: ReactNode;
};

/**
 * پوسته‌ی پنل مدیریت — سایدبار آیتم‌های مخصوص نقش + هدر داشبورد.
 *
 * ⚠️ کلاینتی است چون فهرست آیتم‌ها `icon` (کامپوننت) دارد و توابع از
 * Server Component قابل‌سریال‌سازی نیستند؛ پس آیتم‌ها همین‌جا از ماژول
 * خوانده می‌شوند و فقط `role`/`userId` از سرور می‌آید.
 */
export default function DashboardShell({
  role,
  userId,
  children,
}: Props): ReactNode {
  return (
    <AppShell
      items={visibleSidebarItems(role)}
      footerItems={visibleSidebarUtilityItems(role)}
      brand={
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-primary-400 flex size-8 items-center justify-center rounded-lg">
            <Mountain className="size-5 text-black" />
          </div>
          <span className="text-text text-lg font-bold">هورایزن</span>
        </Link>
      }
      header={<Header role={role} userId={userId} />}
    >
      {children}
    </AppShell>
  );
}
