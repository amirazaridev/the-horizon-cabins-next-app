// ============================================================================
// useDashboardFilters — هوک فیلترهای داشبورد
// ============================================================================
"use client";

import { useSearchParams } from "next/navigation";
import { subDays, parseISO } from "date-fns";
import { useMemo, useTransition } from "react";

import {
  ALL,
  BOOKINGS,
  CABINS,
  DEFAULT_RANGE_DAYS,
  PARAM_CITY,
  PARAM_FROM,
  PARAM_STATUS,
  PARAM_TO,
  calcGrowth,
  filterBookingsByRange,
  filterPrevBookings,
  type Booking,
  type Cabin,
} from "../data/mock-data";

export {
  ALL,
  DEFAULT_RANGE_DAYS,
  PARAM_FROM,
  PARAM_TO,
  PARAM_CITY,
  PARAM_STATUS,
  calcGrowth,
};

export interface DashboardFilters {
  from: Date;
  to: Date;
  city: string;
  status: string;
  numDays: number;
}

export interface UseDashboardFiltersResult {
  filters: DashboardFilters;
  bookings: Booking[];
  prevBookings: Booking[];
  activeCabins: Cabin[];
}

export function useDashboardFilters(): UseDashboardFiltersResult {
  const searchParams = useSearchParams();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const fromParam = searchParams.get(PARAM_FROM);
  const toParam = searchParams.get(PARAM_TO);
  const city = searchParams.get(PARAM_CITY) ?? ALL;
  const status = searchParams.get(PARAM_STATUS) ?? ALL;

  const from = fromParam
    ? parseISO(fromParam)
    : subDays(today, DEFAULT_RANGE_DAYS - 1);
  const to = toParam ? parseISO(toParam) : today;

  const numDays = Math.max(
    1,
    Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1,
  );

  const bookings = useMemo(() => {
    let list = filterBookingsByRange(BOOKINGS, from, to);

    if (city !== ALL) {
      const cityCabinIds = new Set(
        CABINS.filter((c) => c.city === city).map((c) => c.id),
      );
      list = list.filter((b) => cityCabinIds.has(b.cabinId));
    }

    if (status !== ALL) {
      list = list.filter((b) => b.status === status);
    }

    return list;
  }, [from, to, city, status]);

  const prevBookings = useMemo(
    () => filterPrevBookings(BOOKINGS, from, to),
    [from, to],
  );

  const activeCabins = useMemo(
    () => (city === ALL ? CABINS : CABINS.filter((c) => c.city === city)),
    [city],
  );

  return {
    filters: { from, to, city, status, numDays },
    bookings,
    prevBookings,
    activeCabins,
  };
}
