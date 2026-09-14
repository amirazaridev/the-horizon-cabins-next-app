import { type ReactNode } from "react";
import Stars from "./Stars";
import CardContainer from "@/components/ui/CardContainer";
import type { Testimonial } from "@/features/landing/shared/constants/testimonials";

type Props = Testimonial;

export default function TestimonialCard({
  rating,
  text,
  image,
  name,
  role,
}: Props): ReactNode {
  return (
    <CardContainer className="testimonial-card hover:border-primary-400/20">
      <Stars filledCount={rating} />

      <p className="text-text-gray mb-8 leading-relaxed">«{text}»</p>

      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <h4 className="text-text font-semibold">{name}</h4>
          <p className="text-text-gray text-sm">{role}</p>
        </div>
      </div>
    </CardContainer>
  );
}
