import type { Cabin } from "@/features/cabins/types/cabin.types";
import CabinCard from "@/features/cabins/components/CabinCard";
import { formatCurrency } from "@/libs/utils/format";

type Props = {
  cabin: Cabin;
  price: number;
  originalPrice?: number;
  badge: string;
};

export default function OfferCard({
  cabin,
  price,
  originalPrice,
  badge,
}: Props) {
  return (
    <article className="hz-reveal flex h-full flex-col">
      <div className="relative flex-1 [&>a]:h-full">
        <CabinCard
          cabin={cabin}
          variant="landing"
          animation="none"
          className="rounded-b-none border-b-0"
        />
        <span className="bg-primary-400 pointer-events-none absolute top-3 right-3 rounded-full px-3 py-1.5 text-xs font-bold text-slate-950 shadow-sm">
          {badge}
        </span>
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
