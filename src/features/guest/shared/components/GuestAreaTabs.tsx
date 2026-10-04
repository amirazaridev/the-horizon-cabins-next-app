"use client";

import { CalendarCheck, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const TABS = [
  { label: "رزروهای من", href: "/my/bookings", icon: CalendarCheck },
  { label: "تنظیمات حساب کاربری", href: "/my/account", icon: Settings },
] as const;

/**
 * ناوبری بین دو صفحه‌ی ناحیه‌ی مهمان.
 *
 * ⚠️ کلاینتی است چون وضعیت فعال از `usePathname` می‌آید؛ خودِ لینک‌ها
 * سروری/قابل‌اشتراک‌اند.
 */
export default function GuestAreaTabs(): ReactNode {
  const pathname = usePathname();

  return (
    <nav
      aria-label="بخش‌های حساب کاربری"
      className="border-foreground/10 bg-surface/60 flex gap-1 rounded-2xl border p-1 backdrop-blur-sm"
    >
      {TABS.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`focus-visible:ring-primary-400 focus-visible:ring-offset-background flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
              isActive
                ? "bg-primary-400 shadow-primary-400/25 text-black shadow-lg"
                : "text-text-gray hover:bg-foreground/5 hover:text-text"
            }`}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
