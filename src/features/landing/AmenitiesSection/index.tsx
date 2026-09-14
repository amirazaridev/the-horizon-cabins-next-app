"use client";

import useSectionReveal from "@/features/landing/shared/hooks/useSectionReveal";
import BackDropBlur from "@/components/ui/BackDropBlur";
import SectionTitle from "@/features/landing/shared/components/SectionTitle";
import Container from "@/components/ui/Container";
import AmenityCard from "./AmenityCard";
import { AMENITIES } from "@/features/landing/shared/constants/amenities";

const REVEAL_TARGETS = [
  { selector: ".amenities-title" },
  {
    selector: ".amenity-item",
    y: 60,
    scale: 0.9,
    duration: 0.8,
    stagger: 0.1,
    start: "top 90%",
  },
];

export default function AmenitiesSection() {
  const { sectionRef } = useSectionReveal(REVEAL_TARGETS);

  return (
    <section
      ref={sectionRef}
      className="bg-background-2 relative overflow-hidden px-6 py-24 md:py-32"
    >
      <BackDropBlur />

      <Container className="relative z-10">
        <SectionTitle
          className="amenities-title"
          subTitle="امکانات"
          title="هر آنچه"
          titlePri="نیاز دارید"
          parag="لوکس بودن با کارایی همراه است. هر جزئیات برای راحتی نهایی شما طراحی
            شده است."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {AMENITIES.map(({ icon: Icon, ...amenity }) => (
            <AmenityCard key={amenity.id} icon={<Icon />} {...amenity} />
          ))}
        </div>
      </Container>
    </section>
  );
}
