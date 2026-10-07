"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import GuestSidebar from "@/features/guest/shared/components/GuestSidebar";

type Props = {
  /** کاربر وارد‌شده — از Server Component والد تزریق می‌شود. */
  user: { email: string };
  children: ReactNode;
};

/**
 * پوسته‌ی کلاینتی ناحیه‌ی مهمان — سایدبار + ناحیه‌ی محتوا.
 *
 * ⚠️ کلاینتی است چون وضعیت «سایدبار باز/بسته» و مسیر فعال از مرورگر
 * می‌آید؛ خودِ کاربر از لایه‌ی سروری تزریق می‌شود تا حالت درست از همان
 * رندر اول (بدون فلاش) دیده شود.
 */
export default function GuestAreaLayout({ user, children }: Props): ReactNode {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="bg-background min-h-screen md:flex">
      <div className="absolute w-75 lg:static">
        <GuestSidebar
          pathname={pathname}
          user={user}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      <div className="flex w-full flex-col">
        {/* نوار موبایل — فقط دکمه‌ی بازکردن سایدبار */}
        <div className="border-border bg-surface/80 sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-4 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="hover:bg-foreground/10 rounded-lg p-2"
            aria-label="باز کردن منو"
          >
            <Menu className="size-5" />
          </button>
          <span className="text-text text-sm font-bold">حساب کاربری من</span>
        </div>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
