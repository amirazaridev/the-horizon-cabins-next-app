"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { HORIZON_IMAGES } from "@/features/landing/constants/horizon-home";
import Search from "./Search";

export default function Hero() {
  return (
    <header id="top" className="hz-hero relative min-h-190 overflow-hidden bg-overlay pt-28 pb-10 md:min-h-200 md:pt-36">
      <div className="hz-hero-bg absolute inset-0">
        <Image src={HORIZON_IMAGES.hero} alt="اقامتگاه هورایزن در دل طبیعت" fill priority sizes="100vw" className="object-cover object-center" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,21,39,.58)_0%,rgba(5,13,22,.58)_15%,rgba(5,12,9,.16)_30%)]" />
      <div className="pointer-events-none absolute inset-4 hidden rounded-3xl border border-white/8 sm:block" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col px-4 md:px-6">
        <div className="max-w-xl py-10 md:py-12 lg:py-16">
          <div className="hz-hero-eyebrow mb-5 text-[11px] font-semibold tracking-[0.22em] text-primary-400">HORIZON</div>

          <h1 className="hz-hero-title text-5xl leading-[1.08] font-black tracking-tight sm:text-6xl md:text-7xl lg:text-[82px] text-white">
            <span className="inline-block overflow-hidden align-bottom">
              <span className="hz-hero-word inline-block">جایی</span>
            </span>{" "}
            <span className="inline-block overflow-hidden align-bottom">
              <span className="hz-hero-word inline-block">برای</span>
            </span>{" "}
            <span className="inline-block overflow-hidden align-bottom">
              <span className="hz-hero-word inline-block text-primary-400">فرار</span>
            </span>
            <span className="block">
              <span className="inline-block overflow-hidden align-bottom">
                <span className="hz-hero-word inline-block">از</span>
              </span>{" "}
              <span className="inline-block overflow-hidden align-bottom">
                <span className="hz-hero-word inline-block">شلوغی</span>
              </span>
            </span>
          </h1>

          <p className="hz-hero-copy mt-6 max-w-lg text-sm leading-8 sm:text-base text-white">
            اقامتگاه‌ها را در زیباترین گوشه‌های ایران پیدا کنید؛ جایی که طبیعت و تجربه‌ای آرامش‌بخش کنار هم قرار می‌گیرند.
          </p>
        </div>

        <div className="mt-12 md:mt-16">
          <Search />
        </div>
        <div className="mt-7 flex justify-center text-white/55">
          <ChevronDown className="hz-scroll-indicator animate-bounce" size={20} />
        </div>
      </div>
    </header>
  );
}