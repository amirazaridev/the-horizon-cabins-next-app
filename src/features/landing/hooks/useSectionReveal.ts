import gsap from "gsap";
import { useEffect, useRef } from "react";

export type RevealTarget = {
  selector: string;
  y?: number;
  scale?: number;
  rotateX?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  start?: string;
  parallaxChildSelector?: string;
};

export default function useSectionReveal(targets: RevealTarget[]) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      targets.forEach((target) => {
        const elements = gsap.utils.toArray<HTMLElement>(target.selector);

        elements.forEach((element, index) => {
          gsap.fromTo(
            element,
            {
              y: target.y ?? 60,
              opacity: 0,
              scale: target.scale ?? 1,
              rotateX: target.rotateX ?? 0,
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotateX: 0,
              duration: target.duration ?? 1,
              ease: "power3.out",
              delay:
                target.delay ??
                (target.stagger ? index * target.stagger : 0),
              scrollTrigger: {
                trigger: element,
                start: target.start ?? "top 85%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });

        if (target.parallaxChildSelector) {
          const childSelector = target.parallaxChildSelector;
          elements.forEach((element) => {
            const child = element.querySelector(childSelector);
            if (!child) return;

            gsap.to(child, {
              y: -30,
              scale: 1.1,
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: 2,
              },
            });
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [targets]);

  return { sectionRef };
}
