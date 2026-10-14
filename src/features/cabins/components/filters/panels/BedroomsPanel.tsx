"use client";

import SingleOptionPanel from "@/components/ui/Filter/panels/SingleOptionPanel";
import { useCabinQuery } from "../useCabinQuery";

const OPTIONS = [1, 2, 3, 4];

type Props = {
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
    <SingleOptionPanel
      value={current}
      onChange={select}
      allOption={{ label: "هر تعداد", hint: "نمایش همه اقامتگاه‌ها" }}
      options={OPTIONS.map((n) => ({
        value: String(n),
        label: n >= 4 ? "۴ خواب و بیشتر" : `${n.toLocaleString("fa-IR")} خوابه`,
        hint:
          n >= 4
            ? "حداقل ۴ اتاق‌خواب"
            : `حداقل ${n.toLocaleString("fa-IR")} اتاق‌خواب`,
      }))}
    />
  );
}
