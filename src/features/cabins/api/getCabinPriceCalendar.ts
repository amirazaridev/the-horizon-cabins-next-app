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

/**
 * تقویم قیمت یک کابین را می‌خواند (`GET /cabins/:id/price-calendar` — عمومی).
 *
 * ⚠️ این اندپوینت کل پنجره‌ی افق رزرو (پیش‌فرض ۱۲۰ روز) را یک‌جا برمی‌گرداند؛
 * پس یک درخواست برای پرکردن قیمتِ همه‌ی سلول‌های تقویم کافی است و لازم نیست
 * برای هر ماه درخواست جدا بزنیم.
 *
 * ⚠️ `null` یعنی «تقویم در دسترس نیست» (خطای شبکه/HTTP)؛ مصرف‌کننده باید
 * تقویم را بدون قیمت نمایش دهد، نه اینکه صفحه را بترکاند.
 */
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
