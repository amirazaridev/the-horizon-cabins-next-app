import Image from "next/image";
import { Star } from "lucide-react";
import Container from "@/components/ui/Container";
import { TESTIMONIALS_HOME } from "@/features/landing/constants/horizon-home";
import HorizonSectionHeading from "./HorizonSectionHeading";

export default function HorizonTestimonials() {
  return (
    <section className="bg-background-2 px-4 py-14 md:px-6 md:py-20">
      <Container>
        <HorizonSectionHeading eyebrow="نظرات مهمان‌ها" title="آنچه مهمانان ما می‌گویند" />
        <div className="grid gap-4 lg:grid-cols-3">
          {TESTIMONIALS_HOME.map((item) => (
            <article key={item.name} className="hz-reveal rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative size-11 overflow-hidden rounded-full border border-border">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text">{item.name}</div>
                    <div className="mt-0.5 text-[10px] text-text-gray">{item.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-primary-400">
                  <Star size={13} fill="currentColor" />
                  <span className="text-[10px]">{item.rating}</span>
                </div>
              </div>
              <p className="mt-5 text-xs leading-7 text-text-gray">«{item.text}»</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}