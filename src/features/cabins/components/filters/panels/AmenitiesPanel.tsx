"use client";

import OptionRow from "../../../../../components/ui/filter/OptionRow";
import { useCabinQuery } from "../useCabinQuery";
import type { CabinFilterOptions } from "../../../lib/cabin-filters";

type Props = {
  options: CabinFilterOptions;
  /**
   * حالت controlled (داخل FilterCard دسکتاپ).
   * اگر onChange داده نشود، پنل خودش مستقیم با useCabinQuery کار می‌کند (موبایل).
   */
  value?: string[];
  onChange?: (value: string[]) => void;
};

/** امکانات — چندگزینه‌ای؛ اقامتگاه باید همه موارد را داشته باشد */
export default function AmenitiesPanel({ options, value, onChange }: Props) {
  const { searchParams, setParam } = useCabinQuery();
  const urlSelected =
    searchParams
      .get("amenities")
      ?.split(",")
      .map((a) => a.trim())
      .filter(Boolean) ?? [];
  const selected = onChange ? (value ?? []) : urlSelected;

  const write = (next: string[]) => {
    if (onChange) onChange(next);
    else setParam("amenities", next.length ? next.join(",") : null);
  };

  const toggle = (amenity: string) => {
    write(
      selected.includes(amenity)
        ? selected.filter((a) => a !== amenity)
        : [...selected, amenity],
    );
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
            onClick={() => write([])}
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
