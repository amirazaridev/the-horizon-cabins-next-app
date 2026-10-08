import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Pagination } from "@/components/ui/Pagination";
import BookingCard from "@/features/guest/bookings/components/BookingCard";
import BookingStatusTabs from "@/features/guest/bookings/components/BookingStatusTabs";
import BookingsEmptyState from "@/features/guest/bookings/components/BookingsEmptyState";
import GuestPageHeader from "@/features/guest/shared/components/GuestPageHeader";
import { GUEST_BOOKINGS_PAGE_SIZE } from "@/features/guest/bookings/config/bookings.config";
import { parseBookingTab } from "@/features/guest/bookings/constants/booking-status";
import { getGuestBookingsRepository } from "@/features/guest/bookings/services/guest-bookings.repository";
import { parsePageParam } from "@/libs/utils/pagination";

export const metadata: Metadata = { title: "رزروهای من" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * صفحه‌ی «رزروهای من» — یک Server Component.
 *
 * ⚠️ URL تنها منبع حقیقت است: تب از `status` و صفحه از `page` خوانده
 * می‌شود، پس هر ترکیب قابل‌اشتراک/بوکمارک است و دکمه‌ی back مرورگر درست
 * کار می‌کند. داده از `GuestBookingsRepository` می‌آید که پیاده‌سازی‌اش
 * روی بک‌اند واقعی است (`GET /bookings`، خودکار محدود به رزروهای همین کاربر).
 */
export default async function GuestBookingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ReactNode> {
  const sp = await searchParams;
  const tab = parseBookingTab(sp.status);
  const page = parsePageParam(sp);

  const repository = getGuestBookingsRepository();
  const [{ bookings, meta }, counts] = await Promise.all([
    repository.list({ page, limit: GUEST_BOOKINGS_PAGE_SIZE, tab }),
    repository.counts(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <GuestPageHeader
        title="رزروهای من"
        description="وضعیت و جزئیات همه‌ی رزروهای خود را اینجا ببینید."
      />

      <BookingStatusTabs active={tab} counts={counts} />

      {bookings.length === 0 ? (
        <BookingsEmptyState
          description={
            tab === "all"
              ? undefined
              : "در این وضعیت رزروی وجود ندارد. برای دیدن همه‌ی رزروها تب «همه» را انتخاب کنید."
          }
        />
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <Pagination
              basePath="/account/bookings"
              currentPage={meta.currentPage}
              totalPages={meta.totalPages}
              searchParams={sp}
            />
          </div>
        </>
      )}
    </div>
  );
}
