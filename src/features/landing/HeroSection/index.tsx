"use client";

import Image from "next/image";
import { MoveLeft, ChevronDown } from "lucide-react";

import BadgeTitle from "@/components/ui/BadgeTitle";
import Button from "@/components/ui/Button";
import useGsapHeroSection from "@/features/landing/HeroSection/useHeroAnimation";

import HERO_BG_URL from "@/assets/images/hero-section-bg.avif";

// const HERO_BG_URL =
//   "https://images.unsplash.com/photo-1544646280-aa1158259402?q=80&w=2400&auto=format&fit=crop";

export default function HeroSection() {
  const {
    badgeRef,
    bgImageRef,
    ctaRef,
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
      className="bg-background relative flex h-screen items-center justify-center overflow-hidden"
    >
      {/* بک‌گراند */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 scale-125 bg-cover bg-center select-none"
      >
        <Image
          fill
          preload
          className="object-cover"
          alt="کلبه‌های لوکس هورایزن در دامنه کوهستان"
          src={HERO_BG_URL}
        />
      </div>

      <div className="via-background/50 to-background absolute inset-0 bg-linear-to-b from-black/60" />
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/30" />

      {/* backTitle */}
      <div className="from-primary-500/15 absolute inset-0 bg-radial-[at_50%_38%] via-transparent to-transparent" />

      {/* Noiz bg*/}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="pointer-events-none absolute inset-5 z-30 hidden rounded-4xl border border-white/7 sm:inset-6 sm:block" />
      <span className="border-primary-400/40 pointer-events-none absolute top-9 left-9 z-30 hidden h-7 w-7 border-t border-r sm:block" />
      <span className="border-primary-400/40 pointer-events-none absolute top-9 right-9 z-30 hidden h-7 w-7 border-t border-l sm:block" />
      <span className="border-primary-400/40 pointer-events-none absolute bottom-9 left-9 z-30 hidden h-7 w-7 border-r border-b sm:block" />
      <span className="border-primary-400/40 pointer-events-none absolute right-9 bottom-9 z-30 hidden h-7 w-7 border-b border-l sm:block" />

      <div className="relative z-20 mx-auto max-w-4xl px-6 text-center">
        <BadgeTitle variant="point-animation" ref={badgeRef}>
          خانه
        </BadgeTitle>

        <h1 className="text-text mb-7 flex flex-col gap-y-4 text-5xl leading-[0.95] font-semibold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
          <span ref={titleTheRef} className="overflow-hidden">
            هورایزن
          </span>
          <span ref={titleHorizonRef} className="overflow-hidden"></span>
        </h1>

        <div className="*:to-primary-400/40 mb-8 flex items-center justify-center gap-4 *:h-px *:w-10 *:from-transparent *:md:w-14">
          <div ref={lineLeftRef} className="origin-right bg-linear-to-r" />
          <div ref={lineRightRef} className="origin-left bg-linear-to-l" />
        </div>

        <p
          ref={subtitleRef}
          className="text-text-gray mx-auto mb-10 max-w-xl text-base leading-relaxed font-light md:text-lg"
        >
          دور از هیاهوی شهر، در دل طبیعت اقامتی لوکس را تجربه کنید؛
          <br />
          با مناظری خیره‌کننده و لحظه‌هایی فراموش‌نشدنی.
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
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-1.5">
          <span className="sr-only">اسکرول کنید</span>
          <div className="from-primary-400/60 h-6 w-px bg-linear-to-b to-transparent" />
          <ChevronDown className="text-primary-400/70 size-4 animate-bounce" />
        </div>
      </div>
    </header>
  );
}
