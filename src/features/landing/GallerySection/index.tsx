"use client";

import SectionTitle from "@/features/landing/shared/components/SectionTitle";
import useSectionReveal, {
  type RevealTarget,
} from "@/features/landing/shared/hooks/useSectionReveal";
import Container from "@/components/ui/Container";
import GalleryItem from "./GalleryItem";
import { GALLERY_IMAGES } from "@/features/landing/shared/constants/gallery-images";

const REVEAL_TARGETS: RevealTarget[] = [
  { selector: ".gallery-title" },
  {
    selector: ".gallery-item",
    y: 80,
    scale: 0.95,
    start: "top 90%",
    parallaxChildSelector: "img",
  },
];

export default function GallerySection() {
  const { sectionRef } = useSectionReveal(REVEAL_TARGETS);

  return (
    <section
      ref={sectionRef}
      className="bg-background relative overflow-hidden px-6 py-24 md:py-32"
    >
      <Container>
        <SectionTitle
          className="gallery-title"
          subTitle="گالری"
          title="تجربه"
          titlePri="بصری"
          parag="گوشه‌ای از تجربه‌های فوق‌العاده‌ای که در هورایزن در انتظار شماست."
        />

        <ul className="grid auto-rows-37.5 grid-cols-2 gap-3 sm:auto-rows-50 md:auto-rows-62.5 md:grid-cols-3 md:gap-6">
          {GALLERY_IMAGES.map((img) => (
            <GalleryItem {...img} key={img.id} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
