"use client";
import BackDropBlur from "@/components/ui/BackDropBlur";
import useTestimonialsAnimation from "./useTestimonialsAnimation";
import SectionTitle from "../SectionTitle";
import Container from "@/components/ui/Container";
import Options from "./Options";


export default function TestimonialsSection() {
  const { sectionRef } = useTestimonialsAnimation();

  return (
    <section
      ref={sectionRef}
      className="bg-background-2 relative overflow-hidden px-6 py-24 md:py-32"
    >
      <BackDropBlur type="double" />

      <Container className="relative z-10">
        <SectionTitle
          className="testimonials-title"
          subTitle="نظرات مشتریان"
          title="مهمانان ما"
          titlePri="چه می‌گویند"
        />

        <Options />
      </Container>
    </section>
  );
}
