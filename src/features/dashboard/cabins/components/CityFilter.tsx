"use client";

import Select from "@/components/ui/Select";
import { ALL, PARAM_CITY } from "../../overview/hooks/useDashboardFilters";
import { City } from "@/features/cabins/types/city.types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface CityFilterProps {
  value?: string;
  onChange?: (city: string) => void;
  cities: City[];
}

export default function CityFilter({
  cities,
  value,
  onChange,
}: CityFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const city = !value ? (searchParams.get(PARAM_CITY) ?? ALL) : value;

  const options = [
    { value: ALL, label: "همه شهرها" },
    ...cities.map((city) => ({ value: city.name, label: city.name })),
  ];

  const handleChange = (value: string) => {
    if (onChange) return onChange(value);

    const params = new URLSearchParams(searchParams);
    Object.entries({ [PARAM_CITY]: value === ALL ? null : value }).forEach(
      ([key, value]) => {
        if (value === null) params.delete(key);
        else params.set(key, value);
      },
    );
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select
      value={city}
      onChange={(e) => handleChange(e.target.value)}
      options={options}
    />
  );
}
