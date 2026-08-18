"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "سارا محمدی",
    role: "بلاگر سفر",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    text: "تجربه‌ای واقعاً جادویی بود. کابین از تمام انتظارات ما فراتر رفت. از خواب بیدار شدن با آن منظره‌های کوهستانی واقعاً فوق‌العاده بود.",
    rating: 5,
  },
  {
    name: "علی رضایی",
    role: "عکاس",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    text: "ترکیبی کامل از لوکس بودن و طبیعت. من در هتل‌های لوکس زیادی اقامت داشته‌ام، اما این واقعاً خاص بود.",
    rating: 5,
  },
  {
    name: "مریم حسینی",
    role: "کارآفرین",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    text: "خانواده کامل را آوردیم و همه عاشقش شدند. بچه‌ها هنوز درباره تراس تماشای ستارگان صحبت می‌کنند!",
    rating: 5,
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonials-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".testimonials-title",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      const cards = document.querySelectorAll(".testimonial-card");
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0, rotateX: 10 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
            delay: index * 0.15,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 px-6 bg-slate-900 relative overflow-hidden"
      dir="rtl"
    >
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="testimonials-title text-center mb-16">
          <span className="text-amber-400 text-sm font-medium tracking-wider">
            نظرات مشتریان
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-4">
            مهمانان ما
            <br />
            <span className="text-amber-400">چه می‌گویند</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card p-8 bg-slate-800/50 rounded-2xl border border-white/5 hover:border-amber-400/20 transition-all duration-500"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-white/60 leading-relaxed mb-8">
                «{testimonial.text}»
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-white/50">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
