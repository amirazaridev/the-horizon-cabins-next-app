import type { LastMinuteCabin } from "@/features/cabins/types/cabin.types";

// * نزدیک‌ترین مهلت انقضا میان پیشنهادهای لحظه‌آخری.
export function nearestExpiry(cabins: LastMinuteCabin[]): string | undefined {
  const deadlines = cabins
    .map((cabin) => cabin.expiresAt)
    .filter((value): value is string => Boolean(value))
    .filter((value) => Number.isFinite(Date.parse(value)));

  if (!deadlines.length) return undefined;

  return deadlines.reduce((earliest, current) =>
    Date.parse(current) < Date.parse(earliest) ? current : earliest,
  );
}
