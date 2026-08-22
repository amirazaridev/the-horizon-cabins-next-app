"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import heroImageUrl from "@/assets/images/hero-section-bg.png";
import { MoveLeft } from "lucide-react";
import BadgeTitle from "@/components/ui/BadgeTitle";
import useGsapHeroSection from "../hooks/useHeroAnimation";

export default function HeroSection() {
  const {
    badgeRef,
    bgImageRef,
    ctaRef,
    dotRef,
    heroRef,
    lineLeftRef,
    lineRightRef,
    scrollIndicatorRef,
    subtitleRef,
    titleHorizonRef,
    titleTheRef,
  } = useGsapHeroSection();

  return (
    <header
      ref={heroRef}
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
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />

      <div className="relative z-20 mx-auto max-w-5xl px-6 text-center">
        <BadgeTitle ref={badgeRef}>ویلای لوکس</BadgeTitle>

        <h1 className="text-text mb-8 flex flex-col gap-y-6 text-5xl leading-[0.9] font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl 2xl:text-9xl">
          <span ref={titleTheRef} className="overflow-hidden">
            هورایزن
          </span>
          <span ref={titleHorizonRef} className="overflow-hidden">
            کابین‌
            <span ref={dotRef} className="text-primary-400 inline-block">
              .
            </span>
          </span>
        </h1>

        <div className="*:to-primary-400/50 mb-8 flex items-center justify-center gap-6 *:h-px *:w-16 *:from-transparent *:md:w-24">
          <div ref={lineLeftRef} className="origin-right bg-linear-to-r" />
          <div ref={lineRightRef} className="origin-left bg-linear-to-l" />
        </div>

        <p
          ref={subtitleRef}
          className="text-text-gray mx-auto mb-10 max-w-2xl text-lg leading-relaxed md:text-xl"
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
              <MoveLeft
                strokeWidth={2}
                className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
              />
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
    </header>
  );
}
