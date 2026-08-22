import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function useGalleryAnimation() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gallery-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".gallery-title",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      const galleryItems = document.querySelectorAll(".gallery-item");
      galleryItems.forEach((item) => {
        gsap.fromTo(
          item,
          { y: 80, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );

        gsap.to(item.querySelector("img"), {
          y: -30,
          scale: 1.1,
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  return { sectionRef };
}
