"use client";
import CabinCard from "@/components/ui/CabinCard";
import Container from "@/components/ui/Container";
import useCabinsAnimation from "@/features/landing/CabinsSection/useCabinsAnimation";
import SectionTitle from "../SectionTitle";

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
        <SectionTitle
          forCabin={true}
          className="cabins-title"
          subTitle="کابین‌های ما"
          title="پناهگاه خودتان"
          titlePri="را انتخاب کنید"
          parag="هر کابین به طور منحصربه‌فردی طراحی شده تا تجربه‌ای فوق‌العاده در دل
            طبیعت ارائه دهد."
        />

        <div
          ref={cardsRef}
          className="grid grid-cols-1 gap-6 perspective-[1200] sm:grid-cols-2 md:gap-8 lg:grid-cols-3"
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
