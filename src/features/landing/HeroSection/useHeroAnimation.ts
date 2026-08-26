import gsap from "gsap";
import {  useEffect, useRef, } from "react";

export default function useHeroAnimation() {
  const heroRef = useRef<HTMLElement>(null);
  const titleTheRef = useRef<HTMLSpanElement>(null);
  const titleHorizonRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const lineLeftRef = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
      });

      tl.set([titleTheRef.current, titleHorizonRef.current], {
        yPercent: 110,
        opacity: 0,
      });
      tl.set(subtitleRef.current, { y: 40, opacity: 0 });
      tl.set(ctaRef.current, { y: 30, opacity: 0 });
      tl.set(badgeRef.current, { scale: 0.8, opacity: 0 });
      tl.set(scrollIndicatorRef.current, { opacity: 0 });
      tl.set(dotRef.current, { scale: 0 });
      tl.set([lineLeftRef.current, lineRightRef.current], { scaleX: 0 });

      tl.to(
        bgImageRef.current,
        { scale: 1, duration: 2, ease: "power2.out" },
        0,
      );

      tl.to(
        lineLeftRef.current,
        { scaleX: 1, duration: 0.8, ease: "power3.inOut" },
        0.3,
      );
      tl.to(
        lineRightRef.current,
        { scaleX: 1, duration: 0.8, ease: "power3.inOut" },
        0.3,
      );

      tl.to(
        dotRef.current,
        { scale: 1, duration: 0.5, ease: "back.out(3)" },
        1.5,
      );

      tl.to(
        titleTheRef.current,
        { yPercent: 0, opacity: 1, duration: 1, ease: "power4.out" },
        0.5,
      );
      tl.to(
        titleHorizonRef.current,
        { yPercent: 0, opacity: 1, duration: 1, ease: "power4.out" },
        0.7,
      );

      tl.to(
        badgeRef.current,
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)" },
        1.2,
      );

      tl.to(
        subtitleRef.current,
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        1.4,
      );

      tl.to(
        ctaRef.current,
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        1.6,
      );

      tl.to(scrollIndicatorRef.current, { opacity: 1, duration: 0.6 }, 2);

      gsap.to(bgImageRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(titleTheRef.current, {
        y: -60,
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "20% top",
          end: "60% top",
          scrub: 1,
        },
      });

      gsap.to(titleHorizonRef.current, {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "20% top",
          end: "70% top",
          scrub: 1,
        },
      });

      gsap.to(subtitleRef.current, {
        y: -50,
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "30% top",
          end: "70% top",
          scrub: 1,
        },
      });

      gsap.to(ctaRef.current, {
        y: -30,
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "40% top",
          end: "80% top",
          scrub: 1,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return {
    heroRef,
    titleTheRef,
    titleHorizonRef,
    badgeRef,
    subtitleRef,
    ctaRef,
    scrollIndicatorRef,
    bgImageRef,
    lineLeftRef,
    lineRightRef,
    dotRef,
  };
}
