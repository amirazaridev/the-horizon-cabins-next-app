"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  CalendarRange,
  Clock,
  Headset,
  KeyRound,
  Mail,
  MapPin,
  MoveLeft,
  Phone,
  TreePine,
} from "lucide-react";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-content",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-content",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".contact-cta",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-cta",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          delay: 0.2,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-24 md:py-32 px-6 bg-slate-950 relative overflow-hidden"
      dir="rtl"
    >
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-amber-400/5 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="contact-content text-center mb-16">
          <span className="text-amber-400 text-sm font-medium tracking-wider">
            تماس با ما
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-4">
            آماده
            <br />
            <span className="text-amber-400">هستید؟</span>
          </h2>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto">
            اقامت خود را رزرو کنید یا با ما تماس بگیرید. ما اینجاییم تا تعطیلات
            رؤیایی شما را واقعیت بخشیم.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="contact-cta relative rounded-3xl p-[1px] bg-gradient-to-br from-amber-400/40 via-white/10 to-transparent">
            <div className="relative h-full rounded-3xl bg-slate-900/80 backdrop-blur-sm p-8 md:p-10 overflow-hidden">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-400/10 rounded-full blur-[100px]" />

              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-medium">
                <TreePine className="w-4 h-4" />
                رزرو آنلاین
              </span>

              <h3 className="text-2xl md:text-3xl font-bold text-white mt-6 leading-relaxed">
                اقامت رویایی‌تان فقط
                <span className="text-amber-400"> چند کلیک </span>
                فاصله دارد
              </h3>
              <p className="text-white/50 mt-3 leading-relaxed">
                نیازی به فرم نیست! کابین مورد علاقه‌تان را انتخاب کنید و در صفحه
                همان کابین، رزرو را در چند ثانیه نهایی کنید.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  {
                    icon: TreePine,
                    title: "کابین خود را انتخاب کنید",
                    desc: "بین کابین‌های چوبی، یخچالی و جنگلی یکی را برگزینید",
                  },
                  {
                    icon: CalendarRange,
                    title: "تاریخ ورود و خروج را مشخص کنید",
                    desc: "تقویم موجودی هر کابین را زنده می‌بینید",
                  },
                  {
                    icon: KeyRound,
                    title: "رزرو را نهایی کنید",
                    desc: "تأیید آنی دریافت می‌کنید؛ ما منتظرتان هستیم",
                  },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="relative flex-shrink-0 w-11 h-11 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center transition-colors duration-300 group-hover:border-amber-400/40 group-hover:bg-amber-400/10">
                      <step.icon className="w-5 h-5 text-amber-400" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-black text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{step.title}</p>
                      <p className="text-white/40 text-sm mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/cabins"
                  className="group flex-1 inline-flex items-center justify-center gap-2 py-4 bg-amber-400 text-black font-semibold rounded-xl hover:bg-amber-300 transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/20"
                >
                  مشاهده کابین‌ها و رزرو
                  <MoveLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                </Link>
                <a
                  href="tel:+989000000000"
                  className="inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl border border-white/15 text-white hover:border-amber-400/50 hover:text-amber-400 transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                  تماس سریع
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-white/10 via-white/5 to-transparent hover:from-amber-400/40 transition-all duration-500">
              <div className="rounded-3xl bg-slate-900/80 backdrop-blur-sm p-6 md:p-7">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center transition-colors duration-300 group-hover:border-amber-400/40 group-hover:bg-amber-400/10">
                    <MapPin className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">آدرس</h3>
                </div>
                <p className="text-white/50 leading-relaxed">
                  جاده تپه کوهستانی، کیلومتر ۱۲
                  <br />
                  رزرواسیون هورایزن
                </p>
              </div>
            </div>

            <div className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-white/10 via-white/5 to-transparent hover:from-amber-400/40 transition-all duration-500">
              <div className="rounded-3xl bg-slate-900/80 backdrop-blur-sm p-6 md:p-7">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center transition-colors duration-300 group-hover:border-amber-400/40 group-hover:bg-amber-400/10">
                    <Headset className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    اطلاعات تماس
                  </h3>
                </div>
                <div className="space-y-3">
                  <a
                    href="tel:+989000000000"
                    className="flex items-center gap-3 text-white/50 hover:text-amber-400 transition-colors duration-300"
                  >
                    <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                    <span dir="ltr">+98 900 000 0000</span>
                  </a>
                  <a
                    href="mailto:info@thehorizon.com"
                    className="flex items-center gap-3 text-white/50 hover:text-amber-400 transition-colors duration-300"
                  >
                    <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                    <span dir="ltr">info@thehorizon.com</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-white/10 via-white/5 to-transparent hover:from-amber-400/40 transition-all duration-500">
              <div className="rounded-3xl bg-slate-900/80 backdrop-blur-sm p-6 md:p-7">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center transition-colors duration-300 group-hover:border-amber-400/40 group-hover:bg-amber-400/10">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">ساعات کاری</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "پذیرش", time: "۲۴ ساعته" },
                    { name: "اسپا", time: "۹ صبح تا ۱۰ شب" },
                    { name: "رستوران", time: "۷ صبح تا ۱۱ شب" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex justify-between text-white/50 pb-2 border-b border-white/5 last:border-0 last:pb-0"
                    >
                      <span>{item.name}</span>
                      <span className="text-white/70">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
