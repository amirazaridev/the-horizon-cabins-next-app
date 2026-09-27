"use client";

import SharedCityPanel from "@/components/ui/filter/panels/CityPanel";
import { useCabinQuery } from "../useCabinQuery";

type Props = {
  cities: { id: number; name: string }[];
  value?: string | null;
  onChange?: (value: string | null) => void;
};

export default function CityPanel({ cities, value, onChange }: Props) {
  const { searchParams, setParam } = useCabinQuery();
  const current = onChange ? (value ?? null) : searchParams.get("city");

  const select = (next: string | null) => {
    if (onChange) onChange(next);
    else setParam("city", next);
  };

  return (
    <SharedCityPanel
      cities={cities.map((city) => ({
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