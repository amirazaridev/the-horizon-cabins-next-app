"use client";

import { IMAGES } from "@/constants/gallery-images-section";
import SectionTitle from "../SectionTitle";
import useGalleryAnimation from "./useGalleryAnimation";
import Image from "next/image";
import Container from "@/components/ui/Container";
import GalleryItem from "./GalleryItem";

export default function GallerySection() {
  const { sectionRef } = useGalleryAnimation();

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
          {IMAGES.map((img) => (
            <GalleryItem {...img} key={img.id} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
