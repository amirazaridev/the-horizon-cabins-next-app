/**
 * lib/pagination.ts
 *
 * توابع خالص و بدون وابستگی به React — قابل استفاده هم در Server Component ها
 * و هم هر جای دیگه (بدون نیاز به 'use client').
 */

import { DEFAULT_CABINS_LIMIT, MAX_CABINS_LIMIT } from "@/constants/cabins";

export type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
};

export type SearchParamsInput =
  Record<string, string | string[] | undefined> | URLSearchParams | undefined;

const DOTS = "dots" as const;

export function parseLimitParam(spLimit: string | string[] | undefined) {
  const rawLimit = Array.isArray(spLimit) ? spLimit[0] : spLimit;
  const parsedLimit = Number(rawLimit);
  const limit =
    Number.isInteger(parsedLimit) && parsedLimit > 0
      ? Math.min(parsedLimit, MAX_CABINS_LIMIT)
      : DEFAULT_CABINS_LIMIT;
  return limit;
}

// export function parsePaginationParams(searchParams){

// }
/**
 * یک صفحهٔ خاص را به query string فعلی اضافه می‌کند و بقیهٔ پارامترها
 * (سرچ، سورت، فیلتر و ...) را دست‌نخورده نگه می‌دارد.
 *
 * مثال: buildPageUrl('/admin/bookings', { status: 'confirmed' }, 3)
 *   => '/admin/bookings?status=confirmed&page=3'
 */
export function buildPageUrl(
  basePath: string,
  searchParams: SearchParamsInput,
  page: number,
  pageParamName = "page",
): string {
  const params = new URLSearchParams();

  if (searchParams instanceof URLSearchParams) {
    searchParams.forEach((value, key) => {
      if (key !== pageParamName) params.append(key, value);
    });
  } else if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined || key === pageParamName) continue;
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    }
  }

  params.set(pageParamName, String(page));

  return `${basePath}?${params.toString()}`;
}

/**
 * شمارهٔ صفحه را با اعتبارسنجی از searchParams می‌خواند — همیشه یک عدد
 * معتبر و حداقل ۱ برمی‌گرداند (ورودی خراب/منفی/غایب => صفحه ۱).
 */
export function parsePageParam(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  pageParamName = "page",
): number {
  const raw = searchParams?.[pageParamName];
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = Number(value);

  if (!value || Number.isNaN(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

/**
 * لیست شماره‌صفحه‌ها برای رندر را می‌سازد، با «...» برای بازه‌های بلند.
 * نمونه خروجی برای currentPage=5, totalPages=20, siblingCount=1:
 *   [1, 'dots', 4, 5, 6, 'dots', 20]
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): (number | typeof DOTS)[] {
  const totalSlots = siblingCount * 2 + 5;

  if (totalPages <= totalSlots) {
    return range(1, totalPages);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftCount = 3 + siblingCount * 2;
    return [...range(1, leftCount), DOTS, totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightCount = 3 + siblingCount * 2;
    return [1, DOTS, ...range(totalPages - rightCount + 1, totalPages)];
  }

  return [1, DOTS, ...range(leftSibling, rightSibling), DOTS, totalPages];
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
