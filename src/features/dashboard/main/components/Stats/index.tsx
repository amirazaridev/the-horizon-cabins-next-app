"use client";

import { CalendarDays, Moon, Percent, Wallet } from "lucide-react";
import Stat from "./Stat";
import { calcGrowth } from "../../hooks/useDashboardFilters";
import { formatCurrency } from "@/libs/format";
import type { Booking, Cabin } from "../../data/mock-data";

interface StatsProps {
  bookings: Booking[];
  prevBookings: Booking[];
  cabins: Cabin[];
  numDays: number;
}

export default function Stats({ bookings, prevBookings, cabins, numDays }: StatsProps) {
  const sales = bookings.reduce((acc, b) => acc + b.totalPrice, 0);
  const prevSales = prevBookings.reduce((acc, b) => acc + b.totalPrice, 0);

  const nights = bookings.reduce((acc, b) => acc + b.numNights, 0);
  const prevNights = prevBookings.reduce((acc, b) => acc + b.numNights, 0);

  const occupancy = nights / (numDays * cabins.length);
  const avgNights = bookings.length ? nights / bookings.length : 0;
  const prevAvgNights = prevBookings.length ? prevNights / prevBookings.length : 0;

  const items = [
    {
      title: "کل رزروها",
      value: formatCurrency(bookings.length),
      delta: calcGrowth(bookings.length, prevBookings.length),
      icon: <CalendarDays className="size-5.5" />,
      color: "indigo",
    },
    {
      title: "درآمد کل (تومان)",
      value: formatCurrency(sales),
      delta: calcGrowth(sales, prevSales),
      icon: <Wallet className="size-5.5" />,
      color: "emerald",
    },
    {
      title: "نرخ اشغال",
      value: `${Math.round(occupancy * 100)}٪`,
      delta: null,
      icon: <Percent className="size-5.5" />,
      color: "sky",
    },
    {
      title: "میانگین اقامت",
      value: `${avgNights.toFixed(1)} شب`,
      delta: calcGrowth(avgNights, prevAvgNights),
      icon: <Moon className="size-5.5" />,
      color: "amber",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Stat key={item.title} {...item} />
      ))}
    </div>
  );
}