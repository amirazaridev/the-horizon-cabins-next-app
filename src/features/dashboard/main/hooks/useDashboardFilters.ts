"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

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
} from "../data/mock-data";
import {
  resolveDashboardDateRange,
  type DateRangePreset,
} from "../lib/date-range";
import type { Cabin } from "@/features/cabins/lib/data-service";

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
  preset: DateRangePreset;
}

export interface UseDashboardFiltersResult {
  filters: DashboardFilters;
  bookings: Booking[];
  prevBookings: Booking[];
  activeCabins: Cabin[];
}

export function useDashboardFilters(): UseDashboardFiltersResult {
  const searchParams = useSearchParams();

  const { from, to, preset } = useMemo(
    () => resolveDashboardDateRange(searchParams),
    [searchParams],
  );

  const city = searchParams.get(PARAM_CITY) ?? ALL;
  const status = searchParams.get(PARAM_STATUS) ?? ALL;

  const numDays = Math.max(
    1,
    Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1,
  );

  const bookings = useMemo(() => {
    let list = filterBookingsByRange(BOOKINGS, from, to);

    if (city !== ALL) {
      const cityCabinIds = new Set(
        CABINS.filter((cabin) => cabin.city?.name === city).map(
          (cabin) => cabin.id,
        ),
      );

      list = list.filter((booking) => cityCabinIds.has(booking.cabinId));
    }

    if (status !== ALL) {
      list = list.filter((booking) => booking.status === status);
    }

    return list;
  }, [from, to, city, status]);

  const prevBookings = useMemo(
    () => filterPrevBookings(BOOKINGS, from, to),
    [from, to],
  );

  const activeCabins = useMemo(
    () =>
      city === ALL
        ? CABINS
        : CABINS.filter((cabin) => cabin.city?.name === city),
    [city],
  );

  return {
    filters: {
      from,
      to,
      city,
      status,
      numDays,
      preset,
    },
    bookings,
    prevBookings,
    activeCabins,
  };
}