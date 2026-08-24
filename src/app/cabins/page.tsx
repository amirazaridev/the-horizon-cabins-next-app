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
    <section className="min-h-screen bg-slate-950 py-16 sm:py-20 md:py-24">
      <Container>
        <div className="mx-auto mb-12 max-w-4xl text-center sm:mb-16">
          <div className="mb-8 inline-flex">
            <BadgeTitle>مجموعه سوئیت‌ها</BadgeTitle>
          </div>
          <h1 className="mb-6 text-4xl leading-[1.1] font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl">
            سوئیت‌های
            <br />
            <span className="text-primary-400">لوکس</span>
            <span className="text-white">.</span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/60 sm:text-xl">
            مجموعه‌ای منحصربه‌فرد از اقامتگاه‌های لوکس در طبیعت ایران؛ از
            سوئیت‌های چوبی در دل جنگل‌های هیرکانی شمال تا سوئیت‌های ساحلی کنار
            دریای خزر و بوم‌گردی‌های آرام شرق کشور. هر اقامتگاه با دقت طراحی
            شده تا تجربه‌ای فراموش‌نشدنی از آسایش و طبیعت را برای شما رقم بزند.
          </p>
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
