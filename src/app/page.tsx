import About from "@/components/landing/About";
import Amenities from "@/components/landing/Amenities";
import Cabins from "@/components/landing/Cabins";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/ui/Footer";
import Gallery from "@/components/landing/Gallery";
import GsapProvider from "@/components/ui/GsapProvider";
import Hero from "@/components/landing/Hero";
import Testimonials from "@/components/landing/Testimonials";

export default function Home() {
  return (
    <GsapProvider>
      <main className="flex-1">
        <Hero />
        <About />
        <Cabins />
        <Amenities />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </GsapProvider>
  );
}
