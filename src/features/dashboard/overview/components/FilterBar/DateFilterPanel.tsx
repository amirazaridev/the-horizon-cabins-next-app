"use client";

import { useState } from "react";
import { startOfDay } from "date-fns";
import { Calendar, CalendarDays, CalendarRange, Zap } from "lucide-react";

import Tabs from "@/components/ui/Tabs";
import Button from "@/components/ui/Button";
import DayRangePicker from "./DayRangePicker";
import MonthRangePicker from "./MonthRangePicker";
import YearRangeSlider from "./YearRangeSlider";
import {
  QUICK_RANGE_PRESETS,
  formatDateKey,
  getPresetDateRangeFromDays,
  parseDateParam,
  type DateFilterTab,
  type DateFilterValue,
} from "../../lib/date-range";

interface DateFilterPanelProps {
  /** مقدار فعلی (از URL) — فقط موقع باز شدن پنل خوانده می‌شود */
  initial: DateFilterValue;
  onApply: (value: DateFilterValue) => void;
}

/**
 * محتوای کارت فیلتر تاریخ: دکمه‌های سریع + سه تب روز / ماه / سال + دکمه اعمال
 * انتخاب‌ها پیش‌نویس (draft) می‌مانند تا «اعمال» زده شود،
 * ولی دکمه‌های سریع مستقیم اعمال و بسته می‌شوند
 */
export default function DateFilterPanel({
  initial,
  onApply,
}: DateFilterPanelProps) {
  const [tab, setTab] = useState<DateFilterTab>(initial.tab);

  const [draft, setDraft] = useState(() => {
    const fallback = startOfDay(new Date());
    return {
      from: parseDateParam(initial.from) ?? fallback,
      to: parseDateParam(initial.to) ?? fallback,
    };
  });

  function handleDraftChange(from: Date, to: Date): void {
    setDraft((prev) =>
      prev.from.getTime() === from.getTime() &&
      prev.to.getTime() === to.getTime()
        ? prev
        : { from, to },
    );
  }

  function handleApply(): void {
    onApply({
      from: formatDateKey(draft.from),
      to: formatDateKey(draft.to),
      tab,
    });
  }

  function handleQuickPreset(days: number): void {
    const range = getPresetDateRangeFromDays(days);
    // اعمال خودکار با دقت روز + بستن پنل (onApply در FilterBar پنل را می‌بندد)
    onApply({
      from: formatDateKey(range.from),
      to: formatDateKey(range.to),
      tab: "day",
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* دسترسی سریع */}
      <div className="border-border bg-background rounded-2xl border p-3">
        <p className="text-text-gray mb-2 flex items-center gap-1.5 text-xs font-semibold">
          <Zap className="size-3.5" />
          دسترسی سریع
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {QUICK_RANGE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handleQuickPreset(preset.days)}
              className="border-border bg-surface text-text hover:border-primary-400 hover:bg-primary-400/10 hover:text-text rounded-xl border px-2 py-2 text-xs font-medium transition-colors active:scale-95"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <Tabs
        defaultValue={tab}
        onChange={(id) => setTab(id as DateFilterTab)}
        panelClassName="mt-4"
        items={[
          {
            id: "day",
            label: "روز",
            icon: <CalendarDays className="size-4" />,
            content: (
              <DayRangePicker
                from={draft.from}
                to={draft.to}
                onChange={handleDraftChange}
              />
            ),
          },
          {
            id: "month",
            label: "ماه",
            icon: <CalendarRange className="size-4" />,
            content: (
              <MonthRangePicker
                from={draft.from}
                to={draft.to}
                onChange={handleDraftChange}
              />
            ),
          },
          {
            id: "year",
            label: "سال",
            icon: <Calendar className="size-4" />,
            content: (
              <YearRangeSlider
                from={draft.from}
                to={draft.to}
                onChange={handleDraftChange}
              />
            ),
          },
        ]}
      />

      <Button
        type="button"
        variant="primary"
        size="md"
        shape="xl"
        fullWidth
        onClick={handleApply}
      >
        اعمال
      </Button>
    </div>
  );
}
