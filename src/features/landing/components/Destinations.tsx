import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import Carousel from "@/components/ui/Carousel";
import type { PopularCity } from "@/features/cabins/types/city.types";
import fallbackCityImage from "@/assets/images/dark-hero-section1.jpeg";
import SectionHeading from "./SectionHeading";

/**
 * سکشن «مقاصد محبوب» — کاروسل شهرهای پرطرفدار.
 *
 * داده از `GET /locations/cities/popular` می‌آید (مرتب بر اساس بیشترین
 * تعداد رزرو). اگر شهری `imageUrl` نداشت، از یک عکس داخلی Next استفاده می‌شود.
 * هر کارت به جستجوی همان شهر لینک می‌شود (`/cabins?city=<id>`).
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
            <Link
              key={city.id}
              href={`/cabins?city=${city.id}`}
              className="group block h-full"
            >
              <article className="relative h-full overflow-hidden rounded-2xl border border-white/8 bg-white/5">
                <div className="relative aspect-[1.35/1] overflow-hidden">
                  <Image
                    src={city.imageUrl || fallbackCityImage}
                    alt={city.name}
                    fill
                    sizes="(min-width: 1024px) 23vw, (min-width: 640px) 38vw, 64vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="from-overlay via-overlay/10 absolute inset-0 bg-linear-to-t to-transparent" />
                </div>
                <div className="absolute inset-x-3 bottom-3">
                  <div className="mb-1 text-sm font-bold text-white">
                    {city.name}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-white/55">
                    <MapPin size={12} />
                    {city.cabinsCount.toLocaleString("fa-IR")} اقامتگاه
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
