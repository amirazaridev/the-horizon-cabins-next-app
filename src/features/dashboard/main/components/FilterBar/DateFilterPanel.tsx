"use client";

import { useState } from "react";
import { startOfDay } from "date-fns";
import { Calendar, CalendarDays, CalendarRange } from "lucide-react";

import Tabs from "@/components/ui/Tabs";
import Button from "@/components/ui/Button";
import DateRangeFilter from "./DateRangeFilter";
import MonthRangeSlider from "./MonthRangeSlider";
import YearRangeSlider from "./YearRangeSlider";
import {
  formatDateKey,
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
 * محتوای کارت فیلتر تاریخ: سه تب روز / ماه / سال + دکمه اعمال
 * انتخاب‌ها پیش‌نویس (draft) می‌مانند تا «اعمال» زده شود
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

  return (
    <div className="flex flex-col gap-4">
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
              <DateRangeFilter
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
              <MonthRangeSlider
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
