import { Metadata } from "next";
import { Suspense } from "react";
import CabinList from "../../features/cabins/components/CabinList";
import Filter from "../../features/cabins/components/Filter";
import Spinner from "../../components/ui/spinner";
import Container from "@/components/ui/Container";
import BadgeTitle from "@/components/ui/BadgeTitle";

export const metadata: Metadata = {
  title: "کابین‌های لوکس | هورایزن کابینز",
  description:
    "مجموعه کامل کابین‌های لوکس در قلب طبیعت. از پناهگاه‌های صمیمی تا ویلاهای hoàng gia با امکانات کامل.",
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
            <BadgeTitle>مجموعه کابین ها</BadgeTitle>
          </div>
          <h1 className="mb-6 text-4xl leading-[1.1] font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl">
            کابین‌های
            <br />
            <span className="text-primary-400">لوکس</span>
            <span className="text-white">.</span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/60 sm:text-xl">
            مجموعه‌ای منحصر به فرد از کابین‌های لوکس در قلب طبیعت بکر. از
            پناهگاه‌های صمیمی برای دو نفر تا ویلاهای hoàng gia برای Familien
            بزرگ. هر کابین با دقت طراحی شده تا تجربه‌ای فراموش‌نشدنی از آسایش و
            لوکس را فراهم آورد.
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
