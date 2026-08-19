"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import heroImageUrl from "@/assets/images/hero-section-bg.png";



export default function Hero() {
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

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative flex h-screen items-center justify-center overflow-hidden pt-9"
    >
      <div
        ref={bgImageRef}
        className="absolute inset-0 scale-125 bg-cover bg-center select-none"
      >
        <Image
          className="object-cover"
          fill
          alt="hero-section-image"
          src={heroImageUrl}
          priority
          placeholder="blur"
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />

      <div className="relative z-20 mx-auto max-w-5xl px-6 text-center">
        <div ref={badgeRef} className="mb-8 inline-flex">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-sm">
            <div className="bg-primary-400 size-2 animate-pulse rounded-full" />
            <span className="text-primary-400 text-xs font-medium tracking-wider md:text-sm">
              ویلای لوکس
            </span>
          </div>
        </div>

        <h1 className="mb-8 text-5xl leading-[0.9] font-bold tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl 2xl:text-9xl">
          <span ref={titleTheRef} className="inline-block overflow-hidden">
            هورایزن
          </span>
          <br />
          <span ref={titleHorizonRef} className="inline-block overflow-hidden">
            کابین‌
            <span ref={dotRef} className="text-primary-400 inline-block">
              .
            </span>
          </span>
        </h1>

        <div className="mb-8 flex items-center justify-center gap-6">
          <div
            ref={lineLeftRef}
            className="to-primary-400/50 h-px w-16 origin-right bg-linear-to-r from-transparent md:w-24"
          />
          <div
            ref={lineRightRef}
            className="to-primary-400/50 h-px w-16 origin-left bg-linear-to-l from-transparent md:w-24"
          />
        </div>

        <p
          ref={subtitleRef}
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl"
        >
          از شلوغی شهر فاصله بگیرید و در دل طبیعت، لوکس بودن را تجربه کنید.
          <br />
          با منظره‌های خیره‌کننده و لحظه‌های فراموش‌نشدنی.
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col justify-center gap-3 px-4 sm:flex-row sm:gap-4"
        >
          <button className="group bg-primary-400 hover:shadow-primary-400/30 relative overflow-hidden rounded-full px-8 py-4 font-semibold text-black transition-all duration-300 hover:shadow-lg">
            <span className="relative z-10 flex items-center justify-center gap-2">
              مشاهده کابین‌ها
              <svg
                className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </button>
          <a
            href="#about"
            className="rounded-full border border-white/20 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
          >
            بیشتر بدانید
          </a>
        </div>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs tracking-widest text-white/40">
            اسکرول کنید
          </span>
          <div className="from-primary-400/50 h-8 w-px bg-linear-to-b to-transparent" />
        </div>
      </div>
    </section>
  );
}
