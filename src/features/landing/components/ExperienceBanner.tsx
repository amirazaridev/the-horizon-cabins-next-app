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
          className="absolute inset-x-0 overflow-hidden rounded-3xl border border-white/10"
        >
          <Image
            src={HORIZON_IMAGES.landscape}
            alt="تجربه هورایزن"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="from-overlay/95 via-overlay/80 to-overlay/25 absolute inset-0 bg-linear-to-l"
          />
          <div className="relative grid gap-8 px-6 py-8 md:grid-cols-[1.05fr_1fr] md:px-10 md:py-10 lg:px-14">
            <div className="max-w-lg">
              <div className="text-primary-400 mb-2 text-[11px] font-semibold">
                چرا هورایزن؟
              </div>
              <h2 className="text-2xl font-extrabold text-white md:text-3xl">
                بیش از یک رزرو، یک تجربه
              </h2>
              <p className="mt-3 max-w-md text-xs leading-7 text-white/60 md:text-sm">
                در هورایزن فقط اتاق رزرو نمی‌کنید؛ مقصد، طبیعت و آرامشی را
                انتخاب می‌کنید که قرار است بخشی از خاطرات شما شود.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:items-end">
              {EXPERIENCE_BANNER_ITEMS.map(
                ({ icon: Icon, title, desc, iconClassName }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-md"
                  >
                    <Icon className={`mb-3 ${iconClassName}`} size={20} />
                    <div className="text-sm font-bold text-white">{title}</div>
                    <div className="mt-1 text-[10px] leading-5 text-white/45">
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
