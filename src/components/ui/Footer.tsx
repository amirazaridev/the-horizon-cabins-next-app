"use client";

import { useRef } from "react";
import Logo from "./Logo";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  // useEffect(() => {
  //   const ctx = gsap.context(() => {
  //     gsap.fromTo(
  //       footerRef.current,
  //       { opacity: 0 },
  //       {
  //         opacity: 1,
  //         duration: 1,
  //         ease: "power3.out",
  //         scrollTrigger: {
  //           trigger: footerRef.current,
  //           start: "top 95%",
  //           toggleActions: "play none none reverse",
  //         },
  //       }
  //     );
  //   }, footerRef);

  //   return () => ctx.revert();
  // }, []);

  return (
    <footer
      ref={footerRef}
      className="bg-background border-t border-white/5 px-6 py-12"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          <div className="col-span-2 md:col-span-2">
            <Logo />
            <p className="text-text-gray mt-4 max-w-md leading-relaxed">
              از شلوغی شهر فاصله بگیرید و در دل کوهستان، لوکس بودن را تجربه
              کنید. طبیعت را هرگز مثل قبل تجربه نکرده‌اید.
            </p>
            <div className="mt-6 flex gap-4">
              {["facebook", "instagram", "twitter", "youtube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="hover:bg-primary-400 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/50 transition-all duration-300 hover:text-black"
                >
                  <span className="sr-only">{social}</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">لینک‌های سریع</h4>
            <ul className="space-y-3">
              {["درباره ما", "کابین‌ها", "امکانات", "گالری", "تماس"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-text-gray hover:text-primary-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-text mb-4 font-semibold">قانونی</h4>
            <ul className="space-y-3">
              {[
                "حریم خصوصی",
                "شرایط استفاده",
                "شرایط لغو",
                "سوالات متداول",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-text-gray hover:text-primary-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} کابین‌های هورایزن. تمامی حقوق محفوظ
            است.
          </p>
        </div>
      </div>
    </footer>
  );
}
