const DOTS = "dots" as const;

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
