import Image from "next/image";
import type { ReactNode } from "react";

import { HORIZON_IMAGES } from "@/features/landing/constants";
import { HeroSearch } from "@/features/search";
import { getCities, getRegions } from "@/features/cabins/api";
import { getPublicSettings } from "@/features/settings/api/getPublicSettings";
import { toSearchRegions } from "@/features/search/constants/regions";

function HeroWord({
  children,
  highlight = false,
}: {
  children: ReactNode;
  highlight?: boolean;
}) {
  return (
    <span className="inline-block overflow-hidden align-bottom">
      <span
        data-animate="hero-word"
        className={`inline-block ${highlight ? "text-primary-400" : ""}`}
      >
        {children}
      </span>
    </span>
  );
}

export default async function Hero() {
  const [cities, apiRegions, settings] = await Promise.all([
    getCities(),
    getRegions(),
    getPublicSettings(),
  ]);
  const regions = toSearchRegions(apiRegions);

  return (
    <header
      id="top"
      data-animate="hero"
      className="bg-overlay relative flex max-h-[80svh] flex-col justify-center overflow-x-clip pt-20 pb-5 2xl:h-[70svh] md:pt-24 md:pb-6"
    >
      <div
        data-animate="hero-bg"
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src={HORIZON_IMAGES.hero}
          alt="رزرو ویلا و کلبه در دل طبیعت ایران"
          fill
          preload
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div aria-hidden="true" className="absolute inset-0 bg-black/30" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,17,30,0.7)_0%,rgba(7,17,30,0.42)_38%,rgba(7,17,30,0.12)_68%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(225deg,rgba(7,17,30,0.55)_0%,transparent_45%)]"
      />

      <div className="z-10 mx-auto flex w-full max-w-6xl flex-col px-4 md:px-6">
        <div className="max-w-2xl pt-6.5 pb-16">
          <h1 className="text-3xl leading-[1.15] font-black tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            <HeroWord>رزرو</HeroWord> <HeroWord highlight>ویلا،</HeroWord>{" "}
            <HeroWord>کلبه</HeroWord>
            <span className="block">
              <HeroWord>و</HeroWord> <HeroWord>اقامتگاه</HeroWord>{" "}
              <HeroWord>در ایران</HeroWord>
            </span>
          </h1>

          <p
            data-animate="hero-copy"
            className="mt-3 max-w-lg text-[13px] leading-7 text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)] sm:text-sm md:text-base md:leading-8"
          >
            از جنگل‌های شمال تا ساحل و کویر؛ اقامتگاه‌های تمیز و تاییدشده را
            آنلاین رزرو کنید — بدون واسطه.
          </p>
        </div>

        <div className="absolute inset-x-0 -bottom-5 z-20 mt-6 md:-bottom-9 md:mt-17.5">
          <HeroSearch
            cities={cities}
            regions={regions}
            bookingWindowDays={settings.maxAdvanceBookingDays}
          />
        </div>
      </div>
    </header>
  );
}
