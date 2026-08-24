"use client";

import useAmenitiesAnimation from "@/features/landing/AmenitiesSection/useAmenitiesAnimation";
import BackDropBlur from "@/components/ui/BackDropBlur";
import Options from "./Options";
import SectionTitle from "../SectionTitle";
import Container from "@/components/ui/Container";

export default function AmenitiesSection() {
  const { sectionRef } = useAmenitiesAnimation();

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

        <Options />
      </Container>
    </section>
  );
}
