"use client";

import { LogOut, X } from "lucide-react";
import Link from "next/link";
import { useTransition, type ReactNode } from "react";

import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { logoutAction } from "@/features/auth/actions/auth.actions";
import {
  GUEST_NAV_ITEMS,
  isGuestNavItemActive,
} from "../constants/guest-nav-items";

type Props = {
  /** مسیر جاری — از `usePathname` در پوسته تزریق می‌شود. */
  pathname: string;
  /** کاربر وارد‌شده (نشست سروری). */
  user: { email: string };
  /** وضعیت بازبودن در موبایل (drawer). */
  open: boolean;
  onClose: () => void;
};

/**
 * سایدبار ناحیه‌ی مهمان.
 *
 * چیدمان (بالا به پایین): برند ← ناوبری بخش‌ها ← [موبایل: تم] ←
 * اطلاعات اکانت ← دکمه‌ی خروج.
 *
 * ⚠️ کنترل‌شده است (`open`/`onClose`) تا پوسته‌ی والد مالک وضعیت باشد؛
 * این‌طور همین کامپوننت در پوسته‌ی دسکتاپ و drawer موبایل بدون تکرار
 * منطق قابل استفاده است.
 */
export default function GuestSidebar({
  pathname,
  user,
  open,
  onClose,
}: Props): ReactNode {
  const [isPending, startTransition] = useTransition();
  const initial = user.email.trim().charAt(0).toUpperCase() || "؟";

  return (
    <aside
      aria-label="ناوبری حساب کاربری"
      className={`bg-surface border-border fixed inset-y-0 z-50 flex w-75 flex-col border-l transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="border-border flex h-16 shrink-0 items-center justify-between border-b px-4">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          className="hover:bg-foreground/10 rounded-lg p-2 lg:hidden"
          aria-label="بستن منو"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav
        className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
        aria-label="بخش‌های حساب کاربری"
      >
        {GUEST_NAV_ITEMS.map((item) => {
          const isActive = isGuestNavItemActive(item, pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary-400/10 text-primary-600 dark:text-primary-400"
                  : "text-text-gray hover:bg-foreground/5 hover:text-text"
              }`}
            >
              <item.icon
                className={`size-5 shrink-0 ${
                  isActive ? "text-primary-500 dark:text-primary-400" : ""
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mb-2 flex items-center justify-between px-6 lg:hidden">
        <span className="text-text/70 text-sm">تم</span>
        <ThemeToggle forMobile />
      </div>

      {/* اطلاعات اکانت بالای دکمه‌ی خروج */}
      <div className="border-border border-t p-3">
        <div className="border-border bg-foreground/5 mb-2 flex items-center gap-3 rounded-2xl border p-3">
          <span className="from-primary-400 to-primary-600 grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-br text-sm font-bold text-white">
            {initial}
          </span>
          <span className="min-w-0">
            <span
              className="text-text block truncate text-xs font-semibold"
              dir="ltr"
            >
              {user.email}
            </span>
            <span className="text-text-gray mt-0.5 block text-[10px]">
              مهمان
            </span>
          </span>
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => void logoutAction())}
          className="text-danger hover:bg-danger/10 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 disabled:opacity-50"
        >
          <LogOut className="size-5 shrink-0" />
          {isPending ? "در حال خروج…" : "خروج"}
        </button>
      </div>
    </aside>
  );
}
