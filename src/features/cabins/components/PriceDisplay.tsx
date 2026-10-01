import { formatCurrency } from "@/libs/utils/format";
import type { ReactNode } from "react";

type Props = {
  /** مبلغ اصلی که بزرگ نمایش داده می‌شود */
  amount: number;
  /**
   * مبلغ بدون تخفیف. اگر بزرگ‌تر از `amount` باشد، خط‌خورده و همراه با
   * درصد تخفیف نشان داده می‌شود.
   */
  originalAmount?: number | null;
  /** برچسب کوچک زیر مبلغ (مثل «قیمت هر شب» یا «مبلغ نهایی») */
  caption?: string;
  className?: string;
};

/**
 * بلوک مبلغ — فشرده و تک‌خطی.
 *
 * ⚠️ اندازه‌ها عمداً کوچک‌اند (`text-2xl`): این بلوک داخل aside چسبان
 * رزرو می‌نشیند و قبلاً با `text-4xl` + فاصله‌های بزرگ ارتفاع زیادی
 * می‌گرفت و پنل را از دید بیرون می‌برد.
 */
export default function PriceDisplay({
  amount,
  originalAmount,
  caption,
  className = "",
}: Props): ReactNode {
  const hasDiscount =
    typeof originalAmount === "number" && originalAmount > amount;

  const discountPercent = hasDiscount
    ? Math.round(((originalAmount - amount) / originalAmount) * 100)
    : 0;

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-text text-2xl font-extrabold tabular-nums">
          {formatCurrency(amount)}
        </span>
        <span className="text-text-gray text-xs font-medium">تومان</span>

        {hasDiscount && (
          <>
            <span className="text-text/40 text-sm line-through tabular-nums">
              {formatCurrency(originalAmount)}
            </span>
            <span className="bg-primary-400 rounded-full px-2 py-0.5 text-[10px] font-bold text-black">
              {discountPercent.toLocaleString("fa-IR")}٪ تخفیف
            </span>
          </>
        )}
      </div>

      {caption && <p className="text-text-gray mt-1 text-xs">{caption}</p>}
    </div>
  );
}
