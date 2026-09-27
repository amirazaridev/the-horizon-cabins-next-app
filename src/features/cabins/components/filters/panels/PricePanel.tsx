"use client";

import RangeGauge from "@/components/ui/RangeGauge";
import { useCabinQuery } from "../useCabinQuery";
import { formatPriceShort } from "../../../utils/cabin-filters";
import type { CabinFilterOptions } from "../../../utils/cabin-filters";

const MIN_PRICE = 1_000_000;
const MAX_PRICE = 30_000_000;
const STEP = 100_000;

type Props = {
  options: CabinFilterOptions;
  value?: string | null;
  onChange?: (value: string | null) => void;
};

export default function PricePanel({ options, value, onChange }: Props) {
  const { searchParams, setParam } = useCabinQuery();
  const current = onChange ? (value ?? null) : searchParams.get("price");

  let startIndex = 0;
  let endIndex = MAX_PRICE - MIN_PRICE;

  if (current) {
    const [lo, hi] = current.split("-").map(Number);
    if (Number.isFinite(lo) && Number.isFinite(hi)) {
      startIndex = Math.min(Math.max(lo - MIN_PRICE, 0), MAX_PRICE - MIN_PRICE);
      endIndex = Math.min(Math.max(hi - MIN_PRICE, 0), MAX_PRICE - MIN_PRICE);
    }
  }

  const handleCommit = (range: { start: number; end: number }) => {
    const priceValue = `${range.start}-${range.end}`;
    if (onChange) onChange(priceValue);
    else setParam("price", priceValue);
  };

  const handleClear = () => {
    if (onChange) onChange(null);
    else setParam("price", null);
  };

  const isFiltered = startIndex !== 0 || endIndex !== MAX_PRICE - MIN_PRICE;

  if (!options.priceBuckets.length) {
    return (
      <p className="text-text-gray py-4 text-center text-sm">
        بازه قیمتی متنوعی ثبت نشده است.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <RangeGauge
        startIndex={startIndex}
        endIndex={endIndex}
        min={MIN_PRICE}
        max={MAX_PRICE}
        step={STEP}
        formatValue={formatPriceShort}
        startAriaLabel="قیمت حداقل"
        endAriaLabel="قیمت حداکثر"
        onCommit={handleCommit}
        showInputs={true}
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            const range = { start: startIndex + MIN_PRICE, end: endIndex + MIN_PRICE };
            handleCommit(range);
          }}
          className="bg-primary-400 text-text hover:bg-primary-500 flex-1 rounded-xl py-2.5 text-sm font-bold transition-colors"
        >
          اعمال فیلتر
        </button>
        {isFiltered && (
          <button
            type="button"
            onClick={handleClear}
            className="border-border text-text-gray hover:text-text flex-1 rounded-xl border py-2.5 text-sm font-bold transition-colors"
          >
            حذف فیلتر
          </button>
        )}
      </div>
    </div>
  );
}
