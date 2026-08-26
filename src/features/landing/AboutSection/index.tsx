"use client";

import Image from "next/image";

import Container from "@/components/ui/Container";
import imageURL from "@/assets/images/about-section.png";
import FeatureList from "@/features/landing/AboutSection/FeatureList";
import useSectionReveal, {
  type RevealTarget,
} from "@/features/landing/hooks/useSectionReveal";
import SectionTitle from "../SectionTitle";

const REVEAL_TARGETS: RevealTarget[] = [
  { selector: ".about-heading", y: 60 },
  {
    selector: ".about-image",
    x: 100,
    scale: 0.9,
    duration: 1.2,
    start: "top 80%",
    parallaxChildSelector: ".about-image-inner",
  },
  { selector: ".about-content", x: -100, duration: 1.2, start: "top 80%" },
];

export default function AboutSection() {
  const { sectionRef } = useSectionReveal(REVEAL_TARGETS);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-surface px-10 py-24 md:py-32"
    >
      <Container className="relative z-10">
        <SectionTitle
          className="about-heading"
          subTitle="داستان ما"
          title="جایی که طبیعت ایران"
          titlePri={<>به لوکس بودن <br /> می‌رسد</>}
        />

        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="about-image relative order-1 md:order-1">
            <div className="about-image-inner relative">
              <div className="relative aspect-4/5 overflow-hidden rounded-2xl">
                <Image
                  src={imageURL}
                  className="object-cover"
                  fill
                  alt="سوئیت چوبی در دل طبیعت ایران"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="bg-primary-400 absolute -bottom-6 -left-2 rounded-2xl p-4 text-black md:-left-6 md:p-6">
                <p className="text-2xl font-bold md:text-3xl">۱۵+</p>
                <p className="text-xs font-medium md:text-sm">سال تجربه</p>
              </div>
            </div>
          </div>

          <div className="about-content order-2 space-y-6 md:order-1">
            <h3 className="text-text text-3xl font-bold">
              از جنگل‌های هیرکانی تا ساحل خزر
            </h3>
            <p className="text-text-gray leading-relaxed">
              سوئیت‌های هورایزن، پناهگاهی متفاوت برای گریز از زندگی روزمره
              هستند؛ از سوئیت‌های چوبی میان جنگل‌های هزارساله‌ی هیرکانی در شمال
              گرفته تا اقامتگاه‌های ساحلی کنار دریای خزر و بوم‌گردی‌های آرام در
              شرق کشور. هر مقصد، ترکیبی از سادگی روستایی و آسایش مدرن است.
            </p>
            <p className="text-text-gray leading-relaxed">
              هر سوئیت با دقت طراحی شده تا ارتباط شما با طبیعت ایران را به
              حداکثر برساند؛ صبح با صدای پرندگان جنگل بیدار شوید، غروب بر ساحل
              شنی تماشا کنید و شب زیر آسمان پرستاره‌ی کویر بخوابید. خاطره‌ای
              ماندگار از سفری ایرانی، در انتظار شماست.
            </p>

            <FeatureList />
          </div>
        </div>
      </Container>
    </section>
  );
}
