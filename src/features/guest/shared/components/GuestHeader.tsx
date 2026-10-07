"use client";

import { ChevronLeft, House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { findActiveNavItem } from "@/components/layout/shell/shell-nav";
import ShellMenuButton from "@/components/layout/shell/ShellMenuButton";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { GUEST_NAV_ITEMS } from "../constants/guest-nav-items";

/**
 * هدر ناحیه‌ی مهمان — همان ساختار هدر داشبورد (نوار چسبان، breadcrumb،
 * دکمه‌ی دراور موبایل) با اکشن‌های متناسب با مهمان.
 *
 * ⚠️ چرا پروفایل/خروج در هدر نیست؟ چون ناحیه‌ی مهمان سایدبار اختصاصی
 * دارد و اطلاعات اکانت + خروج همان‌جا (پایین سایدبار) قرار گرفته‌اند؛
 * تکرار آن‌ها در هدر فقط شلوغی می‌آورد. به‌جایش مسیر بازگشت به سایت آمده
 * است، چون این ناحیه از سایت جدا شده است.
 */
export default function GuestHeader(): ReactNode {
  const pathname = usePathname();
  const activeItem = findActiveNavItem(GUEST_NAV_ITEMS, pathname);

  return (
    <header className="bg-surface/80 border-border sticky inset-x-0 top-0 z-30 flex h-16 items-center justify-between gap-4 border-b px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <ShellMenuButton />
        <div className="flex items-center gap-1.5">
          <span className="text-text-gray text-sm">حساب کاربری</span>
          <ChevronLeft className="text-text-gray size-4" />
          <h1 className="text-text truncate text-base font-bold">
            {activeItem?.name ?? "ناحیه‌ی من"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <ThemeToggle />

        <Link
          href="/"
          className="border-border bg-background-2 text-text-gray hover:text-text hover:border-border-strong hidden items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors sm:flex"
        >
          <House className="size-4" />
          بازگشت به سایت
        </Link>
      </div>
    </header>
  );
}
