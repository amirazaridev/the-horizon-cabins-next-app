import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { POPULAR_EXPERIENCES } from "@/features/landing/constants/horizon-home";
import HorizonSectionHeading from "./HorizonSectionHeading";

export default function HorizonExperiences() {
  return (
    <section className="bg-background-2 px-4 py-14 md:px-6 md:py-20">
      <Container>
        <HorizonSectionHeading eyebrow="تجربه‌های خاص در ایران" title="مقصد بعدی‌تان را انتخاب کنید" href="/cabins" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_EXPERIENCES.map((item) => (
            <Link key={item.title} href="/cabins" className="hz-reveal group relative overflow-hidden rounded-2xl border border-white/8">
              <div className="relative aspect-[1.65/1] overflow-hidden">
                <Image src={item.image} alt={item.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-overlay/90 via-transparent to-transparent" />
              </div>
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                <div>
                  <div className="text-base font-bold text-white">{item.title}</div>
                  <div className="mt-1 text-[10px] text-white/55">{item.desc}</div>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur"><ArrowLeft size={15} /></span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}