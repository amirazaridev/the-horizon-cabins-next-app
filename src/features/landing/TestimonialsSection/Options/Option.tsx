import { type ReactNode } from "react";
import Stars from "../Stars";
import CardContainer from "@/components/ui/CardContainer";

type Props = {
  rating: number;
  text: string;
  image: string;
  name: string;
  role: string;
};

export default function Option({
  rating,
  text,
  image,
  name,
  role,
}: Props): ReactNode {
  return (
    <CardContainer className="testimonial-card hover:border-primary-400/20">
      <Stars countFill={rating} />

      <p className="text-text-gray mb-8 leading-relaxed">«{text}»</p>

      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold text-white">{name}</h4>
          <p className="text-sm text-white/50">{role}</p>
        </div>
      </div>
    </CardContainer>
  );
}
