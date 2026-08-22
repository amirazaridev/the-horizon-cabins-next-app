import About from "@/features/landing/components/AboutSection";
import Amenities from "@/features/landing/components/AmenitiesSection";
import Cabins from "@/features/landing/components/CabinsSection";
import Contact from "@/features/landing/components/Contact";
import Footer from "@/components/ui/Footer";
import Gallery from "@/features/landing/components/GallerySection";
import GsapProvider from "@/components/ui/GsapProvider";
import Hero from "@/features/landing/components/HeroSection";
import Testimonials from "@/features/landing/components/Testimonials";

export default function Home() {
  return (
    <GsapProvider>
      <main className="flex-1 min-h-screen">
        <Hero />
        <About />
        <Cabins />
        <Amenities />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
    </GsapProvider>
  );
}
