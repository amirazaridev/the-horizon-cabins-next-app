"use client";

import OptionRow from "../../../../../components/ui/filter/OptionRow";
import { useCabinQuery } from "../useCabinQuery";

const OPTIONS = [1, 2, 3, 4, 5, 6];

type Props = {
  /**
   * حالت controlled (داخل FilterCard دسکتاپ).
   * اگر onChange داده نشود، پنل خودش مستقیم با useCabinQuery کار می‌کند (موبایل).
   */
  value?: string | null;
  onChange?: (value: string | null) => void;
};

/** تعداد نفرات = حداقل ظرفیت اقامتگاه */
export default function GuestsPanel({ value, onChange }: Props) {
  const { searchParams, setParam } = useCabinQuery();
  const current = onChange ? (value ?? null) : searchParams.get("guests");

  const select = (next: string | null) => {
    if (onChange) onChange(next);
    else setParam("guests", next);
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
          label={n >= 6 ? "۶ نفر و بیشتر" : `${n.toLocaleString("fa-IR")} نفر`}
          hint={
            n >= 6
              ? "ظرفیت ۶ به بالا"
              : `ظرفیت حداقل ${n.toLocaleString("fa-IR")} نفر`
          }
          selected={current === String(n)}
          onSelect={() => select(String(n))}
        />
      ))}
    </div>
  );
}
