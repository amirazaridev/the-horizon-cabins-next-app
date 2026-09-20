import Container from "@/components/ui/Container";
import SectionHeading from "./SectionHeading";
import { Cabin } from "@/features/cabins/lib/data-service";
import CabinCard from "@/features/cabins/components/CabinCard";
import Carousel from "@/components/ui/Carousel";

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
              <CabinCard
                cabin={cabin}
                key={cabin.id}
                showPrice
                variant="landing"
                animation="hover"
                className="hz-stay-card transition-[border-color,box-shadow]!"
              />
            ))}
          </Carousel>
      </Container>
    </section>
  );
}
