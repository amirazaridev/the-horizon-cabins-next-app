import Image from "next/image";
import { MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import { DESTINATIONS } from "@/features/landing/constants/horizon-home";
import HorizonSectionHeading from "./HorizonSectionHeading";

export default function HorizonDestinations() {
  return (
    <section id="destinations" className="bg-background-2 px-4 py-16 md:px-6 md:py-20">
      <Container>
        <HorizonSectionHeading eyebrow="مقاصد محبوب" title="بهترین مقاصد ایران" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {DESTINATIONS.map((item, index) => (
            <article
              key={item.id}
              className={`hz-reveal group relative overflow-hidden rounded-2xl border border-white/8 bg-white/5 ${index === 1 ? "sm:mt-3 lg:mt-0" : ""}`}
            >
              <div className="relative aspect-[1.35/1] overflow-hidden">
                <Image src={item.image} alt={item.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-linear-to-t from-overlay via-overlay/10 to-transparent" />
              </div>
              <div className="absolute inset-x-3 bottom-3">
                <div className="mb-1 text-sm font-bold text-white">{item.title}</div>
                <div className="flex items-center gap-1 text-[10px] text-white/55"><MapPin size={12} />{item.meta}</div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}