import type { ReactNode } from "react";

/** ترازبندی محتوا در ستون. */
export type TableAlign = "start" | "end" | "center";

export type TableSortDirection = "asc" | "desc";

export interface TableSortState {
  key: string;
  direction: TableSortDirection;
}

/**
 * تعریف یک ستون جدول.
 *
 * ⚠️ چون `render` یک تابع است، جدول فقط داخل **کلاینت‌کامپوننت** قابل
 * استفاده است (توابع از مرز سرور→کلاینت رد نمی‌شوند).
 */
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
  /**
   * مقدار مرتب‌سازی — اگر داده شود ستون **مرتب‌شدنی** می‌شود.
   * `null` همیشه در انتهای لیست قرار می‌گیرد.
   */
  sortValue?: (row: T) => string | number | null;
  /** محتوای سلول. */
  render: (row: T) => ReactNode;
}
