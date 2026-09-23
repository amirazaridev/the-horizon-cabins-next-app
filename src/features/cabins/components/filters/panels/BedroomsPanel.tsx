"use client";

import OptionRow from "../../../../../components/ui/filter/OptionRow";
import { useCabinQuery } from "../useCabinQuery";

const OPTIONS = [1, 2, 3, 4];

type Props = {
  /**
   * حالت controlled (داخل FilterCard دسکتاپ).
   * اگر onChange داده نشود، پنل خودش مستقیم با useCabinQuery کار می‌کند (موبایل).
   */
  value?: string | null;
  onChange?: (value: string | null) => void;
};

/** تعداد خواب = حداقل اتاق‌خواب اقامتگاه */
export default function BedroomsPanel({ value, onChange }: Props) {
  const { searchParams, setParam } = useCabinQuery();
  const current = onChange ? (value ?? null) : searchParams.get("bedrooms");

  const select = (next: string | null) => {
    if (onChange) onChange(next);
    else setParam("bedrooms", next);
  };

  return (
    <div className="flex flex-col gap-2">
      <OptionRow
        label="هر تعداد"
        hint="نمایش همه اقامتگاه‌ها"
        selected={current === null}
        onSelect={() => select(null)}
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
          onSelect={() => select(String(n))}
        />
      ))}
    </div>
  );
}
