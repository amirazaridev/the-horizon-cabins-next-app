"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
        ".contact-form",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-form",
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
          <div className="contact-form space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  نام
                </label>
                <input
                  type="text"
                  placeholder="علی"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition-all text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  نام خانوادگی
                </label>
                <input
                  type="text"
                  placeholder="رضایی"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition-all text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                ایمیل
              </label>
              <input
                type="email"
                placeholder="ali@example.com"
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition-all text-right"
                dir="ltr"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  تاریخ ورود
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition-all text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  تاریخ خروج
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition-all text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                پیام
              </label>
              <textarea
                rows={4}
                placeholder="درباره اقامتتان برایمان بنویسید..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition-all resize-none text-right"
              />
            </div>

            <button className="w-full py-4 bg-amber-400 text-black font-semibold rounded-xl hover:bg-amber-300 transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/20">
              ارسال درخواست
            </button>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="p-5 md:p-6 bg-slate-800/30 rounded-2xl border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-4">آدرس</h3>
              <p className="text-white/50 leading-relaxed">
                جاده تپه کوهستانی
                <br />
                دره آلپین، کلرادو ۸۱۴۳۵
                <br />
                ایالات متحده
              </p>
            </div>

            <div className="p-5 md:p-6 bg-slate-800/30 rounded-2xl border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-4">
                اطلاعات تماس
              </h3>
              <div className="space-y-3">
                <p className="text-white/50 flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-amber-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span dir="ltr">+1 (555) 123-4567</span>
                </p>
                <p className="text-white/50 flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-amber-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  info@thehorizon.com
                </p>
              </div>
            </div>

            <div className="p-5 md:p-6 bg-slate-800/30 rounded-2xl border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-4">ساعات کاری</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-white/50">
                  <span>پذیرش</span>
                  <span>۲۴ ساعته</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>اسپا</span>
                  <span>۹ صبح تا ۱۰ شب</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>رستوران</span>
                  <span>۷ صبح تا ۱۱ شب</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
