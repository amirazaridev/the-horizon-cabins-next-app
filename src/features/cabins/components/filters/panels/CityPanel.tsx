"use client";

import SharedCityPanel from "@/components/ui/filter/panels/CityPanel";
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

/** شهر / مقصد — adapter پنل reusable روی URL اقامتگاه‌ها */
export default function CityPanel({ options, value, onChange }: Props) {
  const { searchParams, setParam } = useCabinQuery();
  const current = onChange ? (value ?? null) : searchParams.get("city");

  const select = (next: string | null) => {
    if (onChange) onChange(next);
    else setParam("city", next);
  };

  return (
    <SharedCityPanel
      cities={options.cities.map((city) => ({
        value: String(city.id),
        label: city.name,
      }))}
      value={current}
      onChange={select}
      showAll
      allLabel="همه شهرها"
      allHint="نمایش همه اقامتگاه‌ها"
      emptyMessage="شهری برای نمایش ثبت نشده است."
    />
  );
}
