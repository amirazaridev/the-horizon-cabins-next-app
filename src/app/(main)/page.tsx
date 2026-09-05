import GsapProvider from "@/components/ui/GsapProvider";
import { getCabins } from "@/features/cabins/lib/data-service";
import AboutSection from "@/features/landing/AboutSection";
import AmenitiesSection from "@/features/landing/AmenitiesSection";
import CabinsSection from "@/features/landing/CabinsSection";
import ContactSection from "@/features/landing/ContactSection";
import GallerySection from "@/features/landing/GallerySection";
import HeroSection from "@/features/landing/HeroSection";
import TestimonialsSection from "@/features/landing/TestimonialsSection";

export default async function Home() {
  const cabins = (await getCabins()).slice(0,3);
  
  return (
    <GsapProvider>
      <main className="min-h-screen flex-1">
        <HeroSection />
        <AboutSection />
        <CabinsSection cabins={cabins}/>
        <AmenitiesSection />
        <GallerySection />
        <TestimonialsSection />
        <ContactSection />
      </main>
    </GsapProvider>
  );
}
