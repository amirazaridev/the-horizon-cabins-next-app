import { apiFetch } from "@/libs/api/apiFetch";
import type { ApiResponse } from "@/types/api-response";
import type { BookedRange } from "../types/cabin-booking.types";

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
