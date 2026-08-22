import gsap from "gsap";
import { useEffect, useRef } from "react";


export default function useAmenitiesAnimation() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".amenities-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".amenities-title",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      const items = document.querySelectorAll(".amenity-item");
      items.forEach((item, index) => {
        gsap.fromTo(
          item,
          {
            y: 60,
            opacity: 0,
            scale: 0.9,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
            delay: index * 0.1,
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  return { sectionRef };
}
