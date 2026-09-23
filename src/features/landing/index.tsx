import ExperienceBanner from "./components/ExperienceBanner";
import Experiences from "./components/Experiences";
import Hero from "./components/Hero";
import LastMinute, { type LastMinuteProps } from "./components/LastMinute";
import BudgetStays, { type BudgetStaysProps } from "./components/BudgetStays";
import Stays from "./components/Stays";
import Testimonials from "./components/Testimonials";
import Destinations from "./components/Destinations";
import Categories from "./components/Categories";
import LandingAnimationProvider from "@/features/landing/components/LandingAnimationProvider";
import { getCabins } from "../cabins/api";

type Props = {
  lastMinute?: LastMinuteProps;
  budgetStays?: BudgetStaysProps;
};


export default async function Landing({ lastMinute, budgetStays }: Props) {
  const cabins = await getCabins();
  const demoOffers = cabins.slice(0, 3).map((cabin) => ({
    cabin,
    price: Math.round(cabin.regularPrice * 0.8),
  }));

  return (
    <LandingAnimationProvider>
      <Hero />
      <Categories />
      <Destinations />
      <Stays cabins={cabins} />
      <LastMinute {...(lastMinute ?? { offers: demoOffers })} />
      <BudgetStays {...(budgetStays ?? { cabins })} />
      <ExperienceBanner />
      <Experiences />
      <Testimonials />
    </LandingAnimationProvider>
  );
}
