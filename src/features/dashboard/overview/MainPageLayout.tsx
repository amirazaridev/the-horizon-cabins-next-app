"use client";

import { useCallback, useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format as formatJalali } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import { RotateCcw, TriangleAlert } from "lucide-react";

import { useDashboardFilters } from "./hooks/useDashboardFilters";
import FilterBar from "./components/FilterBar";
import KpiRow from "./components/KpiRow";
import AlertsBar from "./components/AlertsBar";
import RevenueTrendChart from "./components/charts/RevenueTrendChart";
import OccupancyAdrChart from "./components/charts/OccupancyAdrChart";
import DurationChart from "./components/charts/DurationChart";
import CityRevenueChart from "./components/charts/CityRevenueChart";
import StatusDistributionChart from "./components/charts/StatusDistributionChart";
import PerformanceTable from "./components/PerformanceTable";
import TodayActivity from "./components/TodayActivity";
import ForwardBookings from "./components/ForwardBookings";
import WidgetBoundary from "./components/WidgetBoundary";
import DataFreshness from "./components/DataFreshness";
import { WidgetSkeleton } from "./components/WidgetStates";
import Spinner from "@/components/ui/Spinner";
import {
  PARAM_STATUS,
} from "./constants/dashboard-params";
import { pickTodayActivity } from "./data";
import { COMPARE_MODE_LABELS } from "./types/dashboard.types";
import type { KpiKey } from "./config/targets";
import type {
  DashboardCabin,
  DashboardCity,
} from "./types/dashboard.types";

type Props = {
  cities: DashboardCity[];
  cabins: DashboardCabin[];
};

/**
 * نگاشت drill-down کارت‌های KPI به پارامترهای URL.
 *
 * ⚠️ فعلاً فقط شاخص‌هایی که فیلتر معادل دارند به URL نگاشت می‌شوند؛
 * بقیه بدون اقدام‌اند (کلیک بی‌اثر، نه خطا).
 */
const DRILL_DOWN_PARAMS: Partial<Record<KpiKey, Record<string, string>>> = {
  cancellationRate: { [PARAM_STATUS]: "cancelled" },
};

/**
 * چیدمان صفحه‌ی داشبورد.
 *
 * ⭐ از فاز ۴، **همه‌ی** ویجت‌ها از لایه‌ی داده‌ی `DashboardRepository`
 * تغذیه می‌شوند؛ آداپتور موقت legacy حذف شد.
 *
 * ### لایه‌ی کیفیت (فاز ۶)
 * - هر ویجت داخل `WidgetBoundary` است ⇒ خطای یک ویجت کل صفحه را سفید
 *   نمی‌کند.
 * - در اولین بارگذاری، هر ویجت **اسکلتون هم‌شکل خودش** را نشان می‌دهد
 *   (به‌جای یک اسپینر تمام‌صفحه که تمام چیدمان را پاک می‌کند).
 * - خطای داده یک بنر با دکمه‌ی «تلاش دوباره» دارد.
 * - «آخرین به‌روزرسانی» در سرصفحه با اکشن بازخوانی.
 */
export default function MainPageLayout({ cities, cabins }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filters, snapshot, isLoading, error, updatedAt, refresh } =
    useDashboardFilters();

  /** drill-down: اعمال فیلتر معادل روی URL */
  const handleDrill = useCallback(
    (key: KpiKey) => {
      const params = DRILL_DOWN_PARAMS[key];
      if (!params) return;

      const next = new URLSearchParams(searchParams);
      for (const [paramKey, value] of Object.entries(params)) {
        next.set(paramKey, value);
      }
      startTransition(() => {
        router.replace(`${pathname}?${next.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const bookings = snapshot?.bookings ?? [];
  const compareBookings = snapshot?.compareBookings ?? [];
  const compareRange = snapshot?.compareRange ?? null;
  const compareEnabled = filters.compare !== "none";
  const cabinCount = snapshot?.cabins.length ?? 0;
  const range = useMemo(
    () => ({ from: filters.from, to: filters.to }),
    [filters.from, filters.to],
  );

  /**
   * ⚠️ رزروهای امروز باید از **کل** دیتاست بیایند، نه فیلترشده — وگرنه
   * با فیلتر شهر/وضعیت، عملیات امروز ناقص می‌شود. `snapshot.bookings`
   * فیلترشده است، پس برای این ویجت از `snapshot.todayBookings` (مستقل)
   * استفاده می‌کنیم.
   */
  const todayItems = useMemo(
    () =>
      snapshot ? pickTodayActivity(snapshot.todayBookings, snapshot.today) : [],
    [snapshot],
  );

  /**
   * آیا هنوز **اولین** داده نرسیده است؟ (چیست که اسکلتون بدهیم)
   *
   * ⚠️ `isLoading` با هر تغییر فیلتر هم true می‌شود؛ اگر در آن حالت هم
   * اسکلتون بدهیم، کاربر هنگام تغییر فیلتر صحنه را از دست می‌دهد. پس
   * اسکلتون فقط وقتی است که **هیچ snapshot قبلی نداریم**.
   */
  const isInitialLoad = isLoading && snapshot === null;
  const isRefreshing = (isLoading || isPending) && snapshot !== null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-text text-2xl font-bold sm:text-3xl">
              داشبورد
            </h2>
            <p className="text-text-gray mt-1 text-sm">
              خلاصه وضعیت اقامتگاه‌ها از{" "}
              <span className="text-text font-semibold">
                {formatJalali(filters.from, "d MMMM", { locale: faIR })}
              </span>{" "}
              تا{" "}
              <span className="text-text font-semibold">
                {formatJalali(filters.to, "d MMMM yyyy", { locale: faIR })}
              </span>
              {compareEnabled && compareRange && (
                <>
                  {" · "}
                  <span className="text-text-gray">
                    مقایسه با {COMPARE_MODE_LABELS[filters.compare]}
                  </span>
                </>
              )}
            </p>
          </div>

          <DataFreshness
            updatedAt={updatedAt}
            loading={isRefreshing}
            onRefresh={refresh}
          />
        </div>

        <FilterBar
          cities={cities}
          cabins={cabins}
          startTransition={startTransition}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="border-danger/40 bg-danger/10 text-danger flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 text-sm"
        >
          <span className="flex items-center gap-2">
            <TriangleAlert className="size-4 shrink-0" />
            خطا در بارگذاری دادهٔ داشبورد: {error.message}
          </span>
          <button
            type="button"
            onClick={refresh}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-current px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
          >
            <RotateCcw className="size-3.5" />
            تلاش دوباره
          </button>
        </div>
      )}

      {isInitialLoad ? (
        /* ─── اولین بارگذاری: اسکلتون هم‌شکل هر ویجت ─── */
        <DashboardSkeleton />
      ) : (
        <>
          {/* نوار هشدارها — اگر هشداری نباشد چیزی رندر نمی‌شود */}
          <WidgetBoundary name="نوار هشدارها">
            <AlertsBar
              bookings={bookings}
              compareBookings={compareBookings}
              cabins={snapshot?.cabins ?? []}
              range={range}
              compareRange={compareRange}
              today={snapshot?.today ?? filters.from}
            />
          </WidgetBoundary>

          <WidgetBoundary name="کارت‌های شاخص">
            <KpiRow
              bookings={bookings}
              compareBookings={compareBookings}
              activeCabinCount={cabinCount}
              range={range}
              compareRange={compareRange}
              compareEnabled={compareEnabled}
              onDrill={handleDrill}
            />
          </WidgetBoundary>

          {/* ردیف ۱: روند درآمد + توزیع مدت اقامت */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <WidgetBoundary name="روند درآمد">
                <RevenueTrendChart
                  bookings={bookings}
                  range={range}
                  compareBookings={compareBookings}
                  compareEnabled={compareEnabled}
                  compareLabel={COMPARE_MODE_LABELS[filters.compare]}
                />
              </WidgetBoundary>
            </div>
            <div className="lg:col-span-2">
              <WidgetBoundary name="مدت اقامت">
                <DurationChart bookings={bookings} range={range} />
              </WidgetBoundary>
            </div>
          </div>

          {/* ردیف ۲: اشغال/ADR + درآمد شهر */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <WidgetBoundary name="اشغال و ADR">
                <OccupancyAdrChart
                  bookings={bookings}
                  cabinCount={cabinCount}
                  range={range}
                />
              </WidgetBoundary>
            </div>
            <div className="lg:col-span-2">
              <WidgetBoundary name="درآمد شهرها">
                <CityRevenueChart
                  bookings={bookings}
                  cabins={snapshot?.cabins ?? []}
                  range={range}
                />
              </WidgetBoundary>
            </div>
          </div>

          {/* ردیف ۳: توزیع وضعیت رزرو (تمام‌عرض) */}
          <WidgetBoundary name="وضعیت رزروها">
            <StatusDistributionChart bookings={bookings} range={range} />
          </WidgetBoundary>

          {/* جدول عملکرد — تمام‌عرض */}
          <WidgetBoundary name="جدول عملکرد">
            <PerformanceTable
              bookings={bookings}
              cabins={snapshot?.cabins ?? []}
              range={range}
              compareRange={compareRange}
            />
          </WidgetBoundary>

          {/*
            ویجت‌های مستقل از بازه‌ی انتخابی — همیشه از «امروز» محاسبه
            می‌شوند. برچسب «مستقل از بازهٔ انتخابی» در خود کامپوننت‌ها
            نمایش داده می‌شود.
          */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <WidgetBoundary name="عملیات امروز">
                <TodayActivity
                  todayBookings={todayItems}
                  today={snapshot?.today ?? filters.from}
                />
              </WidgetBoundary>
            </div>
            <div className="lg:col-span-2">
              <WidgetBoundary name="رزروهای پیش‌رو">
                <ForwardBookings
                  forwardBookings={snapshot?.forwardBookings ?? []}
                  today={snapshot?.today ?? filters.from}
                />
              </WidgetBoundary>
            </div>
          </div>
        </>
      )}

      {/* بازخوانی در پس‌زمینه — داده‌ی قبلی سرجایش می‌ماند */}
      {isRefreshing && <Spinner size="md" className="fixed bottom-6 left-6" />}
    </div>
  );
}

/* ==========================================================================
   اسکلتون سطر‌به‌سطر صفحه — آینه‌ی چیدمان واقعی
   ========================================================================== */

function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <WidgetSkeleton key={index} kpi />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <WidgetSkeleton chart />
        </div>
        <div className="lg:col-span-2">
          <WidgetSkeleton chart />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <WidgetSkeleton chart />
        </div>
        <div className="lg:col-span-2">
          <WidgetSkeleton chart />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <WidgetSkeleton rows={4} />
        </div>
        <div className="lg:col-span-2">
          <WidgetSkeleton rows={4} />
        </div>
      </div>

      <WidgetSkeleton rows={5} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <WidgetSkeleton rows={4} />
        </div>
        <div className="lg:col-span-2">
          <WidgetSkeleton rows={4} />
        </div>
      </div>
    </>
  );
}
