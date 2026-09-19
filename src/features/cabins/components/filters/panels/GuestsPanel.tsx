"use client";

import OptionRow from "../OptionRow";
import { useCabinQuery } from "../useCabinQuery";

const OPTIONS = [1, 2, 3, 4, 5, 6];

/** تعداد نفرات = حداقل ظرفیت اقامتگاه */
export default function GuestsPanel() {
  const { searchParams, setParam } = useCabinQuery();
  const current = searchParams.get("guests");

  return (
    <div className="flex flex-col gap-2">
      <OptionRow
        label="هر تعداد"
        hint="نمایش همه اقامتگاه‌ها"
        selected={current === null}
        onSelect={() => setParam("guests", null)}
      />
      {OPTIONS.map((n) => (
        <OptionRow
          key={n}
          label={n >= 6 ? "۶ نفر و بیشتر" : `${n.toLocaleString("fa-IR")} نفر`}
          hint={n >= 6 ? "ظرفیت ۶ به بالا" : `ظرفیت حداقل ${n.toLocaleString("fa-IR")} نفر`}
          selected={current === String(n)}
          onSelect={() => setParam("guests", String(n))}
        />
      ))}
    </div>
  );
}
