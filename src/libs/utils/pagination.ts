/**
 * منطق خالص رندر بازه‌ی شماره‌صفحه.
 *
 * بدون وابستگی به React — قابل استفاده هم در Server Component ها و هم هر
 * جای دیگر (بدون نیاز به `'use client'`).
 *
 * ⚠️ توابع مربوط به URL صفحه‌بندی (`parsePageParam`, `parseLimitParam`,
 * `buildPageUrl`) به `url-params.ts` منتقل شدند.
 *
 * ⚠️ دو مورد حذف شد: (۱) بلوک کامنت‌شده‌ی `parsePaginationParams`،
 * (۲) تایپ `PaginationMeta` که تکراری و بی‌استفاده بود — منبع رسمی آن
 * `@/types/api-response` است.
 */

const DOTS = "dots" as const;

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
