"use client";

import { useCallback, useTransition, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Building2, CalendarDays, MapPin, RotateCcw, Search, Tag } from "lucide-react";

import FilterCard, {
  type FilterCardItem,
} from "@/components/ui/Filter/FilterCard";
import MultiOptionList, {
  type MultiOptionListOption,
} from "@/components/ui/Filter/MultiOptionList";
import CityPanel, {
  type CityPanelOption,
} from "@/components/ui/Filter/panels/CityPanel";
import Input from "@/components/ui/Input";
import RangeDatePicker from "@/components/ui/RangeDatePicker";
import { BOOKING_STATUS_META } from "@/features/guest/bookings/constants/booking-status";
import type { GuestBookingStatus } from "@/features/guest/bookings/types/guest-booking.types";
import { formatJalaliDayMonth } from "@/libs/utils/jalali";
import {
  BOOKING_STATUS_VALUES,
  parseBookingsFilters,
  type BookingsSearchParams,
} from "../lib/booking-filters";

/** گزینه‌های فیلتر (اقامتگاه/شهر) — از سرور می‌آیند. */
export interface BookingsFilterOption {
  id: number;
  name: string;
}

interface BookingsFiltersProps {
  cabins: BookingsFilterOption[];
  cities: BookingsFilterOption[];
}

const STATUS_OPTIONS: MultiOptionListOption[] = BOOKING_STATUS_VALUES.map(
  (value) => ({ value, label: BOOKING_STATUS_META[value].label }),
);

/** بازه‌ی تاریخ ورود به‌شکل رشته‌ی `YYYY-MM-DD` (یا خالی). */
interface DateRangeValue {
  from: string;
  to: string;
}

const EMPTY_RANGE: DateRangeValue = { from: "", to: "" };

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(value: string): Date | null {
  return value ? new Date(`${value}T00:00:00`) : null;
}

function statusLabels(values: readonly string[]): string | undefined {
  if (values.length === 0) return undefined;
  return values
    .map((value) => BOOKING_STATUS_META[value as GuestBookingStatus]?.label ?? value)
    .join("، ");
}

function dateRangeLabel(value: DateRangeValue): string | undefined {
  if (!value.from && !value.to) return undefined;
  if (value.from && value.to) {
    return `از ${formatJalaliDayMonth(parseDateKey(value.from)!)} تا ${formatJalaliDayMonth(parseDateKey(value.to)!)}`;
  }
  if (value.from) return `از ${formatJalaliDayMonth(parseDateKey(value.from)!)}`;
  return `تا ${formatJalaliDayMonth(parseDateKey(value.to)!)}`;
}

/**
 * نوار فیلتر صفحه‌ی رزروها.
 *
 * ⭐ منبع حقیقت **URL** است؛ این کامپوننت هیچ state فیلتری نگه نمی‌دارد و با
 * هر تغییر یک navigation می‌زند تا لینک قابل اشتراک بماند و back/forward
 * مرورگر درست کار کند (همان الگوی نوار فیلتر Overview).
 */
export default function BookingsFilters({
  cabins,
  cities,
}: BookingsFiltersProps): ReactNode {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filters = parseBookingsFilters(
    Object.fromEntries(searchParams.entries()) as BookingsSearchParams,
  );

  const apply = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      mutate(params);
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const handleValueChange = useCallback(
    (id: string, value: unknown) => {
      apply((params) => {
        if (id === "status") {
          const list = (value as string[]) ?? [];
          if (list.length) params.set("status", list.join(","));
          else params.delete("status");
          return;
        }
        if (id === "date") {
          const range = (value as DateRangeValue) ?? EMPTY_RANGE;
          if (range.from) params.set("from", range.from);
          else params.delete("from");
          if (range.to) params.set("to", range.to);
          else params.delete("to");
          return;
        }
        if (id === "city" || id === "cabin") {
          if (value) params.set(id, String(value));
          else params.delete(id);
          return;
        }
        if (id === "q") {
          const term = String(value ?? "").trim();
          if (term) params.set("q", term);
          else params.delete("q");
        }
      });
    },
    [apply],
  );

  const cabinOptions: CityPanelOption[] = cabins.map((cabin) => ({
    value: String(cabin.id),
    label: cabin.name,
  }));
  const cityOptions: CityPanelOption[] = cities.map((city) => ({
    value: String(city.id),
    label: city.name,
  }));

  const items: FilterCardItem[] = [
    {
      id: "status",
      label: "وضعیت",
      icon: <Tag className="size-4" />,
      formatLabel: (value) => statusLabels((value as string[]) ?? []),
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
      id: "date",
      label: "تاریخ ورود",
      icon: <CalendarDays className="size-4" />,
      formatLabel: (value) => dateRangeLabel((value as DateRangeValue) ?? EMPTY_RANGE),
      panel: {
        title: "بازه‌ی تاریخ ورود",
        size: "lg",
        render: ({ value, setValue, close }) => {
          const range = (value as DateRangeValue) ?? EMPTY_RANGE;
          return (
            <RangeDatePicker
              value={{ from: parseDateKey(range.from), to: parseDateKey(range.to) }}
              onChange={(next) =>
                setValue({
                  from: next.from ? toDateKey(next.from) : "",
                  to: next.to ? toDateKey(next.to) : "",
                })
              }
              onComplete={() => close()}
              numberOfMonths={1}
            />
          );
        },
      },
    },
    {
      id: "city",
      label: "شهر",
      icon: <MapPin className="size-4" />,
      formatLabel: (value) =>
        value ? (cities.find((city) => String(city.id) === String(value))?.name ?? "۱ شهر") : undefined,
      panel: {
        title: "انتخاب شهر",
        size: "md",
        render: ({ value, setValue }) => (
          <CityPanel
            searchable
            showAll
            allLabel="همه‌ی شهرها"
            cities={cityOptions}
            value={(value as string | null) ?? null}
            onChange={(next) => setValue(next)}
          />
        ),
      },
    },
    {
      id: "cabin",
      label: "اقامتگاه",
      icon: <Building2 className="size-4" />,
      formatLabel: (value) =>
        value
          ? (cabins.find((cabin) => String(cabin.id) === String(value))?.name ?? "۱ اقامتگاه")
          : undefined,
      panel: {
        title: "انتخاب اقامتگاه",
        size: "md",
        render: ({ value, setValue }) => (
          <CityPanel
            searchable
            showAll
            allLabel="همه‌ی اقامتگاه‌ها"
            defaultIcon={<Building2 className="text-primary-400 size-4 shrink-0" />}
            searchPlaceholder="جستجوی اقامتگاه…"
            cities={cabinOptions}
            value={(value as string | null) ?? null}
            onChange={(next) => setValue(next)}
          />
        ),
      },
    },
    {
      id: "q",
      label: "جستجوی مهمان",
      icon: <Search className="size-4" />,
      formatLabel: (value) => (value ? `«${String(value)}»` : undefined),
      panel: {
        title: "جستجوی نام مهمان",
        size: "md",
        render: ({ value, setValue, close }) => (
          <GuestSearchPanel
            initial={(value as string) ?? ""}
            onApply={(term) => {
              setValue(term);
              close();
            }}
          />
        ),
      },
    },
  ];

  return (
    <div
      className="border-border bg-background-2/60 flex w-full flex-wrap items-center gap-2 rounded-2xl border p-3"
      aria-busy={isPending}
    >
      <FilterCard
        items={items}
        value={{
          status: filters.statuses,
          date: { from: filters.from, to: filters.to },
          city: filters.cityId !== null ? String(filters.cityId) : null,
          cabin: filters.cabinId !== null ? String(filters.cabinId) : null,
          q: filters.query,
        }}
        onValueChange={handleValueChange}
        onClearFilters={() =>
          startTransition(() => {
            router.replace(pathname, { scroll: false });
          })
        }
        placement="start"
        mobileTitle="فیلتر رزروها"
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

/* ==========================================================================
   پنل جستجوی مهمان
   ========================================================================== */

function GuestSearchPanel({
  initial,
  onApply,
}: {
  initial: string;
  onApply: (term: string) => void;
}): ReactNode {
  const [term, setTerm] = useState(initial);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onApply(term.trim());
      }}
    >
      <Input
        label="نام مهمان"
        icon={<Search className="size-4" />}
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        clearable
        onClear={() => setTerm("")}
        hint="حداقل ۲ کاراکتر"
      />
      <button
        type="submit"
        className="bg-primary-400 focus-visible:ring-primary-400/60 cursor-pointer rounded-xl py-3 text-sm font-bold text-black transition-transform active:scale-95 focus-visible:ring-2 focus-visible:outline-none"
      >
        اعمال جستجو
      </button>
    </form>
  );
}
