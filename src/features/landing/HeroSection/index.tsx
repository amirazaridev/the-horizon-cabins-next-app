"use client";

import Image from "next/image";
import { MoveLeft } from "lucide-react";

import heroImageUrl from "@/assets/images/hero-section-bg.png";
import BadgeTitle from "@/components/ui/BadgeTitle";
import Button from "@/components/ui/Button";
import useGsapHeroSection from "@/features/landing/HeroSection/useHeroAnimation";

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
          alt="header image"
          src={heroImageUrl}
          preload
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
          <Button href="/cabins">
            مشاهده کابین‌ها
            <MoveLeft
              strokeWidth={2}
              className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
            />
          </Button>
          <Button href="#about" variant="outline">
            بیشتر بدانید
          </Button>
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
