import type { DashboardBooking } from "../../../types/dashboard.types";
import { type DateRange } from "../range";
import { roomRevenue, adr } from "./revenue";
import {
  availableNights,
  occupancy,
  soldNights,
} from "./occupancy";
import {
  averageStay,
  bookingCount,
  cancellationRate,
  createdBookingCount,
} from "./guest";

/** مجموعه‌ی کامل KPIهای ردیف کارت‌ها. */
export interface KpiSnapshot {
  totalRevenue: number;
  bookingCount: number;
  occupancy: number | null;
  adr: number | null;
  cancellationRate: number | null;
  averageStay: number | null;
  soldNights: number;
  availableNights: number;
  createdCount: number;
}

export function computeKpis(
  bookings: readonly DashboardBooking[],
  cabinCount: number,
  range: DateRange,
): KpiSnapshot {
  return {
    totalRevenue: roomRevenue(bookings, range),
    bookingCount: bookingCount(bookings, range),
    occupancy: occupancy(bookings, cabinCount, range),
    adr: adr(bookings, range),
    cancellationRate: cancellationRate(bookings, range),
    averageStay: averageStay(bookings, range),
    soldNights: soldNights(bookings, range),
    availableNights: availableNights(cabinCount, range),
    createdCount: createdBookingCount(bookings, range),
  };
}
