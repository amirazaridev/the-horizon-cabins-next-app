"use client";

import { useMemo } from "react";

import CardDashContainer from "@/components/ui/CardDashContainer";
import { WidgetEmpty } from "../WidgetStates";
import { statusDistribution } from "../../lib/metrics/analytics";
import { formatCount, formatPercent } from "../../lib/metrics/format";
import type { DateRange } from "../../lib/metrics/range";
import { CHART_COLORS, STATUS_COLORS } from "../../config/chart-theme";
import {
  BOOKING_STATUS_LABELS,
  type DashboardBooking,
} from "../../types/dashboard.types";

interface StatusDistributionChartProps {
  bookings: DashboardBooking[];
  range: DateRange;
}

/**
 * توزیع وضعیت رزروها — بر اساس **زمان ثبت** (`createdAt`) داخل بازه.
 *
 * ⚠️ مبنای `createdAt` است نه `startDate` — چون این نمودار «چه رزروهایی
 * در این بازه ثبت شدند» را نشان می‌دهد، نه «چه اقامت‌هایی در بازه بودند».
 */
export default function StatusDistributionChart({
  bookings,
  range,
}: StatusDistributionChartProps) {
  const rows = useMemo(
    () => statusDistribution(bookings, range),
    [bookings, range],
  );

  const total = useMemo(
    () => rows.reduce((sum, row) => sum + row.count, 0),
    [rows],
  );

  return (
    <CardDashContainer className="flex h-full w-full flex-col gap-5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-text font-semibold">وضعیت رزروها</h3>
          <p className="text-text-gray text-sm">
            بر اساس زمان ثبت در بازه
          </p>
        </div>
        {total > 0 && (
          <div className="shrink-0 text-left">
            <p className="text-text text-lg font-bold tabular-nums">
              {formatCount(total)}
            </p>
            <p className="text-text-gray text-xs">رزرو ثبت‌شده</p>
          </div>
        )}
      </div>

      {rows.length === 0 ? (
        <WidgetEmpty
          label="رزروی در این بازه ثبت نشده"
          description="توزیع وضعیت بر اساس زمان ثبت رزرو محاسبه می‌شود."
          className="h-[200px]"
        />
      ) : (
        <>
          <p className="sr-only">
            توزیع وضعیت {formatCount(total)} رزرو ثبت‌شده:{" "}
            {rows
              .map(
                (row) =>
                  `${BOOKING_STATUS_LABELS[row.status]} ${formatCount(row.count)} رزرو (${formatPercent(row.share)})`,
              )
              .join("، ")}
            .
          </p>
          <ul className="flex flex-col gap-3.5">
          {rows.map((row) => (
            <li key={row.status} className="flex items-center gap-3">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: STATUS_COLORS[row.status] ?? CHART_COLORS.grid,
                }}
              />
              <span className="text-text flex-1 text-sm">
                {BOOKING_STATUS_LABELS[row.status]}
              </span>
              <span className="text-text-gray text-xs tabular-nums">
                {formatCount(row.count)}
              </span>
              <span className="text-text w-12 text-left text-sm font-semibold tabular-nums">
                {formatPercent(row.share)}
              </span>
            </li>
          ))}
        </ul>
        </>
      )}
    </CardDashContainer>
  );
}
