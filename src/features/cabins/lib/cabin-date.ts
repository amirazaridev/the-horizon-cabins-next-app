import { formatJalaliDate } from "@/components/ui/RangeDatePicker";

/** مقدار تاریخ سفر در URL (قالب yyyy-MM-dd، مثل سرچ لندینگ) */
export type CabinDateValue = {
  checkIn: string | null;
  checkOut: string | null;
};

const PARAM_RE = /^\d{4}-\d{2}-\d{2}$/;

/** پارس امن پارامتر تاریخ؛ نامعتبر یعنی null */
export function parseDateParam(value: string | null): Date | null {
  if (!value || !PARAM_RE.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const valid =
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d;
  return valid ? date : null;
}

/** تبدیل Date به قالب URL (بدون شیفت تایم‌زون) */
export function formatDateParam(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** لیبل فارسی بازه تاریخ برای روی دکمه فیلتر؛ خالی یعنی undefined */
export function formatDateRangeLabel(
  checkIn: string | null,
  checkOut: string | null,
): string | undefined {
  const from = parseDateParam(checkIn);
  const to = parseDateParam(checkOut);
  const fromLabel = from ? (formatJalaliDate(from) ?? undefined) : undefined;
  const toLabel = to ? (formatJalaliDate(to) ?? undefined) : undefined;
  if (fromLabel && toLabel) return `${fromLabel} تا ${toLabel}`;
  return fromLabel ?? toLabel;
}
