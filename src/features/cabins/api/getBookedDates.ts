import { apiFetch } from "@/libs/api/apiFetch";
import type { ApiResponse } from "@/types/api-response";
import type { BookedRange } from "../types/cabin-booking.types";

/**
 * بازه‌های رزروشده‌ی یک کابین را می‌خواند
 * (`GET /bookings/cabin/:id/booked-dates` — عمومی).
 *
 * ⚠️ عمداً `no-store` است: موجودبودن تاریخ لحظه‌ای است و کش‌کردنش باعث
 * می‌شود کاربر روزی را آزاد ببیند که دیگر آزاد نیست.
 *
 * ⚠️ آرایه‌ی خالی یعنی «هیچ روزی رزرو نشده» یا «اندپوینت در دسترس نبود»؛ در
 * هر دو حالت تقویم بدون روز غیرفعال کار می‌کند و اعتبارسنجی نهایی در سرور
 * انجام می‌شود.
 */
export async function getBookedDates(cabinId: number): Promise<BookedRange[]> {
  try {
    const res = await apiFetch(`bookings/cabin/${cabinId}/booked-dates`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const json = (await res.json()) as ApiResponse<"bookedDates", BookedRange[]>;
    if (json.status !== "success") return [];

    return (json.data.bookedDates ?? []).map((range) => ({
      startDate: range.startDate.slice(0, 10),
      endDate: range.endDate.slice(0, 10),
    }));
  } catch {
    return [];
  }
}
