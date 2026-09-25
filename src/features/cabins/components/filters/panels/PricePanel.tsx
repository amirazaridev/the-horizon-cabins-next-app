"use client";

import SingleOptionPanel from "@/components/ui/filter/panels/SingleOptionPanel";
import { useCabinQuery } from "../useCabinQuery";
import type { CabinFilterOptions } from "../../../utils/cabin-filters";

type Props = {
  options: CabinFilterOptions;
  /**
   * حالت controlled (داخل FilterCard دسکتاپ).
   * اگر onChange داده نشود، پنل خودش مستقیم با useCabinQuery کار می‌کند (موبایل).
   */
  value?: string | null;
  onChange?: (value: string | null) => void;
};

/** بازه قیمت هر شب — باکت‌های ساخته‌شده از دیتای واقعی */
export default function PricePanel({ options, value, onChange }: Props) {
  const { searchParams, setParam } = useCabinQuery();
  const current = onChange ? (value ?? null) : searchParams.get("price");

  const select = (next: string | null) => {
    if (onChange) onChange(next);
    else setParam("price", next);
  };

  if (!options.priceBuckets.length) {
    return (
      <p className="text-text-gray py-4 text-center text-sm">
        بازه قیمتی متنوعی ثبت نشده است.
      </p>
    );
  }

  return (
    <SingleOptionPanel
      value={current}
      onChange={select}
      allOption={{ label: "هر قیمت", hint: "نمایش همه اقامتگاه‌ها" }}
      options={options.priceBuckets.map((bucket) => ({
        value: `${bucket.value[0]}-${bucket.value[1]}`,
        label: bucket.label,
        hint: "قیمت نهایی هر شب",
      }))}
    />
  );
}
