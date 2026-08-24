import { type ReactNode } from "react";
import { COMMENTS } from "@/constants/comments-section-landing";
import Option from "./Option";

export default function Options(): ReactNode {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
      {COMMENTS.map((testimonial) => (
        <Option {...testimonial} key={testimonial.id} />
      ))}
    </div>
  );
}
