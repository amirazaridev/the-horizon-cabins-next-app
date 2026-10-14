import Image from "next/image";
import Container from "@/components/ui/Container";
import { HORIZON_IMAGES } from "@/features/landing/constants";
import { EXPERIENCE_BANNER_ITEMS } from "@/features/landing/constants/experience-banner";

export default function ExperienceBanner() {
  return (
    <section
      id="experiences"
      className="bg-background-2 relative h-150 px-4 pb-20 sm:h-80 md:px-6 lg:h-50"
    >
      <Container>
        <div
          data-animate="reveal"
          className="group/banner absolute inset-x-0 overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/40 ring-1 ring-white/5"
        >
          <Image
            src={HORIZON_IMAGES.landscape}
            alt="تجربه هورایزن"
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover/banner:scale-105 motion-reduce:transition-none"
          />

          {/* گرادینت تیره روی تصویر */}
          <div
            aria-hidden="true"
            className="from-overlay/95 via-overlay/80 to-overlay/25 absolute inset-0 bg-linear-to-l"
          />

          {/* نورهای تزئینی */}
          <div
            aria-hidden="true"
            className="bg-primary-500/25 pointer-events-none absolute -top-24 -right-24 size-72 rounded-full blur-3xl"
          />
          <div
            aria-hidden="true"
            className="bg-primary-400/10 pointer-events-none absolute -bottom-32 left-1/4 size-64 rounded-full blur-3xl"
          />

          {/* خط نوری بالای کارت */}
          <div
            aria-hidden="true"
            className="absolute inset-x-10 top-0 h-px bg-linear-to-l from-transparent via-white/40 to-transparent"
          />

          <div className="relative grid gap-8 px-6 py-8 md:grid-cols-[1.05fr_1fr] md:px-10 md:py-10 lg:px-14">
            <div className="max-w-lg">
              <div className="border-primary-400/30 bg-primary-400/10 text-primary-400 mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-sm">
                <span className="bg-primary-400 size-1.5 animate-pulse rounded-full" />
                چرا هورایزن؟
              </div>

              <h2 className="text-2xl leading-tight font-extrabold text-white md:text-3xl">
                بیش از یک رزرو،{" "}
                <span className="from-primary-300 to-primary-500 bg-linear-to-l bg-clip-text text-transparent">
                  یک تجربه
                </span>
              </h2>

              <p className="mt-3 max-w-md text-xs leading-7 text-white/70 md:text-sm">
                در هورایزن فقط اتاق رزرو نمی‌کنید؛ مقصد، طبیعت و آرامشی را
                انتخاب می‌کنید که قرار است بخشی از خاطرات شما شود.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:items-end">
              {EXPERIENCE_BANNER_ITEMS.map(
                ({ icon: Icon, title, desc, iconClassName }) => (
                  <div
                    key={title}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    {/* براق شدن گوشه‌ی کارت با هاور */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-8 -right-8 size-20 rounded-full bg-white/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                    />

                    <div className="mb-3 grid size-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110">
                      <Icon className={iconClassName} size={20} />
                    </div>

                    <div className="text-sm font-bold text-white">{title}</div>
                    <div className="mt-1 text-[11px] leading-5 text-white/55">
                      {desc}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}