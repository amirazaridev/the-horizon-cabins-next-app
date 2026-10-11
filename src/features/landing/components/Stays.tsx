import type { Cabin } from "@/features/cabins/types/cabin.types";
import Container from "@/components/ui/Container";
import Carousel from "@/components/ui/Carousel";
import CabinCard from "@/features/cabins/components/CabinCard";
import SectionHeading from "@/features/landing/components/SectionHeading";

export default function Stays({ cabins }: { cabins: Cabin[] }) {
  return (
    <section id="stays" className="bg-background-2 px-4 py-14 md:px-6 md:py-20">
      <Container>
        <SectionHeading
          eyebrow="اقامتگاه‌های منتخب"
          title={
            <>
              ویلاها و سوئیت‌های <span className="text-primary-400">خاص</span>
            </>
          }
          href="/cabins"
        />
        <Carousel>
          {cabins.map((cabin) => (
            /* ⚠️ قلاب انیمیشن روی یک پوششِ بیرونی می‌نشیند، نه روی خود
               `CabinCard`؛ چون `CabinCardProps` یک تایپ بسته است و
               `data-animate` را به DOM نمی‌رساند (بی‌صدا دور می‌افتاد و
               انیمیشن ورود کارت‌ها هرگز اجرا نمی‌شد). */
            <div key={cabin.id} data-animate="stay-card" className="h-full">
              <CabinCard
                cabin={cabin}
                showPrice
                variant="landing"
                animation="hover"
                className="transition-[border-color,box-shadow]!"
              />
            </div>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
