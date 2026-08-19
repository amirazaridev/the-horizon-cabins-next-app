"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Container from "../ui/Container";
import Image from "next/image";
import imageURL from "@/assets/images/about-section.png";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        imageRef.current,
        { x: 100, opacity: 0, scale: 0.9 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        contentRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.to(imageRef.current, {
        y: -40,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-slate-900 px-10 py-24 md:py-32"
    >
      <Container className="relative z-10">
        <div ref={headingRef} className="mb-16 text-center">
          <span className="text-primary-400 text-sm font-medium tracking-wider">
            داستان ما
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-6xl">
            جایی که طبیعت
            <br />
            <span className="text-primary-400">به لوکس بودن</span>
            <br />
            <span className="text-primary-400">می‌رسد</span>
          </h2>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2">
          <div ref={imageRef} className="relative order-1 md:order-1">
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl">
              <Image src={imageURL} className="object-cover" fill alt="منظره کابین کوهستانی"/>
            </div>
            <div className="bg-primary-400 absolute -bottom-6 -left-2 rounded-2xl p-4 text-black md:-left-6 md:p-6">
              <p className="text-2xl font-bold md:text-3xl">۱۵+</p>
              <p className="text-xs font-medium md:text-sm">سال تجربه</p>
            </div>
          </div>

          <div ref={contentRef} className="order-2 space-y-6 md:order-1">
            <h3 className="text-3xl font-bold text-white">
              پناهگاهی در دل کوهستان
            </h3>
            <p className="leading-relaxed text-white/60">
              کابین‌های هورایزن پناهگاهی بی‌نظیر از زندگی روزمره هستند. این مکان
              در میان جنگل‌های بکر و قله‌های باشکوه قرار گرفته و ترکیبی کامل از
              جذابیت روستایی و راحتی مدرن را ارائه می‌دهد.
            </p>
            <p className="leading-relaxed text-white/60">
              هر کابین با دقت طراحی شده تا ارتباط شما با طبیعت را به حداکثر
              برساند و در عین حال تمام امکانات مدرن را در دسترس شما قرار دهد. با
              منظره‌های چشمگیر از خواب بیدار شوید، هوای تازه کوهستان را تنفس
              کنید و خاطراتی ماندگار بسازید.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="space-y-2">
                <div className="bg-primary-400/10 flex h-12 w-12 items-center justify-center rounded-xl">
                  <svg
                    className="text-primary-400 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-white">پریمیوم</h4>
                <p className="text-sm text-white/50">امکانات لوکس</p>
              </div>
              <div className="space-y-2">
                <div className="bg-primary-400/10 flex h-12 w-12 items-center justify-center rounded-xl">
                  <svg
                    className="text-primary-400 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-white">دیدنی</h4>
                <p className="text-sm text-white/50">منظره کوهستان</p>
              </div>
              <div className="space-y-2">
                <div className="bg-primary-400/10 flex h-12 w-12 items-center justify-center rounded-xl">
                  <svg
                    className="text-primary-400 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-white">آرامش</h4>
                <p className="text-sm text-white/50">اسپا و استراحت</p>
              </div>
              <div className="space-y-2">
                <div className="bg-primary-400/10 flex h-12 w-12 items-center justify-center rounded-xl">
                  <svg
                    className="text-primary-400 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-white">تفریحات</h4>
                <p className="text-sm text-white/50">سرگرمی در تمام فصول</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
