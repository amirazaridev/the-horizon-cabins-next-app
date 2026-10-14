import { apiFetch } from "@/libs/api/apiFetch";
import type { ApiResponse } from "@/types/api-response";
import type { CabinCalendarDay } from "../types/cabin-booking.types";

export type CabinPriceCalendar = {
  cabinId: number;
  /** روزهای پنجره‌ی تقویم، صعودی بر اساس تاریخ. */
  days: CabinCalendarDay[];
};

/** شکل خام پاسخ بک‌اند: تاریخ‌ها ISO datetime هستند (نه کلید `YYYY-MM-DD`). */
type ApiCalendar = {
  cabinId: number;
  days: (Omit<CabinCalendarDay, "date"> & { date: string })[];
};

export async function getCabinPriceCalendar(
  cabinId: number,
): Promise<CabinPriceCalendar | null> {
  try {
    const res = await apiFetch(`cabins/${cabinId}/price-calendar`, {
      cache: "force-cache",
      next: { revalidate: 300, tags: [`cabin-price-calendar-${cabinId}`] },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as ApiResponse<"calendar", ApiCalendar>;
    if (json.status !== "success") return null;

    return {
      cabinId: json.data.calendar.cabinId,
      days: (json.data.calendar.days ?? []).map((day) => ({
        ...day,
        // ستون `@db.Date` با زمان `00:00:00Z` می‌آید؛ فقط بخش تاریخ لازم است.
        date: day.date.slice(0, 10),
      })),
    };
  } catch {
    return null;
  }
}
