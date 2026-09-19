import { Wallet } from "lucide-react";
import Container from "@/components/ui/Container";
import type { Cabin } from "@/features/cabins/lib/data-service";
import HorizonOfferCard from "./HorizonOfferCard";
import HorizonSectionHeading from "./HorizonSectionHeading";

export type HorizonBudgetStaysProps = {
  cabins: Cabin[];
  limit?: number;
  isDemo?: boolean;
};

export default function HorizonBudgetStays({ cabins, limit = 3, isDemo = false }: HorizonBudgetStaysProps) {
  const priceOf = (cabin: Cabin) => Math.max(0, cabin.regularPrice - cabin.discount);
  const budgetCabins = [...cabins]
    .sort((a, b) => priceOf(a) - priceOf(b))
    .slice(0, Math.max(0, limit));

  if (!budgetCabins.length) return null;

  return (
    <section id="budget-stays" className="bg-background px-4 py-14 md:px-6 md:py-20">
      <Container>
        <HorizonSectionHeading eyebrow="سفر خوش‌قیمت" title={<>اقامتگاه‌های <span className="text-secondary-500">اقتصادی</span></>} href="/cabins" />
        <div className="hz-reveal mb-7 flex items-start gap-3 rounded-2xl border border-secondary-400/25 bg-surface p-4">
          <Wallet size={20} className="mt-1 shrink-0 text-secondary-500" />
          <p className="text-sm leading-7 text-text-gray">
            {isDemo ? "چیدمان نمایشی؛ گزینه‌های موجود بر اساس کمترین قیمت نهایی هر شب مرتب شده‌اند." : "گزینه‌های خوش‌قیمت برای سفر بعدی شما؛ مرتب‌شده بر اساس قیمت هر شب پس از تخفیف."}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgetCabins.map((cabin) => (
            <HorizonOfferCard key={cabin.id} cabin={cabin} price={priceOf(cabin)} badge="خوش‌قیمت" />
          ))}
        </div>
      </Container>
    </section>
  );
}