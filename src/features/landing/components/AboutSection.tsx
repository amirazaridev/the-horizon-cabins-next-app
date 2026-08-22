"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Container from "../../../components/ui/Container";
import Image from "next/image";
import imageURL from "@/assets/images/about-section.png";
import useAboutAnimation from "../hooks/useAboutAnimation";

export default function AboutSection() {
  const { contentRef, headingRef, imageRef, sectionRef } = useAboutAnimation();

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
          <h2 className="text-text mt-4 text-4xl font-bold md:text-6xl">
            جایی که طبیعت
            <br />
            <span className="text-primary-400">
              به لوکس بودن <br /> می‌رسد
            </span>
          </h2>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2">
          <div ref={imageRef} className="relative order-1 md:order-1">
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl">
              <Image
                src={imageURL}
                className="object-cover"
                fill
                alt="منظره کابین کوهستانی"
              />
            </div>
            <div className="bg-primary-400 absolute -bottom-6 -left-2 rounded-2xl p-4 text-black md:-left-6 md:p-6">
              <p className="text-2xl font-bold md:text-3xl">۱۵+</p>
              <p className="text-xs font-medium md:text-sm">سال تجربه</p>
            </div>
          </div>

          <div ref={contentRef} className="order-2 space-y-6 md:order-1">
            <h3 className="text-text text-3xl font-bold">
              پناهگاهی در دل کوهستان
            </h3>
            <p className="text-text-gray leading-relaxed">
              کابین‌های هورایزن پناهگاهی بی‌نظیر از زندگی روزمره هستند. این مکان
              در میان جنگل‌های بکر و قله‌های باشکوه قرار گرفته و ترکیبی کامل از
              جذابیت روستایی و راحتی مدرن را ارائه می‌دهد.
            </p>
            <p className="text-text-gray leading-relaxed">
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
                <h4 className="text-text font-semibold">پریمیوم</h4>
                <p className="text-text-gray text-sm">امکانات لوکس</p>
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
                <h4 className="text-text font-semibold">دیدنی</h4>
                <p className="text-text-gray text-sm">منظره کوهستان</p>
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
                <h4 className="text-text font-semibold">آرامش</h4>
                <p className="text-text-gray text-sm">اسپا و استراحت</p>
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
                <h4 className="text-text font-semibold">تفریحات</h4>
                <p className="text-text-gray text-sm">سرگرمی در تمام فصول</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
