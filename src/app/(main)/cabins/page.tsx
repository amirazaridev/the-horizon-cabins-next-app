import { Metadata } from "next";
import { Suspense } from "react";
import CabinList from "@/features/cabins/components/CabinList";
import Filter from "@/features/cabins/components/Filter";
import Spinner from "@/components/ui/Spinner";
import Container from "@/components/ui/Container";
import BadgeTitle from "@/components/ui/BadgeTitle";

export const metadata: Metadata = {
  title: "سوئیت‌های لوکس | هورایزن کابینز",
  description:
    "مجموعه کامل سوئیت‌ها و اقامتگاه‌های لوکس در طبیعت ایران؛ از سوئیت‌های چوبی جنگل‌های هیرکانی تا اقامتگاه‌های ساحلی خزر.",
};

export default async function CabinsPage({
  searchParams,
}: {
  searchParams: Promise<{ capacity?: string }>;
}) {
  const { capacity = "all" } = await searchParams;

  return (
    <section className="min-h-screen bg-background py-13 sm:py-18 md:py-20">
      <Container>
        <div className="mx-auto mb-7 max-w-4xl text-center sm:mb-9">
          <div className="mb-8 inline-flex">
            <BadgeTitle variant="point-animation">مجموعه سوئیت‌ها</BadgeTitle>
          </div>
          
        </div>

        <div className="mb-10 flex justify-center">
          <Filter />
        </div>

        <Suspense
          fallback={<Spinner size="lg" label="درحال بارگزاری ..." fullWidth />}
          key={capacity}
        >
          <CabinList filter={capacity} />
        </Suspense>
      </Container>
    </section>
  );
}
