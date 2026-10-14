import type { ReactNode } from "react";

/** ترازبندی محتوا در ستون. */
export type TableAlign = "start" | "end" | "center";

export type TableSortDirection = "asc" | "desc";

export interface TableSortState {
  key: string;
  direction: TableSortDirection;
}

export interface TableColumn<T> {
  /** شناسه‌ی یکتا — برای `key` و وضعیت مرتب‌سازی. */
  key: string;
  /** محتوای سرستون. */
  header: ReactNode;
  align?: TableAlign;
  /** کلاس سلول (عرض/چیدمان) — مثل `w-40` یا `min-w-48`. */
  className?: string;
  /** کلاس سرستون. */
  headerClassName?: string;
  /** پنهان‌کردن ستون در صفحه‌های کوچک (`hidden md:table-cell`). */
  hideOnMobile?: boolean;
  sortValue?: (row: T) => string | number | null;
  /** محتوای سلول. */
  render: (row: T) => ReactNode;
}
