"use client";

import PriceRangePanel, {
  type PriceRangeValue,
} from "@/components/ui/Filter/panels/PriceRangePanel";
import { formatPriceRange, parsePriceRange } from "@/libs/utils/price-range";
import { useCabinQuery } from "../useCabinQuery";

type Props = {
  /** بازه به‌صورت `lo-hi` (قرارداد URL پروژه) */
  value?: string | null;
  onChange?: (value: string | null) => void;
};

export default function PricePanel({ value, onChange }: Props) {
  const { searchParams, setParam } = useCabinQuery();
  const current = onChange ? (value ?? null) : searchParams.get("price");

  const parsed = parsePriceRange(current);

  const write = (next: PriceRangeValue | null) => {
    const raw = next ? formatPriceRange(next.min, next.max) : null;
    if (onChange) onChange(raw);
    else setParam("price", raw);
  };

  return (
    <PriceRangePanel
      value={parsed ? { min: parsed[0], max: parsed[1] } : null}
      onChange={write}
      applyLabel="اعمال فیلتر"
      clearLabel="حذف فیلتر"
    />
  );
}
