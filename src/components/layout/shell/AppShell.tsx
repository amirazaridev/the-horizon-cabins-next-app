"use client";

import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState, type ReactNode } from "react";

import Sidebar from "./Sidebar";
import { ShellContext, type ShellContextValue } from "./shell-context";
import type { ShellNavItem } from "./shell-nav";

type Props = {
  items: readonly ShellNavItem[];
  /** محتوای برند سایدبار (معمولاً یک `<Link>`). */
  brand: ReactNode;
  /** محتوای اختیاری بالای دکمه‌ی خروج در سایدبار. */
  profile?: ReactNode;
  /**
   * نوار بالای ناحیه‌ی محتوا.
   *
   * ⚠️ عنصر است و نه تابع؛ هدرها با `useShellSidebar` خودشان دراور را باز
   * می‌کنند تا نیازی به پاس‌دادن callback از Server Component نباشد.
   */
  header?: ReactNode;
  children: ReactNode;
};

/**
 * پوسته‌ی چیدمان ناحیه‌های داخلی (پنل مدیریت / ناحیه‌ی مهمان).
 *
 * سایدبار در دسکتاپ ثابت و در موبایل به‌شکل دراور با بک‌دراپ باز می‌شود؛
 * ناحیه‌ی محتوا همان عرض/پدینگ پنل را می‌گیرد تا هر دو ناحیه یکدست باشند.
 */
export default function AppShell({
  items,
  brand,
  profile,
  header,
  children,
}: Props): ReactNode {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const contextValue = useMemo<ShellContextValue>(
    () => ({ openSidebar, closeSidebar }),
    [openSidebar, closeSidebar],
  );

  return (
    <ShellContext value={contextValue}>
      <div className="bg-background min-h-screen md:flex">
        <div className="absolute w-75 lg:static">
          <Sidebar
            items={items}
            brand={brand}
            profile={profile}
            pathname={pathname}
            open={sidebarOpen}
            onClose={closeSidebar}
          />
        </div>

        {sidebarOpen && (
          <div
            onClick={closeSidebar}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
        )}

        <div className="flex w-full flex-col">
          {header}
          <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </ShellContext>
  );
}
