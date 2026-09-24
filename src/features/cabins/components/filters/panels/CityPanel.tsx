"use client";

import { MapPin } from "lucide-react";
import OptionRow from "@/components/ui/filter/OptionRow";
import { useCabinQuery } from "../useCabinQuery";
import type { CabinFilterOptions } from "../../../utils/cabin-filters";

type Props = {
  options: CabinFilterOptions;
  /**
   * حالت controlled (داخل FilterCard دسکتاپ).
   * اگر onChange داده نشود، پنل خودش مستقیم با useCabinQuery کار می‌کند (موبایل).
   */
  value?: string | null;
  onChange?: (value: string | null) => void;
};

/** شهر / مقصد */
export default function CityPanel({ options, value, onChange }: Props) {
  const { searchParams, setParam } = useCabinQuery();
  const current = onChange ? (value ?? null) : searchParams.get("city");

  const select = (next: string | null) => {
    if (onChange) onChange(next);
    else setParam("city", next);
  };

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
        onSelect={() => select(null)}
      />
      {options.cities.map((city) => (
        <OptionRow
          key={city.id}
          label={city.name}
          selected={current === String(city.id)}
          onSelect={() => select(String(city.id))}
          icon={<MapPin className="text-primary-400 size-4 shrink-0" />}
        />
      ))}
    </div>
  );
}
