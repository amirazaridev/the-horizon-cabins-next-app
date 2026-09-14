"use client";

import { RotateCcw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format, subDays } from "date-fns";

import DateRangeFilter from "./DateRangeFilter";
import CityFilter from "../../../cabins/components/CityFilter";
import StatusFilter from "./StatusFilter";
import {
  ALL,
  DEFAULT_RANGE_DAYS,
  PARAM_CITY,
  PARAM_FROM,
  PARAM_STATUS,
  PARAM_TO,
} from "../../hooks/useDashboardFilters";
import { TransitionStartFunction } from "react";
import { City } from "@/features/cabins/types/City";

const QUICK_RANGES = [
  { days: 7, title: "۷ روز" },
  { days: 30, title: "۳۰ روز" },
  { days: 90, title: "۹۰ روز" },
];

export default function FilterBar({
  startTransition,
  cities,
}: {
  startTransition: TransitionStartFunction;
  cities: City[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const from = searchParams.get(PARAM_FROM);
  const to = searchParams.get(PARAM_TO);
  const city = searchParams.get(PARAM_CITY) ?? ALL;

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else params.set(key, value);
    });
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  function isQuickActive(days: number) {
    if (!from || !to) return days === DEFAULT_RANGE_DAYS;
    const today = new Date();
    return (
      from === format(subDays(today, days - 1), "yyyy-MM-dd") &&
      to === format(today, "yyyy-MM-dd")
    );
  }

  return (
    <div className="border-border bg-background-2/60 flex flex-wrap items-center gap-3 rounded-2xl border p-3">
      {/* پرئست‌های سریع */}
      <div className="border-foreground/5 bg-surface/50 flex gap-1 rounded-xl border p-1">
        {QUICK_RANGES.map(({ days, title }) => (
          <button
            key={days}
            onClick={() =>
              updateParams({
                [PARAM_FROM]: format(
                  subDays(new Date(), days - 1),
                  "yyyy-MM-dd",
                ),
                [PARAM_TO]: format(new Date(), "yyyy-MM-dd"),
              })
            }
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
              isQuickActive(days)
                ? "bg-primary-400 text-black shadow"
                : "text-text-gray hover:bg-foreground/5 hover:text-text"
            }`}
          >
            {title}
          </button>
        ))}
      </div>

      {/* رنج تاریخ */}
      <DateRangeFilter
        from={
          from
            ? new Date(`${from}T00:00:00`)
            : subDays(new Date(), DEFAULT_RANGE_DAYS - 1)
        }
        to={to ? new Date(`${to}T00:00:00`) : new Date()}
        onChange={(f, t) =>
          updateParams({
            [PARAM_FROM]: format(f, "yyyy-MM-dd"),
            [PARAM_TO]: format(t, "yyyy-MM-dd"),
          })
        }
      />

      {/* فیلتر شهر */}
      <CityFilter
        cities={cities}
        value={city}
        onChange={(c) => updateParams({ [PARAM_CITY]: c === ALL ? null : c })}
      />

      {/* فیلتر وضعیت (تراشه‌های آماده پروژه) */}
      <StatusFilter />

      {/* ریست */}
      <button
        onClick={() =>
          startTransition(() => {
            router.replace(pathname, { scroll: false });
          })
        }
        title="پاک کردن فیلترها"
        className="text-text-gray hover:text-danger hover:bg-danger/10 grid size-9.5 place-items-center rounded-xl transition-colors"
      >
        <RotateCcw className="size-4" />
      </button>
    </div>
  );
}
