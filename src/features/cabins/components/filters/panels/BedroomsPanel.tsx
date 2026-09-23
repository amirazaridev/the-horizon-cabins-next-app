"use client";

import OptionRow from "../../../../../components/ui/filter/OptionRow";
import { useCabinQuery } from "../useCabinQuery";

const OPTIONS = [1, 2, 3, 4];

/** تعداد خواب = حداقل اتاق‌خواب اقامتگاه */
export default function BedroomsPanel() {
  const { searchParams, setParam } = useCabinQuery();
  const current = searchParams.get("bedrooms");

  return (
    <div className="flex flex-col gap-2">
      <OptionRow
        label="هر تعداد"
        hint="نمایش همه اقامتگاه‌ها"
        selected={current === null}
        onSelect={() => setParam("bedrooms", null)}
      />
      {OPTIONS.map((n) => (
        <OptionRow
          key={n}
          label={
            n >= 4 ? "۴ خواب و بیشتر" : `${n.toLocaleString("fa-IR")} خوابه`
          }
          hint={
            n >= 4
              ? "حداقل ۴ اتاق‌خواب"
              : `حداقل ${n.toLocaleString("fa-IR")} اتاق‌خواب`
          }
          selected={current === String(n)}
          onSelect={() => setParam("bedrooms", String(n))}
        />
      ))}
    </div>
  );
}
