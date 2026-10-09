"use client";

import { useMemo, useState } from "react";
import {
  ArrowRightLeft,
  BedDouble,
  CalendarCheck2,
  CalendarMinus2,
  LogIn,
  LogOut,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";

import Button from "@/components/ui/Button";
import CardDashContainer from "@/components/ui/CardDashContainer";
import TodayItemRow from "./TodayItemRow";
import { useTodayActivity } from "../../hooks/useTodayActivity";
import { formatJalaliFull } from "../../lib/date-range";
import { formatCount } from "../../lib/metrics/format";
import type {
  BookingStatus,
  TodayActivityItem,
} from "../../types/dashboard.types";

interface TodayActivityProps {
  /** رزروهای امروز — مستقل از فیلتر بازه (از repository) */
  todayBookings: TodayActivityItem[];
  /** «امروز» */
  today: Date;
}

type TabKey = "arrival" | "departure";

const TABS: readonly { key: TabKey; label: string; icon: typeof LogIn }[] = [
  { key: "arrival", label: "ورودها", icon: LogIn },
  { key: "departure", label: "خروج‌ها", icon: LogOut },
];

/**
 * ویجت «عملیات امروز» — ورود و خروج‌های امروز با اکشن check-in/check-out.
 *
 * ### بازطراحی‌شده (فاز ۵)
 * نسخه‌ی قبلی یک لیست تخت با داده‌ی هاردکد بود. این نسخه:
 * - **از لایه‌ی داده** تغذیه می‌شود (`TodayActivityItem[]`).
 * - **تب‌بندی ورود/خروج** با شمارنده — کاربر در یک نگاه می‌بیند امروز
 *   چند تحویل و چند تخلیه دارد.
 * - **اکشن واقعی** با mutation + وضعیت loading روی همان ردیف + پیام خطا.
 * - **به‌روزرسانی خوش‌بینانه**: بعد از موفقیت، ردیف فوراً از لیست
 *   «در انتظار اقدام» خارج می‌شود بدون نیاز به refetch.
 * - اطلاعات کامل: مهمان، اقامتگاه، تعداد مهمان، تعداد شب، وضعیت.
 */
export default function TodayActivity({
  todayBookings,
  today,
}: TodayActivityProps) {
  const [tab, setTab] = useState<TabKey>("arrival");
  const { pendingId, error, run, clearError } = useTodayActivity();

  /**
   * وضعیت محلی «انجام‌شده» — رزروهایی که در همین نشست check-in/out شدند.
   * ⚠️ عمداً به‌جای فیلترکردن، آن‌ها را نشان می‌دهیم ولی به‌عنوان «انجام‌شده»
   * تا اپراتور ببیند عملیات موفق بوده.
   */
  const [doneIds, setDoneIds] = useState<Set<number>>(() => new Set());
  /** وضعیت جدید هر رزرو انجام‌شده — برای نمایش نشان درست. */
  const [statusOverrides, setStatusOverrides] = useState<
    Record<number, BookingStatus>
  >({});

  const arrivals = useMemo(
    () => todayBookings.filter((item) => item.kind === "arrival"),
    [todayBookings],
  );
  const departures = useMemo(
    () => todayBookings.filter((item) => item.kind === "departure"),
    [todayBookings],
  );

  const visible = tab === "arrival" ? arrivals : departures;

  const handleAction = (item: TodayActivityItem) => {
    const isArrival = item.kind === "arrival";
    run(item.bookingId, isArrival ? "checkIn" : "checkOut", (updated) => {
      setDoneIds((prev) => new Set(prev).add(item.bookingId));
      setStatusOverrides((prev) => ({
        ...prev,
        [item.bookingId]: updated.status,
      }));
    });
  };

  return (
    <CardDashContainer className="flex w-full flex-col gap-5 overflow-x-hidden p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-text text-lg font-semibold">عملیات امروز</h3>
          <p className="text-text-gray text-sm">
            {formatJalaliFull(today)} · تحویل و تخلیه
          </p>
        </div>

        <span className="border-primary-400/40 bg-primary-400/10 text-primary-500 inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
          <CalendarCheck2 className="size-3.5" />
          مستقل از بازهٔ انتخابی
        </span>
      </div>

      {/* تب‌ها با شمارنده */}
      <div
        role="tablist"
        aria-label="ورود و خروج‌های امروز"
        className="border-border bg-background inline-flex w-fit items-center gap-1 rounded-full border p-1"
      >
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = key === tab;
          const count = key === "arrival" ? arrivals.length : departures.length;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(key)}
              className={`focus-visible:ring-primary-400/60 inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                active
                  ? "bg-primary-400 text-black"
                  : "text-text-gray hover:text-text"
              }`}
            >
              <Icon className="size-4" />
              {label}
              <span
                className={`rounded-full px-1.5 text-xs tabular-nums ${
                  active ? "bg-black/15" : "bg-foreground/8"
                }`}
              >
                {formatCount(count)}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="border-danger/40 bg-danger/10 text-danger flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm">
          <span className="flex items-center gap-2">
            <TriangleAlert className="size-4 shrink-0" />
            {error}
          </span>
          <button
            type="button"
            onClick={clearError}
            aria-label="بستن پیام خطا"
            className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* خلاصه‌ی سریع */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat
          icon={LogIn}
          label="ورودی امروز"
          value={arrivals.length}
          tone="text-emerald-600 dark:text-emerald-400"
        />
        <MiniStat
          icon={LogOut}
          label="خروجی امروز"
          value={departures.length}
          tone="text-amber-600 dark:text-amber-400"
        />
        <MiniStat
          icon={BedDouble}
          label="مجموع شب"
          value={visible.reduce((sum, item) => sum + item.numNights, 0)}
          tone="text-text"
        />
        <MiniStat
          icon={Users}
          label="مجموع مهمان"
          value={visible.reduce((sum, item) => sum + item.numGuests, 0)}
          tone="text-text"
        />
      </div>

      {visible.length === 0 ? (
        <EmptyState
          tab={tab}
          onSwitch={() => setTab(tab === "arrival" ? "departure" : "arrival")}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((item) => (
            <TodayItemRow
              key={item.bookingId}
              item={item}
              pending={pendingId === item.bookingId}
              done={doneIds.has(item.bookingId)}
              status={statusOverrides[item.bookingId] ?? item.status}
              disabled={pendingId !== null && pendingId !== item.bookingId}
              onAction={() => handleAction(item)}
            />
          ))}
        </ul>
      )}
    </CardDashContainer>
  );
}

/* ==========================================================================
   کمکی‌ها
   ========================================================================== */

function MiniStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof LogIn;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="border-border bg-background flex items-center gap-3 rounded-xl border px-3.5 py-2.5">
      <Icon className="text-text-gray size-4.5 shrink-0" />
      <div className="flex min-w-0 flex-col">
        <span className={`text-lg font-bold tabular-nums ${tone}`}>
          {formatCount(value)}
        </span>
        <span className="text-text-gray truncate text-xs">{label}</span>
      </div>
    </div>
  );
}

function EmptyState({
  tab,
  onSwitch,
}: {
  tab: TabKey;
  onSwitch: () => void;
}) {
  const isArrival = tab === "arrival";
  return (
    <div className="text-text-gray flex flex-col items-center justify-center gap-3 py-10 text-center">
      {isArrival ? (
        <CalendarCheck2 className="size-9" strokeWidth={1.5} />
      ) : (
        <CalendarMinus2 className="size-9" strokeWidth={1.5} />
      )}
      <span className="text-sm">
        {isArrival
          ? "ورودی‌ای برای امروز ثبت نشده"
          : "خروجی‌ای برای امروز ثبت نشده"}
      </span>
      <Button
        type="button"
        variant="outline"
        size="md"
        shape="full"
        onClick={onSwitch}
        className="text-text hover:text-text!"
      >
        <ArrowRightLeft className="size-4" />
        مشاهده {isArrival ? "خروج‌ها" : "ورودها"}
      </Button>
    </div>
  );
}
