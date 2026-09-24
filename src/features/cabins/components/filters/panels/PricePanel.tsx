"use client";

import OptionRow from "../../../../../components/ui/filter/OptionRow";
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
    <div className="flex flex-col gap-2">
      <OptionRow
        label="هر قیمت"
        hint="نمایش همه اقامتگاه‌ها"
        selected={current === null}
        onSelect={() => select(null)}
      />
      {options.priceBuckets.map((bucket) => {
        const bucketValue = `${bucket.value[0]}-${bucket.value[1]}`;
        return (
          <OptionRow
            key={bucketValue}
            label={bucket.label}
            hint="قیمت نهایی هر شب"
            selected={current === bucketValue}
            onSelect={() => select(bucketValue)}
          />
        );
      })}
    </div>
  );
}
