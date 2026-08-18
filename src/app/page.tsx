import About from "@/components/About";
import Amenities from "@/components/Amenities";
import Cabins from "@/components/Cabins";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import GsapProvider from "@/components/GsapProvider";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <GsapProvider>
      <Navbar />
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
