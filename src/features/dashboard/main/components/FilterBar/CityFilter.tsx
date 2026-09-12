"use client";

import Select from "@/components/ui/Select";
import { ALL } from "../../hooks/useDashboardFilters";
import { CITIES } from "../../data/mock-data";

interface CityFilterProps {
  value: string;
  onChange: (city: string) => void;
}

export default function CityFilter({ value, onChange }: CityFilterProps) {
  const options = [
    { value: ALL, label: "همه شهرها" },
    ...CITIES.map((city) => ({ value: city, label: city })),
  ];

  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={options}
      aria-label="فیلتر بر اساس شهر"
    />
  );
}