import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { HORIZON_IMAGES } from "@/features/landing/constants/horizon-home";
import { HeroSearch } from "@/features/search";
import { getCities } from "@/features/cabins/api";
// import { useTheme } from "@/contexts/ThemeContext";

export default async function Hero() {
  // const { theme } = useTheme();
  const cities = await getCities();

  return (
    <header
      id="top"
      className="hz-hero bg-overlay relative flex min-h-[70svh] flex-col justify-center overflow-hidden pt-20 pb-5 md:min-h-[70svh] md:pt-24 md:pb-6"
    >
      <div className="hz-hero-bg absolute inset-0 will-change-transform">
        <Image
          src={HORIZON_IMAGES.hero}
          alt="رزرو ویلا و کلبه در دل طبیعت ایران"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      {/* پایه: کنتراست پایدار روی هر عکسی (روشن یا تیره) */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/30" />

      {/* سایه‌ی پایین‌به‌بالا برای ناحیه‌ی متن و جستجو */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,17,30,0.7)_0%,rgba(7,17,30,0.42)_38%,rgba(7,17,30,0.12)_68%,transparent_100%)]"
      />

      {/* گرادیان گوشه‌ای — سمت شروع متن در RTL — برای عمق */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(225deg,rgba(7,17,30,0.55)_0%,transparent_45%)]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-4 md:px-6">
        <div className="max-w-2xl py-4 md:py-6">
          <div className="hz-hero-eyebrow text-primary-400 mb-4 flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
            <span className="bg-primary-400/70 inline-block h-px w-8" />
            HORIZON — رزرو ویلا و اقامتگاه
          </div>

          <h1 className="hz-hero-title text-3xl leading-[1.15] font-black tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[56px]">
            <span className="inline-block overflow-hidden align-bottom">
              <span className="hz-hero-word inline-block">رزرو</span>
            </span>{" "}
            <span className="inline-block overflow-hidden align-bottom">
              <span className="hz-hero-word text-primary-400 inline-block">
                ویلا،
              </span>
            </span>{" "}
            <span className="inline-block overflow-hidden align-bottom">
              <span className="hz-hero-word inline-block">کلبه</span>
            </span>
            <span className="block">
              <span className="inline-block overflow-hidden align-bottom">
                <span className="hz-hero-word inline-block">و</span>
              </span>{" "}
              <span className="inline-block overflow-hidden align-bottom">
                <span className="hz-hero-word inline-block">اقامتگاه</span>
              </span>{" "}
              <span className="inline-block overflow-hidden align-bottom">
                <span className="hz-hero-word inline-block">در ایران</span>
              </span>
            </span>
          </h1>

          <p className="hz-hero-copy mt-3 max-w-lg text-[13px] leading-7 text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)] sm:text-sm md:text-base md:leading-8">
            از جنگل‌های شمال تا ساحل و کویر؛ اقامتگاه‌های تمیز و تاییدشده را
            آنلاین رزرو کنید — بدون واسطه.
          </p>
        </div>

        <div className="mt-6 md:mt-17.5">
          <HeroSearch cities={cities} />
        </div>
        <div className="mt-4 flex justify-center text-white/70">
          <ChevronDown
            className="hz-scroll-indicator animate-bounce"
            size={20}
          />
        </div>
      </div>
    </header>
  );
}
