"use client";

import MultiOptionList from "@/components/ui/filter/MultiOptionList";
import { useCabinQuery } from "../useCabinQuery";

type Props = {
  amenities: string[];
  value?: string[];
  onChange?: (value: string[]) => void;
};

export default function AmenitiesPanel({ amenities, value, onChange }: Props) {
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

  if (!amenities.length) {
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
      <MultiOptionList
        options={amenities.map((amenity) => ({
          value: amenity,
          label: amenity,
        }))}
        value={selected}
        onChange={write}
      />
    </div>
  );
}