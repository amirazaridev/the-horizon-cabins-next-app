// components/ui/pagination.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  buildPageUrl,
  getPaginationRange,
  type SearchParamsInput,
} from "@/libs/utils/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** مسیر صفحه، مثل '/cabins' یا '/admin/bookings' */
  basePath: string;
  /** searchParams فعلی صفحه — برای حفظ فیلترهای دیگر (سرچ، سورت و ...) */
  searchParams?: SearchParamsInput;
  /** تعداد صفحات کناری فعلی که همیشه نمایش داده می‌شوند */
  siblingCount?: number;
  /** اگر جایی از یک کلید دیگر به‌جای 'page' استفاده می‌کنی */
  pageParamName?: string;
  dir?: "rtl" | "ltr";
  /** اسکرول به بالای صفحه هنگام تغییر صفحه — برای جدول‌های ادمین معمولاً false بهتر است */
  scroll?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
  siblingCount = 1,
  pageParamName = "page",
  dir = "rtl",
  scroll = false,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPaginationRange(currentPage, totalPages, siblingCount);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  const PrevIcon = dir === "rtl" ? ChevronRight : ChevronLeft;
  const NextIcon = dir === "rtl" ? ChevronLeft : ChevronRight;

  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <nav
      dir={dir}
      aria-label="صفحه‌بندی"
      className={`flex items-center gap-1.5 ${className}`}
    >
      <PaginationArrow
        href={buildPageUrl(basePath, searchParams, currentPage - 1, pageParamName)}
        disabled={isFirst}
        scroll={scroll}
        label="صفحه قبلی"
        focusRing={focusRing}
      >
        <PrevIcon className="size-4" />
      </PaginationArrow>

      {pages.map((item, index) =>
        item === "dots" ? (
          <span
            key={`dots-${index}`}
            className="flex h-9 w-9 select-none items-center justify-center text-text-gray"
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={buildPageUrl(basePath, searchParams, item, pageParamName)}
            scroll={scroll}
            aria-current={item === currentPage ? "page" : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all active:scale-95 ${focusRing} ${
              item === currentPage
                ? "bg-primary-400 font-extrabold text-[#1c1a16] shadow-[0_4px_14px_-4px] shadow-primary-400/50 dark:text-[#0a0d10]"
                : "text-text hover:bg-primary-400/15"
            }`}
          >
            {item}
          </Link>
        )
      )}

      <PaginationArrow
        href={buildPageUrl(basePath, searchParams, currentPage + 1, pageParamName)}
        disabled={isLast}
        scroll={scroll}
        label="صفحه بعدی"
        focusRing={focusRing}
      >
        <NextIcon className="size-4" />
      </PaginationArrow>
    </nav>
  );
}

function PaginationArrow({
  href,
  disabled,
  scroll,
  label,
  focusRing,
  children,
}: {
  href: string;
  disabled: boolean;
  scroll: boolean;
  label: string;
  focusRing: string;
  children: ReactNode;
}) {
  const base = "flex h-9 w-9 items-center justify-center rounded-full border transition-all";

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        aria-label={label}
        className={`${base} cursor-not-allowed border-border text-text-gray/50`}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      scroll={scroll}
      aria-label={label}
      className={`${base} border-border text-text hover:bg-primary-400/15 active:scale-95 ${focusRing}`}
    >
      {children}
    </Link>
  );
}