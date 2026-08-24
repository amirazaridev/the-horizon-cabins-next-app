import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function useTestimonialsAnimation() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonials-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".testimonials-title",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      const cards = document.querySelectorAll(".testimonial-card");
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0, rotateX: 10 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
            delay: index * 0.15,
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  return {sectionRef}
}
