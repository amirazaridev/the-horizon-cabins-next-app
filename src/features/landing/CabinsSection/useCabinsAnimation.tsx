import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function useCabinsAnimation() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".cabins-title",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      titleTl
        .from(".section-title-eyebrow", {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        })
        .from(
          ".section-title-line",
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
          },
          "-=0.35",
        )
        .from(
          ".section-title-subtext",
          { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" },
          "-=0.4",
        );

      const cards = gsap.utils.toArray(
        cardsRef.current?.children ?? [],
      ) as HTMLElement[];

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 90, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            delay: reduceMotion ? 0 : i * 0.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );

        const imageWrap = card.querySelector<HTMLElement>(".cabin-image-wrap");
        if (imageWrap && !reduceMotion) {
          gsap.fromTo(
            imageWrap,
            { yPercent: -14 },
            {
              yPercent: 14,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        }
      });

      // --- Hover tilt: owns rotateX/rotateY only, desktop + fine pointer ---
      mm.add("(hover: hover) and (pointer: fine)", () => {
        if (reduceMotion) return;

        const cleanups: Array<() => void> = [];

        cards.forEach((card) => {
          const setRotateX = gsap.quickTo(card, "rotationX", {
            duration: 0.5,
            ease: "power3.out",
          });
          const setRotateY = gsap.quickTo(card, "rotationY", {
            duration: 0.5,
            ease: "power3.out",
          });

          const handleMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            setRotateY(px * 10);
            setRotateX(-py * 10);
          };
          const handleLeave = () => {
            setRotateX(0);
            setRotateY(0);
          };

          card.addEventListener("mousemove", handleMove);
          card.addEventListener("mouseleave", handleLeave);

          cleanups.push(() => {
            card.removeEventListener("mousemove", handleMove);
            card.removeEventListener("mouseleave", handleLeave);
          });
        });

        return () => cleanups.forEach((fn) => fn());
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return { sectionRef, cardsRef };
}
