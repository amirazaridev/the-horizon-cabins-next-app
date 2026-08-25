import {
  Bath,
  BedDouble,
  Check,
  MapPin,
  Maximize,
  MoveLeft,
  Phone,
  Star,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import CabinGallery from "@/features/cabins/components/CabinGallery";
import type { Cabin } from "../lib/data-service";
import BadgeTitle from "@/components/ui/BadgeTitle";
import CardContainer from "@/components/ui/CardContainer";

export default function CabinDetail({ cabin }: { cabin: Cabin }): ReactNode {
  const images = cabin.images.length ? cabin.images : [cabin.image];

  return (
    <div>
      <CabinGallery images={images} altBase={cabin.name}>
        <div className="pointer-events-none absolute right-5 bottom-5 left-5 z-10 flex flex-wrap items-end justify-between gap-4 sm:right-8 sm:bottom-8 sm:left-8">
          <div>
            <BadgeTitle className="text-text/80 mb-3 gap-2 px-4 py-1.5 text-xs font-medium">
              <MapPin className="text-primary-400 size-3.5" />
              {cabin.location.region}
            </BadgeTitle>
            <h1 className="text-text text-3xl font-bold sm:text-4xl md:text-5xl">
              {cabin.name}
              <span className="text-primary-400">.</span>
            </h1>
          </div>

          <BadgeTitle className="gap-x-2 px-4 py-2">
            <Star className="fill-primary-400 text-primary-400 size-4" />
            <span className="font-bold text-white">{cabin.rating}</span>
            <span className="text-text/50 text-sm">
              ({cabin.reviewCount} نظر)
            </span>
          </BadgeTitle>
        </div>
      </CabinGallery>

      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: Users, value: `${cabin.maxCapacity}`, label: "نفر ظرفیت" },
          { icon: BedDouble, value: `${cabin.bedrooms}`, label: "اتاق خواب" },
          { icon: Bath, value: `${cabin.bathrooms}`, label: "سرویس بهداشتی" },
          { icon: Maximize, value: `${cabin.size}`, label: "متر مربع" },
        ].map((spec) => (
          <CardContainer
            key={spec.label}
            className="hover:border-primary-400/30 text-center"
          >
            <spec.icon className="text-primary-400 mx-auto mb-3 size-6" />
            <p className="text-2xl font-bold text-white">{spec.value}</p>
            <p className="mt-1 text-sm text-white/50">{spec.label}</p>
          </CardContainer>
        ))}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="mb-4 text-xl font-bold text-white">
            درباره این اقامتگاه
          </h2>
          <p className="leading-loose text-white/60">{cabin.description}</p>

          <h2 className="mt-10 mb-5 text-xl font-bold text-white">ویژگی‌ها</h2>
          <div className="flex flex-wrap gap-2.5">
            {cabin.features.map((feature) => (
              <span
                key={feature}
                className="hover:border-primary-400/40 hover:text-primary-400 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 transition-colors duration-300"
              >
                {feature}
              </span>
            ))}
          </div>

          <h2 className="mt-10 mb-5 text-xl font-bold text-white">امکانات</h2>
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {cabin.amenities.map((amenity) => (
              <li key={amenity} className="flex items-center gap-3">
                <span className="bg-primary-400/10 flex size-6 shrink-0 items-center justify-center rounded-full">
                  <Check className="text-primary-400 size-3.5" />
                </span>
                <span className="text-white/60">{amenity}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="lg:col-span-2">
          <div className="from-primary-400/40 sticky top-24 rounded-3xl bg-gradient-to-br via-white/10 to-transparent p-[1px]">
            <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 p-7 backdrop-blur-sm md:p-8">
              <div className="bg-primary-400/10 absolute -top-20 -left-20 size-48 rounded-full blur-[80px]" />

              {cabin.discount ? (
                <div className="relative mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-white">
                      ${cabin.price - cabin.discount}
                    </span>
                    <span className="text-lg text-white/40 line-through">
                      ${cabin.price}
                    </span>
                    <span className="bg-primary-400 rounded-full px-3 py-1 text-xs font-bold text-black">
                      {Math.round((cabin.discount / cabin.price) * 100)}٪ تخفیف
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/50">در هر شب</p>
                </div>
              ) : (
                <div className="relative mb-6">
                  <span className="text-4xl font-bold text-white">
                    ${cabin.price}
                  </span>
                  <p className="mt-2 text-sm text-white/50">در هر شب</p>
                </div>
              )}

              <div className="relative space-y-3 border-y border-white/10 py-5 text-sm">
                {[
                  "تأیید آنی رزرو",
                  "پرداخت هنگام ورود",
                  "لغو رایگان تا ۴۸ ساعت",
                ].map((perk) => (
                  <p
                    key={perk}
                    className="flex items-center gap-3 text-white/60"
                  >
                    <Check className="text-primary-400 size-4 shrink-0" />
                    {perk}
                  </p>
                ))}
              </div>

              <div className="relative mt-6 flex flex-col gap-3">
                <Button shape="xl" fullWidth>
                  رزرو این اقامتگاه
                  <MoveLeft className="size-5 transition-transform duration-300 group-hover:-translate-x-1" />
                </Button>
                <Button href="tel:+989000000000" variant="outline" shape="xl">
                  <Phone className="size-5" />
                  مشاوره و تماس
                </Button>
              </div>

              <p className="relative mt-4 text-center text-xs text-white/40">
                رزرو نهایی در صفحه پرداخت انجام می‌شود
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
