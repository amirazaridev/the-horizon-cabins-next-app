"use client";

import useSectionReveal from "@/features/landing/shared/hooks/useSectionReveal";
import BackDropBlur from "@/components/ui/BackDropBlur";
import SectionTitle from "@/features/landing/shared/components/SectionTitle";
import Container from "@/components/ui/Container";
import TestimonialCard from "./TestimonialCard";
import { TESTIMONIALS } from "@/features/landing/shared/constants/testimonials";

const REVEAL_TARGETS = [
  { selector: ".testimonials-title" },
  {
    selector: ".testimonial-card",
    y: 80,
    rotateX: 10,
    stagger: 0.15,
    start: "top 90%",
  },
];

export default function TestimonialsSection() {
  const { sectionRef } = useSectionReveal(REVEAL_TARGETS);

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

        <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
      </Container>
    </section>
  );
}
