"use client";

import type { TransitionStartFunction } from "react";
import { CalendarDays, MapPin, RotateCcw, Tag } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import FilterCard, { type FilterCardItem } from "@/components/ui/FilterCard";
import OptionRow from "@/features/cabins/components/filters/OptionRow";
import DateFilterPanel from "./DateFilterPanel";
import { ALL, PARAM_CITY, PARAM_STATUS } from "../../hooks/useDashboardFilters";
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

const STATUS_OPTIONS = [
  { value: ALL, title: "همه" },
  { value: "confirmed", title: "تایید شده" },
  { value: "checked-out", title: "خروج کرده" },
  { value: "unconfirmed", title: "در انتظار" },
];

function statusTitle(value: unknown): string | undefined {
  return STATUS_OPTIONS.find((option) => option.value === value)?.title;
}

interface FilterBarProps {
  startTransition: TransitionStartFunction;
  cities: City[];
}

export default function FilterBar({
  startTransition,
  cities,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dateRange = resolveDashboardDateRange(searchParams);
  const city = searchParams.get(PARAM_CITY) ?? ALL;
  const status = searchParams.get(PARAM_STATUS) ?? ALL;
  const dateTabParam = searchParams.get(PARAM_DATE_TAB);
  const dateTab: DateFilterTab = isDateFilterTab(dateTabParam)
    ? dateTabParam
    : "year";

  const dateValue: DateFilterValue = {
    from: formatDateKey(dateRange.from),
    to: formatDateKey(dateRange.to),
    tab: dateTab,
  };

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
      const next = value as string | null;
      updateParams({ [PARAM_CITY]: next === null || next === ALL ? null : next });
      return;
    }

    if (id === "status") {
      const next = value as string | null;
      updateParams({
        [PARAM_STATUS]: next === null || next === ALL ? null : next,
      });
    }
  }

  const items: FilterCardItem[] = [
    {
      id: "date",
      label: "بازه تاریخ",
      icon: <CalendarDays className="size-4" />,
      formatLabel: (value) =>
        formatDateFilterLabel(value as DateFilterValue),
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
      formatLabel: (value) => value as string,
      panel: {
        title: "شهر",
        size: "sm",
        closeOnSelect: true,
        render: ({ value, setValue }) => (
          <div className="flex flex-col gap-2">
            <OptionRow
              label="همه شهرها"
              selected={value == null}
              onSelect={() => setValue(null)}
            />
            {cities.map((option) => (
              <OptionRow
                key={option.id}
                label={option.name}
                selected={value === option.name}
                onSelect={() => setValue(option.name)}
              />
            ))}
          </div>
        ),
      },
    },
    {
      id: "status",
      label: "وضعیت",
      icon: <Tag className="size-4" />,
      formatLabel: (value) => statusTitle(value),
      panel: {
        title: "وضعیت رزرو",
        size: "sm",
        closeOnSelect: true,
        render: ({ value, setValue }) => (
          <div className="flex flex-col gap-2">
            {STATUS_OPTIONS.map((option) => (
              <OptionRow
                key={option.value}
                label={option.title}
                selected={(value ?? ALL) === option.value}
                onSelect={() =>
                  setValue(option.value === ALL ? null : option.value)
                }
              />
            ))}
          </div>
        ),
      },
    },
  ];

  return (
    <div className="flex w-full flex-wrap items-center gap-2 rounded-2xl border border-border bg-background-2/60 p-3">
      <FilterCard
        items={items}
        value={{
          date: dateValue,
          city: city === ALL ? null : city,
          status: status === ALL ? null : status,
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
        className="grid size-9.5 shrink-0 place-items-center rounded-xl text-text-gray transition-colors hover:bg-danger/10 hover:text-danger"
      >
        <RotateCcw className="size-4" />
      </button>
    </div>
  );
}
