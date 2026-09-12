import { formatCurrency } from "@/libs/format";
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
        <span className="text-text text-4xl font-bold">
          {formatCurrency(finalPrice)} تومان
        </span>
        {discount ? (
          <>
            <span className="text-text/40 text-lg line-through">
              {formatCurrency(price)}
            </span>
            <span className="bg-primary-400 rounded-full px-3 py-1 text-xs font-bold text-black">
              {discountPercent}٪ تخفیف
            </span>
          </>
        ) : null}
      </div>
      <p className="text-text/50 mt-2 text-sm">{perNightText}</p>
    </div>
  );
}
