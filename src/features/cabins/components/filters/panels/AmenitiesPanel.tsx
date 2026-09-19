"use client";

import OptionRow from "../OptionRow";
import { useCabinQuery } from "../useCabinQuery";
import type { CabinFilterOptions } from "../../../lib/cabin-filters";

type Props = {
  options: CabinFilterOptions;
};

/** امکانات — چندگزینه‌ای؛ اقامتگاه باید همه موارد را داشته باشد */
export default function AmenitiesPanel({ options }: Props) {
  const { searchParams, setParam } = useCabinQuery();
  const selected =
    searchParams
      .get("amenities")
      ?.split(",")
      .map((a) => a.trim())
      .filter(Boolean) ?? [];

  const toggle = (amenity: string) => {
    const next = selected.includes(amenity)
      ? selected.filter((a) => a !== amenity)
      : [...selected, amenity];
    setParam("amenities", next.length ? next.join(",") : null);
  };

  if (!options.amenities.length) {
    return (
      <p className="text-text-gray py-4 text-center text-sm">
        امکاناتی برای نمایش ثبت نشده است.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-text-gray text-xs">
          {selected.length > 0
            ? `${selected.length.toLocaleString("fa-IR")} مورد انتخاب شده`
            : "چند مورد را انتخاب کنید"}
        </p>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => setParam("amenities", null)}
            className="text-danger text-xs font-bold"
          >
            حذف همه
          </button>
        )}
      </div>
      <div className="flex max-h-72 flex-col gap-2 overflow-y-auto ps-0.5">
        {options.amenities.map((amenity) => (
          <OptionRow
            key={amenity}
            label={amenity}
            selected={selected.includes(amenity)}
            onSelect={() => toggle(amenity)}
          />
        ))}
      </div>
    </div>
  );
}
