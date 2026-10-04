import Link from "next/link";
import type { ReactNode } from "react";

import { BOOKING_TABS } from "../constants/booking-status";
import { toFaNumber } from "@/features/guest/shared/lib/format";
import type {
  GuestBookingsCounts,
  GuestBookingsTabId,
} from "../types/guest-booking.types";

type Props = {
  active: GuestBookingsTabId;
  counts: GuestBookingsCounts;
};

/**
 * آدرس هر تب — «همه» بدون پارامتر می‌ماند تا URL پیش‌فرض تمیز باشد و
 * انتخاب تب هم قابل‌اشتراک/بوکمارک باشد (URL تنها منبع حقیقت).
 */
function tabHref(tabId: GuestBookingsTabId): string {
  return tabId === "all" ? "/my/bookings" : `/my/bookings?status=${tabId}`;
}

/**
 * نوار تب وضعیت — **لینک‌محور**.
 *
 * ⚠️ چرا لینک و نه دکمه‌ی state؟ وضعیت فعال از URL خوانده می‌شود؛ با لینک،
 * هر تب یک آدرس مستقل دارد، صفحه‌ی رزروها کاملاً سروری می‌ماند و دکمه‌ی
 * back مرورگر هم درست کار می‌کند.
 */
export default function BookingStatusTabs({ active, counts }: Props): ReactNode {
  return (
    <nav
      aria-label="فیلتر وضعیت رزروها"
      className="hz-hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1"
    >
      {BOOKING_TABS.map((tab) => {
        const isActive = tab.id === active;

        return (
          <Link
            key={tab.id}
            href={tabHref(tab.id)}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={`focus-visible:ring-primary-400 focus-visible:ring-offset-background inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
              isActive
                ? "border-primary-400/60 bg-primary-400 shadow-primary-400/25 text-black shadow-lg"
                : "border-foreground/10 bg-surface/60 text-text-gray hover:border-primary-400/40 hover:text-text"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${
                isActive
                  ? "bg-black/10 text-black"
                  : "bg-foreground/5 text-text-gray"
              }`}
            >
              {toFaNumber(counts[tab.id])}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
