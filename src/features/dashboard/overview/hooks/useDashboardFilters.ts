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
import type { Cabin } from "@/features/cabins/types/cabin.types";

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
  city: string[];
  status: string[];
  numDays: number;
  preset: DateRangePreset;
}

export interface UseDashboardFiltersResult {
  filters: DashboardFilters;
  bookings: Booking[];
  prevBookings: Booking[];
  activeCabins: Cabin[];
}
/** تبدیل پارامتر URL به آرایه‌ی مقادیر */
export function parseMultiParam(raw: string | null): string[] {
  if (!raw || raw === ALL) return [];
  return raw.split(",").filter(Boolean);
}

/** تبدیل آرایه به مقدار پارامتر URL */
export function serializeMultiParam(values: string[]): string | null {
  if (values.length === 0) return null;
  return values.join(",");
}

export function useDashboardFilters(): UseDashboardFiltersResult {
  const searchParams = useSearchParams();

  const { from, to, preset } = useMemo(
    () => resolveDashboardDateRange(searchParams),
    [searchParams],
  );

  const cities = parseMultiParam(searchParams.get(PARAM_CITY));
  const statuses = parseMultiParam(searchParams.get(PARAM_STATUS));

  const numDays = Math.max(
    1,
    Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1,
  );

  const bookings = useMemo(() => {
    let list = filterBookingsByRange(BOOKINGS, from, to);

    if (cities.length > 0) {
      const citySet = new Set(cities);
      const cityCabinIds = new Set(
        CABINS.filter((cabin) =>
          cabin.city?.name ? citySet.has(cabin.city.name) : false,
        ).map((cabin) => cabin.id),
      );

      list = list.filter((booking) => cityCabinIds.has(booking.cabinId));
    }

    if (statuses.length > 0) {
      const statusSet = new Set(statuses);
      list = list.filter((booking) => statusSet.has(booking.status));
    }

    return list;
  }, [from, to, cities, statuses]);

  const prevBookings = useMemo(
    () => filterPrevBookings(BOOKINGS, from, to),
    [from, to],
  );

  const activeCabins = useMemo(() => {
    if (cities.length === 0) return CABINS;
    const citySet = new Set(cities);
    return CABINS.filter((cabin) =>
      cabin.city?.name ? citySet.has(cabin.city.name) : false,
    );
  }, [cities]);

  return {
    filters: {
      from,
      to,
      city: cities,
      status: statuses,
      numDays,
      preset,
    },
    bookings,
    prevBookings,
    activeCabins,
  };
}
