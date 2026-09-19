import type { Cabin } from "@/features/cabins/lib/data-service";
import CabinCard from "@/features/cabins/components/CabinCard";
import { formatCurrency } from "@/libs/utils/format";

type Props = {
  cabin: Cabin;
  price: number;
  originalPrice?: number;
  badge: string;
};

export default function OfferCard({ cabin, price, originalPrice, badge }: Props) {
  return (
    <article className="hz-reveal flex h-full flex-col">
      <div className="relative flex-1 [&>a]:h-full">
        <CabinCard cabin={cabin} variant="landing" animation="none" className="rounded-b-none border-b-0" />
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-primary-400 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-sm">
          {badge}
        </span>
      </div>
      <div className="rounded-b-3xl border border-t-0 border-foreground/5 bg-surface px-4 pb-4 pt-3">
        <div className="flex flex-wrap items-end justify-between gap-2 border-t border-border pt-3">
          <span className="text-xs text-text-gray">هر شب از</span>
          <div className="text-left">
            {originalPrice !== undefined && originalPrice > price && (
              <del className="mb-1 block text-xs text-text-gray">{formatCurrency(originalPrice)} تومان</del>
            )}
            <span className="text-lg font-bold text-text">{formatCurrency(price)}</span>
            <span className="mr-1 text-xs text-text-gray">تومان</span>
          </div>
        </div>
      </div>
    </article>
  );
}
