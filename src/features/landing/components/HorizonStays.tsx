import Container from "@/components/ui/Container";
import HorizonSectionHeading from "./HorizonSectionHeading";
import { Cabin } from "@/features/cabins/lib/data-service";
import CabinCard from "@/features/cabins/components/CabinCard";

export default function HorizonStays({ cabins }: { cabins: Cabin[] }) {
  return (
    <section id="stays" className="bg-background-2 px-4 py-14 md:px-6 md:py-20">
      <Container>
        <HorizonSectionHeading
          eyebrow="اقامتگاه‌های منتخب"
          title={
            <>
              ویلاها و سوئیت‌های <span className="text-primary-400">خاص</span>
            </>
          }
          href="/cabins"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cabins.map((cabin) => (
            <CabinCard
              cabin={cabin}
              key={cabin.id}
              variant="landing"
              animation="hover"
              className="hz-stay-card transition-[border-color,box-shadow]!"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
