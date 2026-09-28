"use client";

import { useRef } from "react";
import RangeGauge, {
  type GaugeRange,
  type RangeGaugeApi,
} from "@/components/ui/RangeGauge";
import { useCabinQuery } from "../useCabinQuery";
import { formatPriceShort } from "../../../utils/cabin-filters";

const MIN_PRICE = 1_000_000;
const MAX_PRICE = 30_000_000;
const STEP = 100_000;

type Props = {
  value?: string | null;
  onChange?: (value: string | null) => void;
};

function parsePrice(raw: string | null): GaugeRange | null {
  if (!raw) return null;

  const [lo, hi] = raw.split("-").map((part) => Number(part.trim()));
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return null;

  return {
    start: Math.min(Math.max(lo, MIN_PRICE), MAX_PRICE),
    end: Math.min(Math.max(hi, MIN_PRICE), MAX_PRICE),
  };
}

export default function PricePanel({ value, onChange }: Props) {
  const { searchParams, setParam } = useCabinQuery();
  const current = onChange ? (value ?? null) : searchParams.get("price");

  const range = parsePrice(current);
  const isFiltered = range !== null;

  // آخرین API گِیج — برای فراخوانی از دکمهٔ «اعمال»
  const gaugeRef = useRef<RangeGaugeApi | null>(null);

  const applyRange = (next: GaugeRange | null) => {
    const priceValue = next ? `${next.start}-${next.end}` : null;
    if (onChange) onChange(priceValue);
    else setParam("price", priceValue);
  };

  return (
    <div className="space-y-4">
      <RangeGauge
        minValue={MIN_PRICE}
        maxValue={MAX_PRICE}
        value={range}
        step={STEP}
        formatValue={formatPriceShort}
        startAriaLabel="قیمت حداقل"
        endAriaLabel="قیمت حداکثر"
        // اعمال فقط با دکمه انجام میشود، نه با رها کردن موس
        commitOn="apply"
        onCommit={(next) => applyRange(next)}
        onReady={(api) => {
          gaugeRef.current = api;
        }}
        showInputs={true}
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => gaugeRef.current?.submit()}
          className="bg-primary-400 text-text hover:bg-primary-500 flex-1 rounded-xl py-2.5 text-sm font-bold transition-colors"
        >
          اعمال فیلتر
        </button>
        {isFiltered && (
          <button
            type="button"
            onClick={() => {
              gaugeRef.current?.reset();
              applyRange(null);
            }}
            className="border-border text-text-gray hover:text-text flex-1 rounded-xl border py-2.5 text-sm font-bold transition-colors"
          >
            حذف فیلتر
          </button>
        )}
      </div>
    </div>
  );
}
