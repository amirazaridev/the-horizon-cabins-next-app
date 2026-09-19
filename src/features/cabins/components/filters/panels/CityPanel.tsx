"use client";

import { MapPin } from "lucide-react";
import OptionRow from "../OptionRow";
import { useCabinQuery } from "../useCabinQuery";
import type { CabinFilterOptions } from "../../../lib/cabin-filters";

type Props = {
  options: CabinFilterOptions;
};

/** شهر / مقصد */
export default function CityPanel({ options }: Props) {
  const { searchParams, setParam } = useCabinQuery();
  const current = searchParams.get("city");

  if (!options.cities.length) {
    return (
      <p className="text-text-gray py-4 text-center text-sm">
        شهری برای نمایش ثبت نشده است.
      </p>
    );
  }

  return (
    <div className="flex max-h-72 flex-col gap-2 overflow-y-auto ps-0.5">
      <OptionRow
        label="همه شهرها"
        hint="نمایش همه اقامتگاه‌ها"
        selected={current === null}
        onSelect={() => setParam("city", null)}
      />
      {options.cities.map((city) => (
        <OptionRow
          key={city.id}
          label={city.name}
          selected={current === String(city.id)}
          onSelect={() => setParam("city", String(city.id))}
          icon={<MapPin className="text-primary-400 size-4 shrink-0" />}
        />
      ))}
    </div>
  );
}
