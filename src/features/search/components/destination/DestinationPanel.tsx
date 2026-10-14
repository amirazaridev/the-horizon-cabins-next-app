"use client";

import { useMemo, useState } from "react";
import { Compass, ListFilter, Map as MapIcon, MapPin } from "lucide-react";

import CityPanel, {
  type CityPanelGroup,
} from "@/components/ui/Filter/panels/CityPanel";
import type { City } from "@/features/cabins/types/city.types";
import DestinationMapPanel from "@/features/search/components/destination/DestinationMapPanel";
import { regionAllCitiesLabel } from "@/features/search/constants/regions";
import { searchDestinations } from "@/features/search/services/destination.service";
import type { Destination, Region } from "@/features/search/types/search.types";
import {
  CITY_VALUE_PREFIX,
  REGION_VALUE_PREFIX,
  decodeDestinationWithName,
  encodeDestination,
} from "@/features/search/utils/destination-value";

type View = "list" | "map";

type Props = {
  cities: City[];
  //* مناطق واقعی از API (`getRegions`) — منبع حقیقت دسته‌بندی شهرها
  regions: Region[];
  value: Destination | null;
  onChange: (destination: Destination | null) => void;
};

export default function DestinationPanel({
  cities,
  regions,
  value,
  onChange,
}: Props) {
  const [view, setView] = useState<View>("list");

  const { groups, others } = useMemo(
    () => searchDestinations(cities, regions, ""),
    [cities, regions],
  );

  const panelGroups: CityPanelGroup[] = useMemo(() => {
    const regionGroups: CityPanelGroup[] = groups.map((group) => ({
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
      regionGroups.push({
        id: "others",
        title: "سایر شهرها",
        options: others.map((city) => ({
          value: `${CITY_VALUE_PREFIX}${city.id}`,
          label: city.name,
          icon: <MapPin className="text-primary-400 size-4 shrink-0" />,
        })),
      });
    }

    return regionGroups;
  }, [groups, others]);

  const mapCities = useMemo(
    () => groups.flatMap((group) => group.cities).concat(others),
    [groups, others],
  );

  return (
    <div className="flex flex-col gap-3">
      {/* سوییچ بین لیست و نقشه */}
      <div
        role="tablist"
        aria-label="روش انتخاب مقصد"
        className="bg-foreground/5 flex shrink-0 gap-1 rounded-xl p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={view === "list"}
          onClick={() => setView("list")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-colors ${
            view === "list"
              ? "bg-surface text-text shadow-sm"
              : "text-text-gray hover:text-text"
          }`}
        >
          <ListFilter className="size-3.5" />
          جستجو
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "map"}
          onClick={() => setView("map")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-colors ${
            view === "map"
              ? "bg-surface text-text shadow-sm"
              : "text-text-gray hover:text-text"
          }`}
        >
          <MapIcon className="size-3.5" />
          نقشه
        </button>
      </div>

      {view === "map" ? (
        <DestinationMapPanel cities={mapCities} destination={value} />
      ) : (
        <>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-text-gray hover:text-danger self-start text-xs font-bold transition-colors"
            >
              حذف مقصد انتخاب‌شده
            </button>
          )}

          <CityPanel
            searchable
            searchPlaceholder="جستجوی شهر یا منطقه…"
            groups={panelGroups}
            value={encodeDestination(value)}
            onChange={(next) =>
              onChange(decodeDestinationWithName(next, cities))
            }
            emptyMessage="مقصدی با این نام پیدا نشد."
          />

          {!value && (
            <p className="text-text-gray flex items-center gap-1.5 px-1 text-xs leading-5">
              <Compass className="size-3.5 shrink-0" />
              با انتخاب یک منطقه، همه‌ی شهرهای آن منطقه جستجو می‌شوند.
            </p>
          )}
        </>
      )}
    </div>
  );
}
