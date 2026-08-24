"use client";

import Button from "@/components/ui/Button";
import {
  Clock,
  Headset,
  Mail,
  MapPin,
  MoveLeft,
  Phone,
  TreePine,
} from "lucide-react";
import useSectionReveal from "@/features/landing/hooks/useSectionReveal";
import BackDropBlur from "@/components/ui/BackDropBlur";
import Container from "@/components/ui/Container";
import SectionTitle from "../SectionTitle";
import CardContainer from "@/components/ui/CardContainer";
import { BOOKING_STEPS, WORKING_HOURS } from "@/constants/contact-section";

const REVEAL_TARGETS = [
  { selector: ".contact-content" },
  { selector: ".contact-cta", y: 80, delay: 0.2 },
];

export default function ContactSection() {
  const { sectionRef } = useSectionReveal(REVEAL_TARGETS);

  return (
    <section
      ref={sectionRef}
      className="bg-background relative overflow-hidden px-6 py-24 md:py-32"
    >
      <BackDropBlur />

      <Container className="relative z-10">
        <SectionTitle
          className="contact-content"
          subTitle="تماس با ما"
          title="آماده"
          titlePri="هستید؟"
          parag="اقامت خود را رزرو کنید یا با ما تماس بگیرید. ما اینجاییم تا تعطیلات
            رؤیایی شما را واقعیت بخشیم."
        />

        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <CardContainer variant="gradient" className="contact-cta">
            <span className="border-primary-400/20 bg-primary-400/10 text-primary-400 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium">
              <TreePine className="size-4" />
              رزرو آنلاین
            </span>

            <h3 className="text-text mt-6 text-2xl leading-relaxed font-bold md:text-3xl">
              اقامت رویایی‌تان فقط
              <span className="text-primary-400"> چند کلیک </span>
              فاصله دارد
            </h3>
            <p className="text-text-gray mt-3 leading-relaxed">
              نیازی به فرم نیست! کابین مورد علاقه‌تان را انتخاب کنید و در صفحه
              همان کابین، رزرو را در چند ثانیه نهایی کنید.
            </p>

            <div className="mt-8 space-y-5">
              {BOOKING_STEPS.map((step, i) => (
                <div key={step.title} className="group flex items-start gap-4">
                  <div className="group-hover:border-primary-400/40 group-hover:bg-primary-400/10 relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-800/80 transition-colors duration-300">
                    <step.icon className="text-primary-400 size-5" />
                    <span className="bg-primary-400 absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full text-[10px] font-bold text-black">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-text font-medium">{step.title}</p>
                    <p className="text-text/40 mt-1 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/cabins" shape="xl" fullWidth>
                مشاهده کابین‌ها و رزرو
                <MoveLeft className="size-5 transition-transform duration-300 group-hover:-translate-x-1" />
              </Button>
              <Button href="tel:+989000000000" variant="outline" shape="xl">
                <Phone className="size-5" />
                تماس سریع
              </Button>
            </div>
          </CardContainer>

          <div className="space-y-6 transition-all duration-500 md:space-y-8">
            <CardContainer variant="primary">
              <div className="mb-4 flex items-center gap-4">
                <div className="group-hover:border-primary-400/40 group-hover:bg-primary-400/10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-800/80 transition-colors duration-300">
                  <MapPin className="text-primary-400 size-5" />
                </div>
                <h3 className="text-text text-lg font-semibold">آدرس</h3>
              </div>
              <p className="text-text-gray leading-relaxed">
                جاده تپه کوهستانی، کیلومتر ۱۲
                <br />
                رزرواسیون هورایزن
              </p>
            </CardContainer>

            <CardContainer variant="primary">
              <div className="mb-4 flex items-center gap-4">
                <div className="group-hover:border-primary-400/40 group-hover:bg-primary-400/10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-800/80 transition-colors duration-300">
                  <Headset className="text-primary-400 size-5" />
                </div>
                <h3 className="text-text text-lg font-semibold">
                  اطلاعات تماس
                </h3>
              </div>
              <div className="space-y-3">
                <a
                  href="tel:+989000000000"
                  className="hover:text-primary-400 text-text-gray flex items-center gap-3 transition-colors duration-300"
                >
                  <Phone className="text-primary-400 size-5 shrink-0" />
                  <span dir="ltr">+98 900 000 0000</span>
                </a>
                <a
                  href="mailto:info@thehorizon.com"
                  className="hover:text-primary-400 text-text-gray flex items-center gap-3 transition-colors duration-300"
                >
                  <Mail className="text-primary-400 size-5 shrink-0" />
                  <span dir="ltr">info@thehorizon.com</span>
                </a>
              </div>
            </CardContainer>

            <CardContainer variant="primary">
              <div className="mb-4 flex items-center gap-4">
                <div className="group-hover:border-primary-400/40 group-hover:bg-primary-400/10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-800/80 transition-colors duration-300">
                  <Clock className="text-primary-400 size-5" />
                </div>
                <h3 className="text-text text-lg font-semibold">ساعات کاری</h3>
              </div>
              <div className="space-y-3">
                {WORKING_HOURS.map((item) => (
                  <div
                    key={item.name}
                    className="text-text-gray flex justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0"
                  >
                    <span>{item.name}</span>
                    <span className="text-text/70">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContainer>
          </div>
        </div>
      </Container>
    </section>
  );
}
