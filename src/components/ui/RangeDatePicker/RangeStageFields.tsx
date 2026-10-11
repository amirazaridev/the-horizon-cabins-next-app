"use client";

import { CalendarDays, ChevronLeft } from "lucide-react";

import { formatJalaliDate } from "./dates";
import type { DateRange, RangeStage } from "./types";

const STAGE_HINTS: Record<RangeStage, string> = {
  from: "روز ورود را از تقویم انتخاب کنید.",
  to: "حالا روز خروج را انتخاب کنید.",
  done: "بازه انتخاب شد؛ می‌توانید تغییرش دهید.",
};

type Props = {
  value: DateRange;
  activeStage: RangeStage;
};

/**
 * دو فیلد «ورود/خروج» بالای تقویم + راهنمای مرحله‌ی فعلی.
 *
 * ⚠️ این بلوک پیش‌تر داخل `RangeDatePicker` بود و با منطق تقویم/نرمال‌سازی
 * بازه قاطی شده بود؛ حالا فقط نمایش است.
 */
export default function RangeStageFields({ value, activeStage }: Props) {
  const stages = [
    {
      key: "from" as const,
      label: "تاریخ ورود",
      date: value.from,
      active: activeStage === "from",
    },
    {
      key: "to" as const,
      label: "تاریخ خروج",
      date: value.to,
      active: activeStage === "to",
    },
  ];

  return (
    <>
      {/* دو فیلد بالای تقویم: ورود و خروج که هم‌زمان با تقویم به‌روز می‌شوند */}
      <div className="grid grid-cols-2 gap-3">
        {stages.map((stage) => {
          const label = formatJalaliDate(stage.date);

          return (
            <div
              key={stage.key}
              data-active={stage.active}
              className={`rounded-2xl border px-4 py-3 transition-colors ${
                stage.active
                  ? "border-primary-400 bg-primary-400/10"
                  : "border-foreground/10 bg-background-2"
              }`}
            >
              <span className="text-text-gray flex items-center gap-1.5 text-xs font-medium">
                <CalendarDays className="size-3.5" />
                {stage.label}
              </span>
              <span
                className={`mt-1 block text-sm font-bold ${
                  label ? "text-text" : "text-text-gray/60"
                }`}
              >
                {label ?? "انتخاب کنید"}
              </span>
            </div>
          );
        })}
      </div>

      {/* راهنمای کوتاه مرحله فعلی */}
      <p className="text-text-gray -mb-1 flex items-center gap-1.5 text-xs">
        <ChevronLeft className="text-primary-400 size-3.5" />
        {STAGE_HINTS[activeStage]}
      </p>
    </>
  );
}
