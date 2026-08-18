"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cabins = [
  {
    name: "پناهگاه آلپاین",
    price: "$299",
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=2070&auto=format&fit=crop",
    features: ["۲ اتاق خواب", "منظره کوه", "وان آب گرم"],
    size: "۱۲۰ متر مربع",
  },
  {
    name: "پناهگاه جنگلی",
    price: "$399",
    image:
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2070&auto=format&fit=crop",
    features: ["۳ اتاق خواب", "دید پانوراما", "شومینه"],
    size: "۱۸۰ متر مربع",
  },
  {
    name: "قله لوکس",
    price: "$549",
    image:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2070&auto=format&fit=crop",
    features: ["۴ اتاق خواب", "استخر خصوصی", "سونا"],
    size: "۲۵۰ متر مربع",
  },
];

export default function Cabins() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cabins-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cabins-title",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.fromTo(
          Array.from(cards),
          { y: 100, opacity: 0, rotateY: -15 },
          {
            y: 0,
            opacity: 1,
            rotateY: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        Array.from(cards).forEach((card) => {
          gsap.to(card, {
            y: -20,
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cabins"
      className="py-24 md:py-32 px-6 bg-slate-950 relative overflow-hidden"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        <div className="cabins-title text-center mb-16">
          <span className="text-amber-400 text-sm font-medium tracking-wider">
            کابین‌های ما
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-4">
            پناهگاه خودتان
            <br />
            <span className="text-amber-400">را انتخاب کنید</span>
          </h2>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto">
            هر کابین به طور منحصربه‌فردی طراحی شده تا تجربه‌ای فوق‌العاده در دل
            طبیعت ارائه دهد.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 perspective-1000"
        >
          {cabins.map((cabin, index) => (
            <div
              key={index}
              className="group relative bg-slate-900 rounded-3xl overflow-hidden border border-white/5 hover:border-amber-400/30 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-400/10"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={cabin.image}
                  alt={cabin.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-amber-400 text-black px-4 py-1.5 rounded-full text-sm font-bold">
                  {cabin.price}/هر شب
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-white">{cabin.name}</h3>
                  <span className="text-sm text-white/40">{cabin.size}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {cabin.features.map((feature, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white/5 rounded-full text-sm text-white/60"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <button className="w-full py-3 bg-white/5 hover:bg-amber-400 hover:text-black text-white font-semibold rounded-xl transition-all duration-300 border border-white/10 hover:border-amber-400">
                  مشاهده جزئیات
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
