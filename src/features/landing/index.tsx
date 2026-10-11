import ExperienceBanner from "./components/ExperienceBanner";
import Experiences from "./components/Experiences";
import Hero from "./components/Hero";
import LastMinute from "./components/LastMinute";
import BudgetStays from "./components/BudgetStays";
import Stays from "./components/Stays";
import Testimonials from "./components/Testimonials";
import Destinations from "./components/Destinations";
import Categories from "./components/Categories";
import LandingAnimationProvider from "@/features/landing/components/LandingAnimationProvider";
import { SearchPreview } from "@/features/search";
import {
  getLastMinuteCabins,
  getPopularCities,
  queryCabins,
} from "@/features/cabins/api";

/**
 * صفحه‌ی لندینگ — همه‌ی سکشن‌ها از API تغذیه می‌شوند (بدون داده‌ی hard-coded).
 *
 *  - مقاصد محبوب   → `GET /locations/cities/popular` (بیشترین رزرو، limit=۸)
 *  - منتخب         → `GET /cabins?sort=most_booked&limit=۶`
 *  - لحظه‌آخری     → `GET /cabins/last-minute` (تخفیف‌های امروز/فردا، limit=۵)
 *  - اقتصادی       → `GET /cabins?sort=price_asc&limit=۳`
 */
export default async function Landing() {
  const [popularCities, featuredCabins, lastMinuteCabins, budgetCabins] =
    await Promise.all([
      getPopularCities(8),
      queryCabins({ sort: "most_booked", limit: 6 }).then((res) => res.cabins),
      getLastMinuteCabins(5),
      queryCabins({ sort: "price_asc", limit: 3 }).then((res) => res.cabins),
    ]);

  return (
    <LandingAnimationProvider>
      <Hero />
      <SearchPreview />
      <Categories />
      <Destinations cities={popularCities} />
      <Stays cabins={featuredCabins} />
      <LastMinute cabins={lastMinuteCabins} />
      <BudgetStays cabins={budgetCabins} />
      <ExperienceBanner />
      <Experiences />
      <Testimonials />
    </LandingAnimationProvider>
  );
}
