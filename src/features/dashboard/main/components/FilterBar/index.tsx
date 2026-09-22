"use client";

import type { TransitionStartFunction } from "react";
import { CalendarDays, MapPin, RotateCcw, Tag } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import FilterCard, {
  type FilterCardItem,
} from "@/components/ui/Filter/FilterCard";
import MultiOptionList, {
  type MultiOptionListOption,
} from "@/features/cabins/components/filters/MultiOptionList";
import DateFilterPanel from "./DateFilterPanel";
import {
  ALL,
  PARAM_CITY,
  PARAM_STATUS,
  parseMultiParam,
  serializeMultiParam,
} from "../../hooks/useDashboardFilters";
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
import type { City } from "@/features/cabins/types/City";

const STATUS_OPTIONS: MultiOptionListOption[] = [
  { value: "confirmed", label: "تایید شده" },
  { value: "checked-out", label: "خروج کرده" },
  { value: "unconfirmed", label: "در انتظار" },
];

function statusLabels(values: string[]): string | undefined {
  if (values.length === 0) return undefined;
  return values
    .map((v) => STATUS_OPTIONS.find((o) => o.value === v)?.label ?? v)
    .join("، ");
}

interface FilterBarProps {
  startTransition: TransitionStartFunction;
  cities: City[];
}

export default function FilterBar({ startTransition, cities }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dateRange = resolveDashboardDateRange(searchParams);
  const cityValues = parseMultiParam(searchParams.get(PARAM_CITY));
  const statusValues = parseMultiParam(searchParams.get(PARAM_STATUS));
  const dateTabParam = searchParams.get(PARAM_DATE_TAB);
  const dateTab: DateFilterTab = isDateFilterTab(dateTabParam)
    ? dateTabParam
    : "year";

  const dateValue: DateFilterValue = {
    from: formatDateKey(dateRange.from),
    to: formatDateKey(dateRange.to),
    tab: dateTab,
  };

  const cityOptions: MultiOptionListOption[] = cities.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  function updateParams(updates: Record<string, string | null>): void {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) params.delete(key);
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
        [PARAM_CITY]: serializeMultiParam((value as string[]) ?? []),
      });
      return;
    }

    if (id === "status") {
      updateParams({
        [PARAM_STATUS]: serializeMultiParam((value as string[]) ?? []),
      });
    }
  }

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
        const list = (value as string[]) ?? [];
        if (list.length === 0) return undefined;
        if (list.length === 1) return list[0];
        return `${list.length} شهر`;
      },
      panel: {
        title: "انتخاب شهر",
        size: "md",
        // چون چندانتخابیه، با هر کلیک بسته نشه
        closeOnSelect: false,
        render: ({ value, setValue }) => (
          <MultiOptionList
            options={cityOptions}
            value={(value as string[]) ?? []}
            onChange={(next) => setValue(next)}
          />
        ),
      },
    },
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
  ];

  return (
    <div className="border-border bg-background-2/60 flex w-full flex-wrap items-center gap-2 rounded-2xl border p-3">
      <FilterCard
        items={items}
        value={{
          date: dateValue,
          city: cityValues,
          status: statusValues,
        }}
        onValueChange={handleValueChange}
        placement="start"
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