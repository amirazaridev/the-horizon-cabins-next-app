"use client";

import SingleOptionPanel from "@/components/ui/filter/panels/SingleOptionPanel";
import { useCabinQuery } from "../useCabinQuery";

const OPTIONS = [1, 2, 3, 4, 5, 6];

const fa = (n: number) => n.toLocaleString("fa-IR");

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
    <SingleOptionPanel
      value={current}
      onChange={select}
      allOption={{ label: "هر تعداد", hint: "نمایش همه اقامتگاه‌ها" }}
      options={OPTIONS.map((n) => ({
        value: String(n),
        label: n >= 6 ? "۶ نفر و بیشتر" : `${fa(n)} نفر`,
        hint:
          n >= 6
            ? "ظرفیت ۶ به بالا"
            : `ظرفیت حداقل ${fa(n)} نفر`,
      }))}
    />
  );
}
