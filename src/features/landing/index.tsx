"use client";

import HorizonExperienceBanner from "./components/HorizonExperienceBanner";
import HorizonExperiences from "./components/HorizonExperiences";
import HorizonHero from "./components/HorizonHero";
import HorizonLastMinute, { type HorizonLastMinuteProps } from "./components/HorizonLastMinute";
import HorizonBudgetStays, { type HorizonBudgetStaysProps } from "./components/HorizonBudgetStays";
import HorizonStays from "./components/HorizonStays";
import HorizonTestimonials from "./components/HorizonTestimonials";
import HorizonDestinations from "./components/HorizonDestinations";
import useHorizonLandingAnimation from "./hooks/useHorizonLandingAnimation";
import { Cabin } from "@/features/cabins/lib/data-service";
import HorizonCategories from "./components/HorizonCategories";

type Props = {
  cabins: Cabin[];
  lastMinute?: HorizonLastMinuteProps;
  budgetStays?: HorizonBudgetStaysProps;
};

export default function HorizonLanding({ cabins, lastMinute, budgetStays }: Props) {
  const { landingRef } = useHorizonLandingAnimation();
  const demoOffers = cabins.slice(0, 3).map((cabin) => ({
    cabin,
    price: Math.round(cabin.regularPrice * 0.8),
  }));
  return (
    <div ref={landingRef} className="bg-background text-text min-h-screen">
      <HorizonHero />
      <HorizonCategories />
      <HorizonLastMinute {...(lastMinute ?? { offers: demoOffers, isDemo: true })} />
      <HorizonDestinations />
      <HorizonStays cabins={cabins.slice(0, 3)} />
      <HorizonBudgetStays {...(budgetStays ?? { cabins, isDemo: true })} />
      <HorizonExperienceBanner />
      <HorizonExperiences />
      <HorizonTestimonials />
    </div>
  );
}
