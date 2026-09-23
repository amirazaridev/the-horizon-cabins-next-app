"use client";

import OptionRow from "../../../../../components/ui/filter/OptionRow";
import { useCabinQuery } from "../useCabinQuery";
import type { CabinFilterOptions } from "../../../lib/cabin-filters";

type Props = {
  options: CabinFilterOptions;
};

/** بازه قیمت هر شب — باکت‌های ساخته‌شده از دیتای واقعی */
export default function PricePanel({ options }: Props) {
  const { searchParams, setParam } = useCabinQuery();
  const current = searchParams.get("price");

  if (!options.priceBuckets.length) {
    return (
      <p className="text-text-gray py-4 text-center text-sm">
        بازه قیمتی متنوعی ثبت نشده است.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <OptionRow
        label="هر قیمت"
        hint="نمایش همه اقامتگاه‌ها"
        selected={current === null}
        onSelect={() => setParam("price", null)}
      />
      {options.priceBuckets.map((bucket) => {
        const value = `${bucket.value[0]}-${bucket.value[1]}`;
        return (
          <OptionRow
            key={value}
            label={bucket.label}
            hint="قیمت نهایی هر شب"
            selected={current === value}
            onSelect={() => setParam("price", value)}
          />
        );
      })}
    </div>
  );
}
