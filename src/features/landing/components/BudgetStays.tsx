import { Wallet } from "lucide-react";
import Container from "@/components/ui/Container";
import type { Cabin } from "@/features/cabins/lib/data-service";
import OfferCard from "./OfferCard";
import SectionHeading from "./SectionHeading";
import Carousel from "@/components/ui/Carousel";

export type BudgetStaysProps = {
  cabins: Cabin[];
  limit?: number;
};

export default function BudgetStays({ cabins, limit = 3 }: BudgetStaysProps) {
  const priceOf = (cabin: Cabin) => Math.max(0, cabin.regularPrice - cabin.discount);
  const budgetCabins = [...cabins]
    .sort((a, b) => priceOf(a) - priceOf(b))
    .slice(0, Math.max(0, limit));

  if (!budgetCabins.length) return null;

  return (
    <section id="budget-stays" className="bg-background px-4 py-14 md:px-6 md:py-20">
      <Container>
        <SectionHeading eyebrow="سفر خوش‌قیمت" title={<>اقامتگاه‌های <span className="text-secondary-500">اقتصادی</span></>} href="/cabins" />
        <div className="hz-reveal mb-7 flex items-start gap-3 rounded-2xl border border-secondary-400/25 bg-surface p-4">
          <Wallet size={20} className="mt-1 shrink-0 text-secondary-500" />
          <p className="text-sm leading-7 text-text-gray">
            گزینه‌های خوش‌قیمت برای سفر بعدی شما؛ مرتب‌شده بر اساس قیمت هر شب پس از تخفیف.
          </p>
        </div>
        <Carousel>
          {budgetCabins.map((cabin) => (
            <OfferCard key={cabin.id} cabin={cabin} price={priceOf(cabin)} badge="خوش‌قیمت" />
          ))}
        </Carousel>
      </Container>
    </section>
  );
}