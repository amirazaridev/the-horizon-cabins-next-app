"use client";

import { format as formatJalali } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";

import { useDashboardFilters } from "./hooks/useDashboardFilters";
import FilterBar from "./components/FilterBar";
import Stats from "./components/Stats";
import SalesChart from "./components/charts/SalesChart";
import DurationChart from "./components/charts/DurationChart";
import OccupancyChart from "./components/charts/OccupancyChart";
import CityRevenueChart from "./components/charts/CityRevenueChart";
import TodayActivity from "./components/TodayActivity";
import { useTransition } from "react";
import Spinner from "@/components/ui/Spinner";
import { City } from "@/features/cabins/types/city.types";

type Props = {
  cities: City[];
};

export default function MainPageLayout({ cities }: Props) {
  const [isPending, startTransition] = useTransition();
  const { filters, bookings, prevBookings, activeCabins } =
    useDashboardFilters();

  return (
    <div className="flex flex-col gap-6">
      {isPending && <Spinner size="xl" fullscreen />}
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="text-text text-2xl font-bold sm:text-3xl">داشبورد</h2>
          <p className="text-text-gray mt-1 text-sm">
            خلاصه وضعیت سوییت‌ها از{" "}
            <span className="text-text font-semibold">
              {formatJalali(filters.from, "d MMMM", { locale: faIR })}
            </span>{" "}
            تا{" "}
            <span className="text-text font-semibold">
              {formatJalali(filters.to, "d MMMM yyyy", { locale: faIR })}
            </span>
          </p>
        </div>
        <FilterBar cities={cities} startTransition={startTransition} />
      </div>

      <Stats
        bookings={bookings}
        prevBookings={prevBookings}
        cabins={activeCabins}
        numDays={filters.numDays}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SalesChart bookings={bookings} from={filters.from} to={filters.to} />
        </div>
        <div className="lg:col-span-2">
          <DurationChart confirmedStays={bookings} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <OccupancyChart
            bookings={bookings}
            cabins={activeCabins}
            numDays={filters.numDays}
          />
        </div>
        <div className="lg:col-span-2">
          <CityRevenueChart bookings={bookings} />
        </div>
      </div>

      <TodayActivity />
    </div>
  );
}
