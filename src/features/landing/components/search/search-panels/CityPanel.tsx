"use client";

import { MapPin } from "lucide-react";

import OptionRow from "@/components/ui/filter/OptionRow";
import type { SearchCity } from "@/features/landing/constants/search";

type Props = {
  cities: SearchCity[];
  value: SearchCity | null;
  onSelect: (city: SearchCity) => void;
};

/** لیست انتخاب مقصد داخل کارت فیلتر */
export default function CityPanel({ cities, value, onSelect }: Props) {
  return (
    <div className="flex max-h-72 flex-col gap-2 overflow-y-auto pe-0.5">
      {cities.map((city) => (
        <OptionRow
          key={city.id}
          label={city.name}
          hint={city.hint}
          selected={value?.id === city.id}
          onSelect={() => onSelect(city)}
          icon={<MapPin className="text-primary-400 size-4 shrink-0" />}
        />
      ))}
    </div>
  );
}
