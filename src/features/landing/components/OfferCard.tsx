import type { Cabin } from "@/features/cabins/types/cabin.types";
import CabinCard from "@/features/cabins/components/CabinCard";
import { formatCurrency } from "@/libs/utils/format";

type Props = {
  cabin: Cabin;
  price: number;
  originalPrice?: number;
  badge: string;
};

/**
 * کارت «پیشنهاد» لندینگ — کارت `landing` به‌همراه یک پاورقی قیمت جدا.
 *
 * ⚠️ پیش از این این کامپوننت برای هم‌ارتفاع‌کردن لینکِ درونی کارت، سلکتور
 * `[&>a]:h-full` می‌زد؛ یعنی به ساختار DOM یک کامپوننت دیگر وابسته بود و
 * `CabinCard` هم مجبور بود ترتیب DOM را برای حفظ آن تغییر ندهد. اکنون
 * لینک خودش `h-full` است و نشان هم پراپِ `badge` خودِ کارت است.
 */
export default function OfferCard({
  cabin,
  price,
  originalPrice,
  badge,
}: Props) {
  return (
    <article data-animate="reveal" className="flex h-full flex-col">
      <div className="flex-1">
        <CabinCard
          cabin={cabin}
          variant="landing"
          animation="none"
          badge={badge}
          className="rounded-b-none border-b-0"
        />
      </div>

      <div className="border-foreground/5 bg-surface rounded-b-3xl border border-t-0 px-4 pt-3 pb-4">
        <div className="border-border flex flex-wrap items-end justify-between gap-2 border-t pt-3">
          <span className="text-text-gray text-xs">هر شب از</span>
          <div className="text-left">
            {originalPrice !== undefined && originalPrice > price && (
              <del className="text-text-gray mb-1 block text-xs">
                {formatCurrency(originalPrice)} تومان
              </del>
            )}
            <span className="text-text text-lg font-bold">
              {formatCurrency(price)}
            </span>
            <span className="text-text-gray mr-1 text-xs">تومان</span>
          </div>
        </div>
      </div>
    </article>
  );
}
