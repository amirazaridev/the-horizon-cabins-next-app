import { formatNumberFa } from "@/libs/format";
import type { ReactNode } from "react";

type Props = {
  price: number;
  discount?: number | null;
  perNightText?: string;
};

export default function PriceDisplay({
  price,
  discount,
  perNightText,
}: Props): ReactNode {
  const finalPrice = price - (discount ?? 0);
  const discountPercent = discount
    ? Math.round((discount / price) * 100)
    : null;

  return (
    <div className="relative mb-6">
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-white">{formatNumberFa(finalPrice)} تومان</span>
        {discount ? (
          <>
            <span className="text-lg text-text/40 line-through">{formatNumberFa(price)}</span>
            <span className="bg-primary-400 rounded-full px-3 py-1 text-xs font-bold text-black">
              {discountPercent}٪ تخفیف
            </span>
          </>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-text/50">{perNightText}</p>
    </div>
  );
}
