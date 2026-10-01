"use client";

import { useMemo } from "react";
import { MapPin } from "lucide-react";

import SharedCityPanel, {
  type CityPanelGroup,
} from "@/components/ui/Filter/panels/CityPanel";
import { regionAllCitiesLabel } from "@/features/search/constants/regions";
import { groupCitiesByRegion } from "@/features/search/utils/city-groups";
import type { Region } from "@/features/search/types/search.types";
import {
  CITY_VALUE_PREFIX,
  REGION_VALUE_PREFIX,
  decodeDestinationWithName,
} from "@/features/search/utils/destination-value";
import { useCabinQuery } from "../useCabinQuery";

type Props = {
  cities: { id: number; name: string; regionId: number }[];
  /** مناطق واقعی از API — مبنای گروه‌بندی شهرها */
  regions: Region[];
  /** در حالت کنترل‌شده، مقدار کدگذاری‌شده‌ی مقصد (`city:12` / `region:north`) */
  value?: string | null;
  onChange?: (value: string | null) => void;
};

/** خواندن مقصد فعلی از URL — اولویت با منطقه است */
export function readDestinationParam(
  searchParams: URLSearchParams,
): string | null {
  const region = searchParams.get("region");
  if (region) return `${REGION_VALUE_PREFIX}${region}`;

  const city = searchParams.get("city");
  if (city) return `${CITY_VALUE_PREFIX}${city}`;

  return null;
}

/**
 * فیلتر شهرِ صفحه‌ی `/cabins` — نسخه‌ی «پالایش»، نه «کشف مقصد».
 *
 * تفاوتش با انتخاب مقصد سرچ اصلی:
 *   - کوچک و درون‌فیلتری است (بدون تب نقشه)
 *   - شهرها بر اساس منطقه گروه‌بندی شده‌اند
 *   - فقط یک جستجوی متنی ساده دارد
 *
 * گروه‌بندی بر اساس `city.regionId` انجام می‌شود، نه نام شهر.
 * رندر لیست به `CityPanel` مشترک سپرده شده است.
 */
export default function CityPanel({ cities, regions, value, onChange }: Props) {
  const { searchParams, setParams } = useCabinQuery();

  const current = onChange
    ? (value ?? null)
    : readDestinationParam(searchParams);

  const groups: CityPanelGroup[] = useMemo(() => {
    const { groups: regionGroups, others } = groupCitiesByRegion(
      cities,
      regions,
    );

    const result: CityPanelGroup[] = regionGroups.map((group) => ({
      id: group.region.id,
      title: group.region.name,
      hint: regionAllCitiesLabel(group.region.name),
      allValue: `${REGION_VALUE_PREFIX}${group.region.id}`,
      allLabel: regionAllCitiesLabel(group.region.name),
      options: group.cities.map((city) => ({
        value: `${CITY_VALUE_PREFIX}${city.id}`,
        label: city.name,
        icon: <MapPin className="text-primary-400 size-4 shrink-0" />,
      })),
    }));

    if (others.length > 0) {
      result.push({
        id: "others",
        title: "سایر شهرها",
        options: others.map((city) => ({
          value: `${CITY_VALUE_PREFIX}${city.id}`,
          label: city.name,
          icon: <MapPin className="text-primary-400 size-4 shrink-0" />,
        })),
      });
    }

    return result;
  }, [cities, regions]);

  const select = (next: string | null) => {
    if (onChange) {
      onChange(next);
      return;
    }

    const destination = decodeDestinationWithName(next, cities);

    setParams({
      city: destination?.type === "city" ? String(destination.id) : null,
      region: destination?.type === "region" ? destination.id : null,
    });
  };

  return (
    <SharedCityPanel
      searchable
      searchPlaceholder="جستجوی شهر…"
      groups={groups}
      value={current}
      onChange={select}
      showAll
      allLabel="همه شهرها"
      allHint="نمایش همه اقامتگاه‌ها"
      emptyMessage="شهری برای نمایش ثبت نشده است."
    />
  );
}
