export const HORIZON_TIMEZONE = "Asia/Tehran";

export function todayInTehran(now: Date = new Date()): Date {
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: HORIZON_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now); // خروجی: 2026-10-10

  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(year, month - 1, day);
}
