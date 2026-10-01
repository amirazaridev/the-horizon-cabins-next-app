import type { ReactNode } from "react";

import CabinCard from "@/features/cabins/components/CabinCard";
import CabinCardSkeleton from "@/features/cabins/components/CabinCardSkeleton";
import type { Cabin } from "@/features/cabins/types/cabin.types";

/** صفحه‌ی موقت برای اندازه‌گیری ارتفاع اسکلتون در برابر کارت واقعی */

const base = {
  maxCapacity: 4,
  regularPrice: 4500000,
  discount: 0,
  description: "توضیح",
  amenities: ["وای‌فای", "آشپزخانه", "پارکینگ", "شومینه"],
  bedrooms: 2,
  bathrooms: 1,
  areaSqm: 85,
  images: [],
  latitude: null,
  longitude: null,
  rating: 4.8,
  city: { id: 1, name: "رامسر" },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const cabins: Cabin[] = [
  { ...base, id: 1, name: "کلبه چوبی جنگلی" },
  { ...base, id: 2, name: "ویلا ساحلی لوکس", discount: 500000 },
  { ...base, id: 3, name: "سوئیت کوهستان" },
];

export default function SkeletonCheckPage(): ReactNode {
  return (
    <div className="bg-background p-6">
      <h1 className="text-text mb-4 text-xl font-bold">landing</h1>
      <div
        data-testid="landing-skeleton"
        className="grid grid-cols-3 gap-4"
      >
        {[0, 1, 2].map((index) => (
          <CabinCardSkeleton
            key={index}
            variant="landing"
            showPrice
            className="h-full"
          />
        ))}
      </div>
      <div data-testid="landing-real" className="mt-4 grid grid-cols-3 gap-4">
        {cabins.map((cabin) => (
          <CabinCard key={cabin.id} cabin={cabin} variant="landing" showPrice />
        ))}
      </div>

      <h1 className="text-text mt-10 mb-4 text-xl font-bold">default</h1>
      <div data-testid="default-skeleton" className="grid grid-cols-3 gap-5">
        {[0, 1, 2].map((index) => (
          <CabinCardSkeleton key={index} className="h-full" />
        ))}
      </div>
      <div data-testid="default-real" className="mt-4 grid grid-cols-3 gap-5">
        {cabins.map((cabin) => (
          <CabinCard key={cabin.id} cabin={cabin} />
        ))}
      </div>

      <h1 className="text-text mt-10 mb-4 text-xl font-bold">dashboard</h1>
      <div data-testid="dash-skeleton" className="grid grid-cols-3 gap-6">
        {[0, 1, 2].map((index) => (
          <CabinCardSkeleton key={index} variant="dashboard" />
        ))}
      </div>
      <div data-testid="dash-real" className="mt-4 grid grid-cols-3 gap-6">
        {cabins.map((cabin) => (
          <CabinCard key={cabin.id} cabin={cabin} variant="dashboard" />
        ))}
      </div>
    </div>
  );
}
