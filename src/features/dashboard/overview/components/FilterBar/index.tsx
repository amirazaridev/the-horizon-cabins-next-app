"use client";

import type { TransitionStartFunction } from "react";
import {
  Building2,
  CalendarDays,
  MapPin,
  RotateCcw,
  Scale,
  Tag,
  Wallet,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import FilterCard, {
  type FilterCardItem,
} from "@/components/ui/Filter/FilterCard";
import MultiOptionList, {
  type MultiOptionListOption,
} from "@/components/ui/Filter/MultiOptionList";
import CityPanel, {
  type CityPanelOption,
} from "@/components/ui/Filter/panels/CityPanel";
import SingleOptionPanel from "@/components/ui/Filter/panels/SingleOptionPanel";
import DateFilterPanel from "./DateFilterPanel";
import {
  PARAM_CABIN,
  PARAM_CITY,
  PARAM_COMPARE,
  PARAM_PAYMENT,
  PARAM_STATUS,
  parseCompareParam,
  parseMultiParam,
  parseNumberListParam,
  serializeMultiParam,
  serializeNumberListParam,
} from "../../constants/dashboard-params";
import {
  PARAM_DATE_TAB,
  PARAM_RANGE,
  formatDateFilterLabel,
  formatDateKey,
  isDateFilterTab,
  resolveDashboardDateRange,
  type DateFilterTab,
  type DateFilterValue,
} from "../../lib/date-range";
import {
  BOOKING_STATUS_LABELS,
  COMPARE_MODE_LABELS,
  PAYMENT_STATUS_LABELS,
  type BookingStatus,
  type CompareMode,
  type PaymentStatus,
} from "../../types/dashboard.types";
import type {
  DashboardCabin,
  DashboardCity,
} from "../../types/dashboard.types";

/* ==========================================================================
   گزینه‌های فیلتر — همه از enumهای دامنه ساخته می‌شوند (تک‌منبع)
   ========================================================================== */

const STATUS_OPTIONS: MultiOptionListOption[] = (
  Object.keys(BOOKING_STATUS_LABELS) as BookingStatus[]
).map((value) => ({ value, label: BOOKING_STATUS_LABELS[value] }));

const PAYMENT_OPTIONS: MultiOptionListOption[] = (
  Object.keys(PAYMENT_STATUS_LABELS) as PaymentStatus[]
).map((value) => ({ value, label: PAYMENT_STATUS_LABELS[value] }));

const COMPARE_OPTIONS = (
  Object.keys(COMPARE_MODE_LABELS) as CompareMode[]
).map((value) => ({ value, label: COMPARE_MODE_LABELS[value] }));

/** برچسبِ خوانا برای یک آرایه‌ی enum بر اساس نگاشت فارسی. */
function enumLabels(
  values: readonly string[],
  options: readonly MultiOptionListOption[],
): string | undefined {
  if (values.length === 0) return undefined;
  return values
    .map((v) => options.find((o) => o.value === v)?.label ?? v)
    .join("، ");
}

interface FilterBarProps {
  startTransition: TransitionStartFunction;
  /** شهرها — از repository می‌آید، نه mock مستقیم */
  cities: DashboardCity[];
  /** اقامتگاه‌ها — برای فیلتر اقامتگاه */
  cabins: DashboardCabin[];
}

/**
 * نوار فیلتر داشبورد.
 *
 * ⭐ همه‌ی حالت در **URL** است؛ این کامپوننت هیچ draft محلی ندارد و مقدار
 * هر فیلتر را مستقیم از `searchParams` می‌خواند. این کار:
 * - باگ «گم‌شدن کلیک پشت‌سرهم» را حذف می‌کند (قبلاً draft در effect همگام
 *   می‌شد و خطای `set-state-in-effect` می‌داد)،
 * - لینک را قابل اشتراک نگه می‌دارد،
 * - back/forward مرورگر را درست می‌کند.
 */
export default function FilterBar({
  startTransition,
  cities,
  cabins,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* ---------------- خواندن مقادیر فعلی از URL ---------------- */

  const dateRange = resolveDashboardDateRange(searchParams);
  const dateTabParam = searchParams.get(PARAM_DATE_TAB);
  const dateTab: DateFilterTab = isDateFilterTab(dateTabParam)
    ? dateTabParam
    : "year";

  const cityIds = parseNumberListParam(searchParams.get(PARAM_CITY));
  const cabinIds = parseNumberListParam(searchParams.get(PARAM_CABIN));
  const statuses = parseMultiParam(searchParams.get(PARAM_STATUS));
  const paymentStatuses = parseMultiParam(searchParams.get(PARAM_PAYMENT));
  const compare = parseCompareParam(searchParams.get(PARAM_COMPARE));

  const dateValue: DateFilterValue = {
    from: formatDateKey(dateRange.from),
    to: formatDateKey(dateRange.to),
    tab: dateTab,
  };

  /* ---------------- ساخت گزینه‌های پنل ---------------- */

  const cityOptions: CityPanelOption[] = cities.map((city) => ({
    value: String(city.id),
    label: city.name,
  }));

  const cabinOptions: CityPanelOption[] = cabins.map((cabin) => ({
    value: String(cabin.id),
    label: cabin.name,
  }));

  /* ---------------- نوشتن در URL ---------------- */

  function updateParams(updates: Record<string, string | null>): void {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    });
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  function handleValueChange(id: string, value: unknown): void {
    if (id === "date") {
      const next = value as DateFilterValue;
      updateParams({
        [PARAM_RANGE]: "custom",
        from: next.from,
        to: next.to,
        [PARAM_DATE_TAB]: next.tab,
      });
      return;
    }

    if (id === "city") {
      updateParams({
        [PARAM_CITY]: serializeNumberListParam((value as number[]) ?? []),
      });
      return;
    }

    if (id === "cabin") {
      updateParams({
        [PARAM_CABIN]: serializeNumberListParam((value as number[]) ?? []),
      });
      return;
    }

    if (id === "status") {
      updateParams({
        [PARAM_STATUS]: serializeMultiParam((value as string[]) ?? []),
      });
      return;
    }

    if (id === "paymentStatus") {
      updateParams({
        [PARAM_PAYMENT]: serializeMultiParam((value as string[]) ?? []),
      });
      return;
    }

    if (id === "compare") {
      const next = (value as string | null) ?? null;
      // `prev-period` پیش‌فرض است ⇒ از URL حذف می‌شود تا لینک تمیز بماند
      updateParams({
        [PARAM_COMPARE]: next === "prev-period" ? null : next,
      });
    }
  }

  /* ---------------- تعریف آیتم‌های فیلتر ---------------- */

  const items: FilterCardItem[] = [
    {
      id: "date",
      label: "بازه تاریخ",
      icon: <CalendarDays className="size-4" />,
      formatLabel: (value) => formatDateFilterLabel(value as DateFilterValue),
      panel: {
        title: "بازه تاریخ",
        size: "lg",
        render: ({ value, setValue, close }) => (
          <DateFilterPanel
            initial={value as DateFilterValue}
            onApply={(next) => {
              setValue(next);
              close();
            }}
          />
        ),
      },
    },
    {
      id: "city",
      label: "شهر",
      icon: <MapPin className="size-4" />,
      formatLabel: (value) => {
        const list = (value as number[]) ?? [];
        if (list.length === 0) return undefined;
        if (list.length === 1) {
          return cities.find((c) => c.id === list[0])?.name ?? "۱ شهر";
        }
        return `${list.length} شهر`;
      },
      panel: {
        title: "انتخاب شهر",
        size: "md",
        closeOnSelect: false,
        render: ({ value, setValue }) => (
          <CityPanel
            multiple
            searchable
            cities={cityOptions}
            value={((value as number[]) ?? []).map(String)}
            onChange={(next) => setValue(next.map(Number))}
          />
        ),
      },
    },
    {
      id: "cabin",
      label: "اقامتگاه",
      icon: <Building2 className="size-4" />,
      formatLabel: (value) => {
        const list = (value as number[]) ?? [];
        if (list.length === 0) return undefined;
        if (list.length === 1) {
          return cabins.find((c) => c.id === list[0])?.name ?? "۱ اقامتگاه";
        }
        return `${list.length} اقامتگاه`;
      },
      panel: {
        title: "انتخاب اقامتگاه",
        size: "md",
        closeOnSelect: false,
        render: ({ value, setValue }) => (
          <CityPanel
            multiple
            searchable
            defaultIcon={<Building2 className="text-primary-400 size-4 shrink-0" />}
            cities={cabinOptions}
            value={((value as number[]) ?? []).map(String)}
            onChange={(next) => setValue(next.map(Number))}
          />
        ),
      },
    },
    {
      id: "status",
      label: "وضعیت",
      icon: <Tag className="size-4" />,
      formatLabel: (value) =>
        enumLabels((value as string[]) ?? [], STATUS_OPTIONS),
      panel: {
        title: "وضعیت رزرو",
        size: "md",
        closeOnSelect: false,
        render: ({ value, setValue }) => (
          <MultiOptionList
            options={STATUS_OPTIONS}
            value={(value as string[]) ?? []}
            onChange={(next) => setValue(next)}
          />
        ),
      },
    },
    {
      id: "paymentStatus",
      label: "وضعیت پرداخت",
      icon: <Wallet className="size-4" />,
      formatLabel: (value) =>
        enumLabels((value as string[]) ?? [], PAYMENT_OPTIONS),
      panel: {
        title: "وضعیت پرداخت",
        size: "md",
        closeOnSelect: false,
        render: ({ value, setValue }) => (
          <MultiOptionList
            options={PAYMENT_OPTIONS}
            value={(value as string[]) ?? []}
            onChange={(next) => setValue(next)}
          />
        ),
      },
    },
    {
      id: "compare",
      label: "مقایسه",
      icon: <Scale className="size-4" />,
      formatLabel: (value) =>
        value ? COMPARE_MODE_LABELS[value as CompareMode] : undefined,
      panel: {
        title: "مبناى مقایسه",
        size: "md",
        closeOnSelect: true,
        render: ({ value, setValue }) => (
          <SingleOptionPanel
            options={COMPARE_OPTIONS}
            value={(value as string | null) ?? null}
            onChange={(next) => setValue(next)}
          />
        ),
      },
    },
  ];

  return (
    <div className="border-border bg-background-2/60 flex w-full flex-wrap items-center gap-2 rounded-2xl border p-3">
      <FilterCard
        items={items}
        value={{
          date: dateValue,
          city: cityIds,
          cabin: cabinIds,
          status: statuses,
          paymentStatus: paymentStatuses,
          compare,
        }}
        onValueChange={handleValueChange}
        onClearFilters={() =>
          startTransition(() => {
            router.replace(pathname, { scroll: false });
          })
        }
        placement="start"
        mobileTitle="فیلترها"
        mobileApplyLabel="اعمال"
        className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
      />

      <button
        type="button"
        onClick={() =>
          startTransition(() => {
            router.replace(pathname, { scroll: false });
          })
        }
        title="پاک کردن فیلترها"
        className="text-text-gray hover:bg-danger/10 hover:text-danger grid size-9.5 shrink-0 place-items-center rounded-xl transition-colors"
      >
        <RotateCcw className="size-4" />
      </button>
    </div>
  );
}
