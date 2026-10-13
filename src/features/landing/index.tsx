import ExperienceBanner from "@/features/landing/components/ExperienceBanner";
import Hero from "@/features/landing/components/Hero";
import LastMinute from "@/features/landing/components/LastMinute";
import BudgetStays from "@/features/landing/components/BudgetStays";
import Stays from "@/features/landing/components/Stays";
import Testimonials from "@/features/landing/components/Testimonials";
import Destinations from "@/features/landing/components/Destinations";
import Categories from "@/features/landing/components/Categories";
import LandingAnimationProvider from "@/features/landing/components/LandingAnimationProvider";
import { SearchPreview } from "@/features/search";
import {
  getLastMinuteCabins,
  getPopularCities,
  queryCabins,
} from "@/features/cabins/api";
import { getCategories } from "@/features/cabins/api/getCategories";

export default async function Landing() {
  const [
    categories,
    popularCities,
    featuredCabins,
    lastMinuteCabins,
    budgetCabins,
  ] = await Promise.all([
    getCategories(),
    getPopularCities(8),
    queryCabins({ sort: "most_booked", limit: 6 }).then((res) => res.cabins),
    getLastMinuteCabins(5),
    queryCabins({ sort: "price_asc", limit: 3 }).then((res) => res.cabins),
  ]);

  return (
    <LandingAnimationProvider>
      <Hero />
      <SearchPreview />
      <Categories categories={categories} />
      <Destinations cities={popularCities} />
      <Stays cabins={featuredCabins} />
      <LastMinute cabins={lastMinuteCabins} />
      <BudgetStays cabins={budgetCabins} />
      <ExperienceBanner />
      <Testimonials />
    </LandingAnimationProvider>
  );
}
