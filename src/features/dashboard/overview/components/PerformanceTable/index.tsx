"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";

import CardDashContainer from "@/components/ui/CardDashContainer";
import { WidgetEmpty } from "../WidgetStates";
import {
  cabinPerformance,
  cityPerformance,
  topBottom,
  type PerformanceRow,
} from "../../lib/metrics/analytics";
import {
  formatCount,
  formatDelta,
  formatPercent,
  formatToman,
  formatTomanShort,
} from "../../lib/metrics/format";
import type { DateRange } from "../../lib/metrics/range";
import type {
  DashboardBooking,
  DashboardCabin,
} from "../../types/dashboard.types";

/* ==========================================================================
   پیکربندی ستون‌ها — تک‌منبع (بدون عدد جادویی در JSX)
   ========================================================================== */

type SortKey =
  | "label"
  | "revenue"
  | "occupancy"
  | "adr"
  | "revPar"
  | "bookingCount"
  | "revenueDelta";

type SortDirection = "asc" | "desc";

interface ColumnDef {
  key: SortKey;
  title: string;
  /** آیا مرتب‌سازی‌پذیر است؟ (ستون برچسب مرتب‌سازی نمی‌شود) */
  sortable: boolean;
  align: "start" | "end";
  /** قالب‌بندی مقدار ستون */
  format: (row: PerformanceRow) => string;
  /** رنگ‌بندی اختیاری متن */
  tone?: (row: PerformanceRow) => string;
}

const PERCENT_TONE = "text-text";
const DELTA_POSITIVE = "text-emerald-600 dark:text-emerald-400";
const DELTA_NEGATIVE = "text-rose-600 dark:text-rose-400";

const COLUMNS: readonly ColumnDef[] = [
  {
    key: "label",
    title: "نام",
    sortable: false,
    align: "start",
    format: (row) => row.label,
  },
  {
    key: "revenue",
    title: "درآمد",
    sortable: true,
    align: "end",
    format: (row) => `${formatTomanShort(row.revenue)} تومان`,
  },
  {
    key: "revenueDelta",
    title: "Δ درآمد",
    sortable: true,
    align: "end",
    format: (row) => formatDeltaCell(row.revenueDelta),
    tone: (row) =>
      row.revenueDelta === null
        ? "text-text-gray"
        : row.revenueDelta >= 0
          ? DELTA_POSITIVE
          : DELTA_NEGATIVE,
  },
  {
    key: "occupancy",
    title: "اشغال",
    sortable: true,
    align: "end",
    format: (row) => formatPercent(row.occupancy),
    tone: () => PERCENT_TONE,
  },
  {
    key: "adr",
    title: "ADR",
    sortable: true,
    align: "end",
    format: (row) =>
      row.adr === null ? "—" : `${formatTomanShort(Math.round(row.adr))}`,
  },
  {
    key: "revPar",
    title: "RevPAR",
    sortable: true,
    align: "end",
    format: (row) =>
      row.revPar === null ? "—" : `${formatTomanShort(Math.round(row.revPar))}`,
  },
  {
    key: "bookingCount",
    title: "رزرو",
    sortable: true,
    align: "end",
    format: (row) => formatCount(row.bookingCount),
  },
];

/* ==========================================================================
   کامپوننت
   ========================================================================== */

type EntityMode = "cabin" | "city";
type RangeMode = "all" | "top5" | "bottom5";

interface PerformanceTableProps {
  bookings: DashboardBooking[];
  cabins: DashboardCabin[];
  range: DateRange;
  compareRange: DateRange | null;
}

const ENTITY_TABS: readonly { value: EntityMode; label: string }[] = [
  { value: "cabin", label: "اقامتگاه" },
  { value: "city", label: "شهر" },
];

const RANGE_TABS: readonly { value: RangeMode; label: string }[] = [
  { value: "all", label: "همه" },
  { value: "top5", label: "۵ برتر" },
  { value: "bottom5", label: "۵ ضعیف" },
];

const TOP_N = 5;

/**
 * جدول عملکرد اقامتگاه/شهر — مرتب‌ساز، با نمای Top5/Bottom5.
 *
 * ⭐ همه‌ی اعداد از `cabinPerformance`/`cityPerformance` می‌آیند؛ این
 * کامپوننت فقط **مرتب می‌کند و نشان می‌دهد**، هیچ محاسبه‌ای ندارد.
 */
export default function PerformanceTable({
  bookings,
  cabins,
  range,
  compareRange,
}: PerformanceTableProps) {
  const [entity, setEntity] = useState<EntityMode>("cabin");
  const [rangeMode, setRangeMode] = useState<RangeMode>("all");
  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [direction, setDirection] = useState<SortDirection>("desc");

  const rows = useMemo<PerformanceRow[]>(
    () =>
      entity === "cabin"
        ? cabinPerformance(bookings, cabins, range, compareRange)
        : cityPerformance(bookings, cabins, range, compareRange),
    [entity, bookings, cabins, range, compareRange],
  );

  /** اعمال نمای Top5/Bottom5 روی نتیجه‌ی مرتب‌شده بر اساس درآمد. */
  const scopedRows = useMemo<PerformanceRow[]>(() => {
    if (rangeMode === "all") return rows;

    // `topBottom` انتظار لیست مرتب‌شده بر اساس معیار را دارد.
    const sortedByRevenue = [...rows].sort((a, b) => b.revenue - a.revenue);
    const { top, bottom } = topBottom(sortedByRevenue, TOP_N);
    return rangeMode === "top5" ? top : bottom;
  }, [rows, rangeMode]);

  const sortedRows = useMemo<PerformanceRow[]>(() => {
    const sorted = [...scopedRows].sort((a, b) =>
      compareRows(a, b, sortKey),
    );
    return direction === "asc" ? sorted : sorted.reverse();
  }, [scopedRows, sortKey, direction]);

  const handleSort = (key: SortKey) => {
    if (key === "label") return;
    if (key === sortKey) {
      setDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection("desc");
    }
  };

  return (
    <CardDashContainer className="flex w-full flex-col gap-5 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-text text-lg font-semibold">عملکرد</h3>
          <p className="text-text-gray text-sm">
            مقایسه‌ی اقامتگاه‌ها و شهرها در بازهٔ انتخابی
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl
            options={ENTITY_TABS}
            value={entity}
            onChange={setEntity}
            ariaLabel="نوع عملکرد"
          />
          <SegmentedControl
            options={RANGE_TABS}
            value={rangeMode}
            onChange={setRangeMode}
            ariaLabel="دامنه‌ی عملکرد"
          />
        </div>
      </div>

      {sortedRows.length === 0 ? (
        <WidgetEmpty
          label="برای این فیلترها داده‌ای وجود ندارد"
          description="بازهٔ تاریخ یا فیلترهای وضعیت/شهر را تغییر دهید."
        />
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">
              عملکرد {entity === "cabin" ? "اقامتگاه‌ها" : "شهرها"} در بازهٔ
              انتخابی، شامل درآمد، تغییر درآمد، نرخ اشغال، ADR، RevPAR و
              تعداد رزرو. ستون‌های مرتب‌سازی‌پذیر با Enter یا Space مرتب
              می‌شوند.
            </caption>
            <thead>
              <tr className="border-border border-b">
                {COLUMNS.map((column) => {
                  const isActive = sortKey === column.key;
                  return (
                    <th
                      key={column.key}
                      scope="col"
                      aria-sort={
                        column.sortable
                          ? isActive
                            ? direction === "asc"
                              ? "ascending"
                              : "descending"
                            : "none"
                          : undefined
                      }
                      className={`text-text-gray px-2 py-2.5 font-medium whitespace-nowrap ${
                        column.align === "end" ? "text-left" : "text-right"
                      }`}
                    >
                      {column.sortable ? (
                        <button
                          type="button"
                          onClick={() => handleSort(column.key)}
                          className="hover:text-text focus-visible:ring-primary-400/60 inline-flex cursor-pointer items-center gap-1 rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                          aria-label={`مرتب‌سازی بر اساس ${column.title}${
                            isActive
                              ? direction === "asc"
                                ? " — صعودی"
                                : " — نزولی"
                              : ""
                          }`}
                        >
                          {column.title}
                          <SortIndicator
                            active={isActive}
                            direction={direction}
                          />
                        </button>
                      ) : (
                        column.title
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-border/60 hover:bg-surface-raised/60 border-b transition-colors last:border-0"
                >
                  {COLUMNS.map((column) => (
                    <td
                      key={column.key}
                      className={`text-text px-2 py-2.5 tabular-nums whitespace-nowrap ${
                        column.align === "end" ? "text-left" : "text-right"
                      } ${column.key === "label" ? "font-medium" : ""} ${
                        column.tone ? column.tone(row) : ""
                      }`}
                      title={
                        column.key === "revenue"
                          ? `${formatToman(row.revenue)} تومان`
                          : undefined
                      }
                    >
                      {column.key === "label" ? (
                        <span className="flex items-center gap-2">
                          <span className="text-text">{row.label}</span>
                        </span>
                      ) : (
                        column.format(row)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-text-gray text-xs">
        «Δ درآمد» نسبت به دوره‌ی مقایسه است؛ «—» یعنی مبنای مقایسه وجود ندارد.
      </p>
    </CardDashContainer>
  );
}

/* ==========================================================================
   کمکی‌ها
   ========================================================================== */

function compareRows(a: PerformanceRow, b: PerformanceRow, key: SortKey): number {
  if (key === "label") return a.label.localeCompare(b.label, "fa");

  // null همیشه آخر بیاید (برای نزولی) / اول (برای صعودی — با reverse)
  const an = a[key] === null ? Number.NEGATIVE_INFINITY : (a[key] as number);
  const bn = b[key] === null ? Number.NEGATIVE_INFINITY : (b[key] as number);
  return an - bn;
}

function formatDeltaCell(delta: number | null): string {
  return formatDelta(delta);
}

function SortIndicator({
  active,
  direction,
}: {
  active: boolean;
  direction: SortDirection;
}) {
  if (!active) {
    return <ChevronDown className="size-3 opacity-0" aria-hidden="true" />;
  }
  return direction === "asc" ? (
    <ArrowUp className="size-3.5" aria-hidden="true" />
  ) : (
    <ArrowDown className="size-3.5" aria-hidden="true" />
  );
}

interface SegmentedControlProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="border-border bg-background inline-flex items-center gap-1 rounded-full border p-1"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`focus-visible:ring-primary-400/60 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none ${
              active
                ? "bg-primary-400 text-black"
                : "text-text-gray hover:text-text"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
