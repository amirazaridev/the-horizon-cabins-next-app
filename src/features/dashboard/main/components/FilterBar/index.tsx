"use client";

import { useEffect, useState, type TransitionStartFunction } from "react";
import { RotateCcw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import DateRangeFilter from "./DateRangeFilter";
import CityFilter from "../../../cabins/components/CityFilter";
import StatusFilter from "./StatusFilter";
import { ALL, PARAM_CITY } from "../../hooks/useDashboardFilters";
import {
  DATE_RANGE_PRESETS,
  formatDateKey,
  getPresetDateRange,
  PARAM_RANGE,
  resolveDashboardDateRange,
  type DateRangePreset,
} from "../../lib/date-range";
import type { City } from "@/features/cabins/types/City";

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

  const [isGaugeOpen, setIsGaugeOpen] = useState(
    dateRange.preset === "custom",
  );

  useEffect(() => {
    setIsGaugeOpen(dateRange.preset === "custom");
  }, [dateRange.preset]);

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

  function handlePresetChange(preset: DateRangePreset): void {
    if (preset === "custom") {
      updateParams({ [PARAM_RANGE]: "custom" });
      setIsGaugeOpen(true);
      return;
    }

    const range = getPresetDateRange(preset, new Date());

    updateParams({
      [PARAM_RANGE]: preset,
      from: formatDateKey(range.from),
      to: formatDateKey(range.to),
    });

    setIsGaugeOpen(false);
  }

  function handleCustomRangeChange(from: Date, to: Date): void {
    updateParams({
      [PARAM_RANGE]: "custom",
      from: formatDateKey(from),
      to: formatDateKey(to),
    });
  }

  return (
    <div className="border-border bg-background-2/60 flex w-full flex-col gap-3 rounded-2xl border p-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="border-foreground/5 bg-surface/50 flex flex-wrap gap-1 rounded-xl border p-1">
          {DATE_RANGE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handlePresetChange(preset.value)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                dateRange.preset === preset.value
                  ? "bg-primary-400 text-black shadow"
                  : "text-text-gray hover:bg-foreground/5 hover:text-text"
              }`}
            >
              {preset.title}
            </button>
          ))}
        </div>

        <div className="min-w-48 flex-1 md:max-w-60">
          <CityFilter
            cities={cities}
            value={city}
            onChange={(nextCity) =>
              updateParams({
                [PARAM_CITY]: nextCity === ALL ? null : nextCity,
              })
            }
          />
        </div>

        <StatusFilter />

        <button
          type="button"
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

      {isGaugeOpen && dateRange.preset === "custom" && (
        <DateRangeFilter
          from={dateRange.from}
          to={dateRange.to}
          onChange={handleCustomRangeChange}
        />
      )}
    </div>
  );
}