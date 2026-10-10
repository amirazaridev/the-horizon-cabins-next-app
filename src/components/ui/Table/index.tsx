"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import Skeleton from "../Skeleton";
import type {
  TableAlign,
  TableColumn,
  TableSortDirection,
  TableSortState,
} from "./types";

const ALIGN_CLASS: Record<TableAlign, string> = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  /** کلید یکتای هر ردیف. */
  rowKey: (row: T) => string | number;
  /** حالت بارگذاری — به‌جای ردیف‌ها، اسکلتون نشان می‌دهد. */
  loading?: boolean;
  /** تعداد ردیف‌های اسکلتون هنگام بارگذاری. */
  skeletonRows?: number;
  /** حالت خالی — یک ردیف تمام‌عرض با این محتوا. */
  emptyState?: ReactNode;
  /** کلیک روی ردیف. */
  onRowClick?: (row: T) => void;
  /** توضیح sr-only جدول (دسترس‌پذیری). */
  caption?: string;
  /** مرتب‌سازی اولیه (کلاینت‌ساید). */
  initialSort?: TableSortState;
  className?: string;
}

/**
 * جدول عمومی داشبورد — **قابل استفاده در چند بخش**.
 *
 * - ستون‌ها با `TableColumn` توصیف می‌شوند (بدون JSX تکراری در هر صفحه).
 * - مرتب‌سازی **کلاینت‌ساید** فقط روی ستون‌هایی که `sortValue` دارند فعال
 *   می‌شود؛ `null` همیشه آخر می‌آید.
 * - حالت‌های `loading`/`empty` استاندارد هستند.
 * - روی موبایل به‌صورت افقی اسکرول می‌شود و ستون‌های `hideOnMobile` پنهان‌اند.
 * - دسترس‌پذیری: `caption` (sr-only)، `scope="col"` و `aria-sort`.
 *
 * ⚠️ چون `columns` تابع `render` دارد، این کامپوننت فقط داخل کلاینت‌کامپوننت
 * قابل استفاده است.
 */
export default function Table<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  skeletonRows = 6,
  emptyState,
  onRowClick,
  caption,
  initialSort,
  className = "",
}: TableProps<T>): ReactNode {
  const [sort, setSort] = useState<TableSortState | null>(initialSort ?? null);

  const sortableKeys = useMemo(
    () => new Set(columns.filter((column) => column.sortValue).map((column) => column.key)),
    [columns],
  );

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const column = columns.find((item) => item.key === sort.key);
    if (!column?.sortValue) return rows;

    const compare = column.sortValue;
    const sorted = [...rows].sort((a, b) => {
      const av = compare(a);
      const bv = compare(b);
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      if (typeof av === "number" && typeof bv === "number") return av - bv;
      return String(av).localeCompare(String(bv), "fa");
    });

    return sort.direction === "asc" ? sorted : sorted.reverse();
  }, [rows, columns, sort]);

  const toggleSort = (key: string) => {
    setSort((previous) =>
      previous?.key === key
        ? { key, direction: previous.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "desc" },
    );
  };

  const cellVisibility = (column: TableColumn<T>) =>
    column.hideOnMobile ? "hidden md:table-cell" : "";

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-collapse text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}

        <thead>
          <tr className="border-border border-b">
            {columns.map((column) => {
              const sortable = sortableKeys.has(column.key);
              const isActive = sort?.key === column.key;

              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    sortable
                      ? isActive
                        ? sort.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                      : undefined
                  }
                  className={`text-text-gray px-3 py-3 text-xs font-semibold whitespace-nowrap ${
                    ALIGN_CLASS[column.align ?? "start"]
                  } ${cellVisibility(column)} ${column.headerClassName ?? ""}`}
                >
                  {sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column.key)}
                      className={`hover:text-text inline-flex cursor-pointer items-center gap-1 rounded-sm transition-colors ${FOCUS_RING}`}
                      aria-label={`مرتب‌سازی بر اساس ${typeof column.header === "string" ? column.header : column.key}`}
                    >
                      {column.header}
                      <SortIcon active={isActive} direction={sort?.direction ?? "desc"} />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <tr key={`skeleton-${rowIndex}`} className="border-border/60 border-b last:border-0">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-3 py-4 ${cellVisibility(column)}`}
                  >
                    <Skeleton className="h-4 w-full max-w-32 rounded-full" />
                  </td>
                ))}
              </tr>
            ))
          ) : sortedRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-2">
                {emptyState}
              </td>
            </tr>
          ) : (
            sortedRows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`border-border/60 border-b transition-colors last:border-0 ${
                  onRowClick
                    ? "hover:bg-surface-raised/60 cursor-pointer"
                    : "hover:bg-surface-raised/40"
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`text-text px-3 py-4 align-middle ${
                      ALIGN_CLASS[column.align ?? "start"]
                    } ${cellVisibility(column)} ${column.className ?? ""}`}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction: TableSortDirection;
}): ReactNode {
  if (!active) {
    return <ChevronsUpDown className="size-3.5 opacity-40" aria-hidden="true" />;
  }
  return direction === "asc" ? (
    <ArrowUp className="size-3.5" aria-hidden="true" />
  ) : (
    <ArrowDown className="size-3.5" aria-hidden="true" />
  );
}

export type { TableColumn, TableSortState, TableSortDirection, TableAlign } from "./types";
