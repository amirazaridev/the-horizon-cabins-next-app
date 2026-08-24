import AboutSection from "@/features/landing/AboutSection";
import AmenitiesSection from "@/features/landing/AmenitiesSection";
import CabinsSection from "@/features/landing/CabinsSection";
import Contact from "@/features/landing/ContactSection";
import Gallery from "@/features/landing/GallerySection";
import GsapProvider from "@/components/ui/GsapProvider";
import Testimonials from "@/features/landing/TestimonialsSection";
import HeroSection from "@/features/landing/HeroSection";

export default function Home() {
  return (
    <GsapProvider>
      <main className="min-h-screen flex-1">
        <HeroSection />
        <AboutSection />
        <CabinsSection />
        <AmenitiesSection />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
    </GsapProvider>
  );
}
