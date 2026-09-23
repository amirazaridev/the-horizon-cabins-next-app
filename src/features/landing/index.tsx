"use client"

import ExperienceBanner from "./components/ExperienceBanner";
import Experiences from "./components/Experiences";
import Hero from "./components/Hero";
import LastMinute, { type LastMinuteProps } from "./components/LastMinute";
import BudgetStays, { type BudgetStaysProps } from "./components/BudgetStays";
import Stays from "./components/Stays";
import Testimonials from "./components/Testimonials";
import Destinations from "./components/Destinations";
import useHorizonLandingAnimation from "./hooks/useHorizonLandingAnimation";
import { Cabin } from "@/features/cabins/lib/data-service";
import Categories from "./components/Categories";

type Props = {
  cabins: Cabin[];
  lastMinute?: LastMinuteProps;
  budgetStays?: BudgetStaysProps;
};

export default function Landing({
  cabins,
  lastMinute,
  budgetStays,
}: Props) {
  const { landingRef } = useHorizonLandingAnimation();
  const demoOffers = cabins.slice(0, 3).map((cabin) => ({
    cabin,
    price: Math.round(cabin.regularPrice * 0.8),
  }));
  return (
    <div ref={landingRef} className="bg-background text-text min-h-screen">
      <Hero />
      <Categories />
      <Destinations />
      <Stays cabins={cabins.slice(0, 3)} />
      <LastMinute {...(lastMinute ?? { offers: demoOffers })} />
      <BudgetStays {...(budgetStays ?? { cabins })} />
      <ExperienceBanner />
      <Experiences />
      <Testimonials />
    </div>
  );
}
