import { MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import Carousel from "@/components/ui/Carousel";
import type { PopularCity } from "@/features/cabins/types/city.types";
import fallbackCityImage from "@/assets/images/dark-hero-section1.jpeg";
import SectionHeading from "@/features/landing/components/SectionHeading";
import ImageOverlayCard from "@/features/landing/components/ImageOverlayCard";

const CITY_CARD_SIZES =
  "(min-width: 1024px) 23vw, (min-width: 640px) 38vw, 64vw";

/**
 * سکشن «مقاصد محبوب» — کاروسل شهرهای پرطرفدار.
 *
 * داده از `GET /locations/cities/popular` می‌آید (مرتب بر اساس بیشترین
 * تعداد رزرو). اگر شهری `imageUrl` نداشت، از یک عکس داخلی Next استفاده
 * می‌شود. هر کارت به جستجوی همان شهر لینک می‌شود (`/cabins?city=<id>`).
 */
export default function Destinations({ cities }: { cities: PopularCity[] }) {
  if (!cities.length) return null;

  return (
    <section
      id="destinations"
      className="bg-background-2 px-4 py-16 md:px-6 md:py-20"
    >
      <Container>
        <SectionHeading eyebrow="مقاصد محبوب" title="بهترین مقاصد ایران" />
        <Carousel slideClassName="flex-[0_0_64%] sm:flex-[0_0_38%] lg:flex-[0_0_23%]">
          {cities.map((city) => (
            <ImageOverlayCard
              key={city.id}
              href={`/cabins?city=${city.id}`}
              image={city.imageUrl || fallbackCityImage}
              imageAlt={city.name}
              sizes={CITY_CARD_SIZES}
              aspectClassName="aspect-[1.35/1]"
              gradientClassName="bg-linear-to-t from-overlay via-overlay/10 to-transparent"
              /* ⚠️ `data-animate="reveal"` قلاب انیمیشن ورود لندینگ است؛
                 GSAP در `useLandingAnimation` همه‌ی این المان‌ها را batch
                 می‌کند. بدون این صفت، کارت‌های مقاصد بدون انیمیشن ظاهر
                 می‌شوند. */
              data-animate="reveal"
            >
              <div className="absolute inset-x-3 bottom-3">
                <div className="mb-1 text-sm font-bold text-white">
                  {city.name}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-white/55">
                  <MapPin size={12} />
                  {city.cabinsCount.toLocaleString("fa-IR")} اقامتگاه
                </div>
              </div>
            </ImageOverlayCard>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
