"use client";

import Image from "next/image";

import Container from "@/components/ui/Container";
import imageURL from "@/assets/images/about-section.png";
import FeatureList from "@/features/landing/AboutSection/FeatureList";
import useAboutAnimation from "@/features/landing/AboutSection/useAboutAnimation";
import SectionTitle from "../SectionTitle";

export default function AboutSection() {
  const { contentRef, headingRef, imageRef, sectionRef } = useAboutAnimation();

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-slate-900 px-10 py-24 md:py-32"
    >
      <Container className="relative z-10">
        <SectionTitle ref={headingRef} subTitle="داستان ما"  title="جایی که طبیعت" titlePri={<>به لوکس بودن <br /> می‌رسد</>}/>

        <div className="grid items-center gap-12 md:grid-cols-2">
          <div ref={imageRef} className="relative order-1 md:order-1">
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl">
              <Image
                src={imageURL}
                className="object-cover"
                fill
                alt="منظره کابین کوهستانی"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="bg-primary-400 absolute -bottom-6 -left-2 rounded-2xl p-4 text-black md:-left-6 md:p-6">
              <p className="text-2xl font-bold md:text-3xl">۱۵+</p>
              <p className="text-xs font-medium md:text-sm">سال تجربه</p>
            </div>
          </div>

          <div ref={contentRef} className="order-2 space-y-6 md:order-1">
            <h3 className="text-text text-3xl font-bold">
              سوئیت در دل جنگل
            </h3>
            <p className="text-text-gray leading-relaxed">
              کابین‌های هورایزن سوئیت هایی بی‌نظیر از زندگی روزمره هستند. این مکان
              در میان جنگل‌های بکر و قله‌های باشکوه قرار گرفته و ترکیبی کامل از
              جذابیت روستایی و راحتی مدرن را ارائه می‌دهد.
            </p>
            <p className="text-text-gray leading-relaxed">
              هر کابین با دقت طراحی شده تا ارتباط شما با طبیعت را به حداکثر
              برساند و در عین حال تمام امکانات مدرن را در دسترس شما قرار دهد. با
              منظره‌های چشمگیر از خواب بیدار شوید، هوای تازه کوهستان را تنفس
              کنید و خاطراتی ماندگار بسازید.
            </p>

            <FeatureList />
          </div>
        </div>
      </Container>
    </section>
  );
}
