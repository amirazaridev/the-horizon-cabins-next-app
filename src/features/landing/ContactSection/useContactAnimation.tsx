import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function useContactAnimation() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-content",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-content",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".contact-cta",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-cta",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          delay: 0.2,
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  return {sectionRef};
}
