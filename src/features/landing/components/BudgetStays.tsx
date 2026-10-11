import { Wallet } from "lucide-react";
import Container from "@/components/ui/Container";
import type { Cabin } from "@/features/cabins/types/cabin.types";
import { resolveCabinPrice } from "@/features/cabins/utils/cabin-price";
import OfferCard from "@/features/landing/components/OfferCard";
import SectionHeading from "@/features/landing/components/SectionHeading";
import Carousel from "@/components/ui/Carousel";

export type BudgetStaysProps = {
  /**
   * اقامتگاه‌های اقتصادی — از قبل **مرتب‌شده بر اساس ارزان‌ترین قیمت مؤثر
   * (`?sort=price_asc`) و محدودشده** توسط API می‌آید؛ پس اینجا سورت کلاینتی
   * انجام نمی‌شود.
   */
  cabins: Cabin[];
};

export default function BudgetStays({ cabins }: BudgetStaysProps) {
  if (!cabins.length) return null;

  return (
    <section
      id="budget-stays"
      className="bg-background px-4 py-14 md:px-6 md:py-20"
    >
      <Container>
        <SectionHeading
          eyebrow="سفر خوش‌قیمت"
          title={
            <>
              اقامتگاه‌های <span className="text-secondary-500">اقتصادی</span>
            </>
          }
          href="/cabins"
        />
        <div
          data-animate="reveal"
          className="border-secondary-400/25 bg-surface mb-7 flex items-start gap-3 rounded-2xl border p-4"
        >
          <Wallet size={20} className="text-secondary-500 mt-1 shrink-0" />
          <p className="text-text-gray text-sm leading-7">
            گزینه‌های خوش‌قیمت برای سفر بعدی شما؛ مرتب‌شده بر اساس قیمت هر شب پس
            از تخفیف.
          </p>
        </div>
        <Carousel>
          {cabins.map((cabin) => {
            const { finalPrice, originalPrice } = resolveCabinPrice(cabin);
            return (
              <OfferCard
                key={cabin.id}
                cabin={cabin}
                price={finalPrice}
                originalPrice={originalPrice}
                badge="خوش‌قیمت"
              />
            );
          })}
        </Carousel>
      </Container>
    </section>
  );
}
