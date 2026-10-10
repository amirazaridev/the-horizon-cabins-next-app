import { Suspense, type ReactNode } from "react";

import { Pagination } from "@/components/ui/Pagination";
import BookingsFilters from "@/features/dashboard/bookings/components/BookingsFilters";
import BookingsTable from "@/features/dashboard/bookings/components/BookingsTable";
import {
  parseBookingsFilters,
  toBookingsApiQuery,
  type BookingsSearchParams,
} from "@/features/dashboard/bookings/lib/booking-filters";
import {
  fetchBookings,
  fetchBookingsFilterOptions,
} from "@/features/dashboard/bookings/services/bookings.api.server";

export const metadata = { title: "مدیریت رزروها" };

type SearchParams = Promise<BookingsSearchParams>;

/**
 * صفحه‌ی «رزروها» داشبورد.
 *
 * ⚠️ فیلترها در URL می‌نشینند و سمت **سرور** به `GET /bookings` بک‌اند
 * (با `authFetch`) پاس می‌شوند؛ نتیجه به جدول کلاینت‌محور داده می‌شود.
 * صفحه‌بندی هم URL-محور است (مثل صفحه‌ی سوییت‌ها).
 */
export default async function BookingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ReactNode> {
  const params = await searchParams;
  const filters = parseBookingsFilters(params);

  const [options, page] = await Promise.all([
    fetchBookingsFilterOptions(),
    fetchBookings(toBookingsApiQuery(filters)),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-text text-2xl font-bold sm:text-3xl">رزروها</h2>
          <p className="text-text-gray mt-1 text-sm">
            مدیریت و پیگیری رزروهای اقامتگاه‌ها
          </p>
        </div>

        <span className="border-border bg-background-2 text-text-gray inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium tabular-nums">
          {page.meta.totalItems.toLocaleString("fa-IR")} رزرو
        </span>
      </header>

      <Suspense fallback={null}>
        <BookingsFilters cabins={options.cabins} cities={options.cities} />
      </Suspense>

      <BookingsTable bookings={page.bookings} />

      <div className="flex justify-center">
        <Pagination
          currentPage={page.meta.currentPage}
          totalPages={page.meta.totalPages}
          basePath="/dashboard/bookings"
          searchParams={params}
          dir="rtl"
          scroll={false}
        />
      </div>
    </div>
  );
}
