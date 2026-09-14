"use client";
import CabinCard from "@/features/cabins/components/CabinCard";
import Container from "@/components/ui/Container";
import useCabinsAnimation from "@/features/landing/CabinsSection/useCabinsAnimation";
import SectionTitle from "@/features/landing/shared/components/SectionTitle";
import { Cabin } from "@/features/cabins/lib/data-service";

export default function CabinsSection({ cabins }: { cabins: Cabin[] }) {
  const { cardsRef, sectionRef } = useCabinsAnimation();

  return (
    <section
      ref={sectionRef}
      className="bg-background relative overflow-hidden px-6 py-24 md:py-32"
    >
      <Container>
        <SectionTitle
          forCabin
          className="cabins-title"
          subTitle="کابین‌های ما"
          title="سوئیت خودتان"
          titlePri="را انتخاب کنید"
          parag="هر کابین به طور منحصربه‌فردی طراحی شده تا تجربه‌ای فوق‌العاده در دل
            طبیعت ارائه دهد."
        />

        <div
          ref={cardsRef}
          className="grid grid-cols-1 gap-6 perspective-[1200] sm:grid-cols-2 md:gap-8 lg:grid-cols-3"
        >
          {cabins.map((cabin) => (
            <CabinCard
              key={cabin.id}
              cabin={cabin}

              href={`/cabins/${cabin.id}`}
              animation="hover"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
