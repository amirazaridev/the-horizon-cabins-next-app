"use client";

import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState, type ReactNode } from "react";

import Sidebar from "./Sidebar";
import { ShellContext, type ShellContextValue } from "./shell-context";
import type { ShellNavItem } from "./shell-nav";

type Props = {
  items: readonly ShellNavItem[];
  /** آیتم‌های کاربردی پایین سایدبار (مثل «تنظیمات») — بالای دکمه‌ی خروج. */
  footerItems?: readonly ShellNavItem[];
  /** محتوای برند سایدبار (معمولاً یک `<Link>`). */
  brand: ReactNode;
  /** محتوای اختیاری بالای دکمه‌ی خروج در سایدبار. */
  profile?: ReactNode;
  header?: ReactNode;
  children: ReactNode;
};

//* پوسته‌ی چیدمان ناحیه‌های داخلی (پنل مدیریت / ناحیه‌ی مهمان).
export default function AppShell({
  items,
  footerItems,
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
        <div className="absolute w-93 lg:static">
          <Sidebar
            items={items}
            footerItems={footerItems}
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
