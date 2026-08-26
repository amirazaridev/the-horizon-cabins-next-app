import GsapProvider from "@/components/ui/GsapProvider";
import AboutSection from "@/features/landing/AboutSection";
import AmenitiesSection from "@/features/landing/AmenitiesSection";
import CabinsSection from "@/features/landing/CabinsSection";
import ContactSection from "@/features/landing/ContactSection";
import GallerySection from "@/features/landing/GallerySection";
import HeroSection from "@/features/landing/HeroSection";
import TestimonialsSection from "@/features/landing/TestimonialsSection";

export default function Home() {
  return (
    <GsapProvider>
      <main className="min-h-screen flex-1">
        <HeroSection />
        <AboutSection />
        <CabinsSection />
        <AmenitiesSection />
        <GallerySection />
        <TestimonialsSection />
        <ContactSection />
      </main>
    </GsapProvider>
  );
}
