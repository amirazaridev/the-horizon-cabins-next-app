"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CabinCard from "@/components/ui/CabinCard";
import useCabinsAnimation from "../hooks/useCabinsAnimation";
import Container from "@/components/ui/Container";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const cabins = [
  {
    name: "پناهگاه آلپاین",
    price: "$299",
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=2070&auto=format&fit=crop",
    features: ["۲ اتاق خواب", "منظره کوه", "وان آب گرم"],
    size: "۱۲۰ متر مربع",
  },
  {
    name: "پناهگاه جنگلی",
    price: "$399",
    image:
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2070&auto=format&fit=crop",
    features: ["۳ اتاق خواب", "دید پانوراما", "شومینه"],
    size: "۱۸۰ متر مربع",
  },
  {
    name: "قله لوکس",
    price: "$549",
    image:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2070&auto=format&fit=crop",
    features: ["۴ اتاق خواب", "استخر خصوصی", "سونا"],
    size: "۲۵۰ متر مربع",
  },
];

export default function CabinsSection() {
  const { cardsRef, sectionRef } = useCabinsAnimation();

  return (
    <section
      ref={sectionRef}
      className="bg-background relative overflow-hidden px-6 py-24 md:py-32"
    >
      <Container>
        <div className="cabins-title mb-16 text-center">
          <span className="cabins-eyebrow inline-block text-sm font-medium tracking-wider text-primary-400">
            کابین‌های ما
          </span>
          <h2 className="mt-4 text-4xl font-bold text-text md:text-6xl">
            <span className="cabins-heading-line block">پناهگاه خودتان</span>
            <span className="cabins-heading-line block text-primary-400">
              را انتخاب کنید
            </span>
          </h2>
          <p className="cabins-subtext mx-auto mt-4 max-w-2xl text-text-gray">
            هر کابین به طور منحصربه‌فردی طراحی شده تا تجربه‌ای فوق‌العاده در دل
            طبیعت ارائه دهد.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3"
          style={{ perspective: 1200 }}
        >
          {cabins.map((cabin) => (
            <CabinCard
              key={cabin.image}
              name={cabin.name}
              price={`$${cabin.price}`}
              image={cabin.image}
              imageAlt={cabin.name}
              features={cabin.features}
              size={`${cabin.size} متر مربع`}
              href={`/cabins/${cabin.image}`}
              animation="hover"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
