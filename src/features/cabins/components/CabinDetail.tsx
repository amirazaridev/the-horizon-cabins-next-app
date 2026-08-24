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
import type { Cabin } from "../lib/data-service";

export default function CabinDetail({ cabin }: { cabin: Cabin }): ReactNode {
  const [mainImage, ...galleryImages] = cabin.images.length
    ? cabin.images
    : [cabin.image];

  return (
    <div>
      <div className="group relative overflow-hidden rounded-3xl border border-white/5">
        <div className="relative aspect-21/9">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={mainImage}
            alt={cabin.name}
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />
        </div>

        <div className="absolute right-5 bottom-5 left-5 flex flex-wrap items-end justify-between gap-4 sm:right-8 sm:bottom-8 sm:left-8">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md">
              <MapPin className="text-primary-400 size-3.5" />
              {cabin.location.region}
            </span>
            <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              {cabin.name}
              <span className="text-primary-400">.</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-md">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span className="font-bold text-white">{cabin.rating}</span>
            <span className="text-sm text-white/50">
              ({cabin.reviewCount} نظر)
            </span>
          </div>
        </div>
      </div>

      {galleryImages.length > 0 && (
        <div
          className={`mt-4 grid gap-4 ${
            galleryImages.length > 1 ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {galleryImages.slice(0, 2).map((image, i) => (
            <div
              key={i}
              className="group relative aspect-video overflow-hidden rounded-2xl border border-white/5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={image}
                alt={`${cabin.name} - تصویر ${i + 2}`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: Users, value: `${cabin.maxCapacity}`, label: "نفر ظرفیت" },
          { icon: BedDouble, value: `${cabin.bedrooms}`, label: "اتاق خواب" },
          { icon: Bath, value: `${cabin.bathrooms}`, label: "سرویس بهداشتی" },
          { icon: Maximize, value: `${cabin.size}`, label: "متر مربع" },
        ].map((spec) => (
          <div
            key={spec.label}
            className="rounded-2xl border border-white/5 bg-slate-900/60 p-5 text-center transition-colors duration-300 hover:border-primary-400/30"
          >
            <spec.icon className="text-primary-400 mx-auto mb-3 size-6" />
            <p className="text-2xl font-bold text-white">{spec.value}</p>
            <p className="mt-1 text-sm text-white/50">{spec.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="mb-4 text-xl font-bold text-white">درباره این کابین</h2>
          <p className="leading-loose text-white/60">{cabin.description}</p>

          <h2 className="mt-10 mb-5 text-xl font-bold text-white">ویژگی‌ها</h2>
          <div className="flex flex-wrap gap-2.5">
            {cabin.features.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 transition-colors duration-300 hover:border-primary-400/40 hover:text-primary-400"
              >
                {feature}
              </span>
            ))}
          </div>

          <h2 className="mt-10 mb-5 text-xl font-bold text-white">امکانات</h2>
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {cabin.amenities.map((amenity) => (
              <li key={amenity} className="flex items-center gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-400/10">
                  <Check className="text-primary-400 size-3.5" />
                </span>
                <span className="text-white/60">{amenity}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:col-span-2">
          <div className="sticky top-24 rounded-3xl p-[1px] bg-gradient-to-br from-primary-400/40 via-white/10 to-transparent">
            <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 p-7 backdrop-blur-sm md:p-8">
              <div className="absolute -top-20 -left-20 size-48 rounded-full bg-primary-400/10 blur-[80px]" />

              {cabin.discount ? (
                <div className="relative mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-white">
                      ${cabin.price - cabin.discount}
                    </span>
                    <span className="text-lg text-white/40 line-through">
                      ${cabin.price}
                    </span>
                    <span className="rounded-full bg-primary-400 px-3 py-1 text-xs font-bold text-black">
                      {Math.round(
                        (cabin.discount / cabin.price) * 100,
                      )}
                      ٪ تخفیف
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
                {["تأیید آنی رزرو", "پرداخت هنگام ورود", "لغو رایگان تا ۴۸ ساعت"].map(
                  (perk) => (
                    <p key={perk} className="flex items-center gap-3 text-white/60">
                      <Check className="text-primary-400 size-4 shrink-0" />
                      {perk}
                    </p>
                  ),
                )}
              </div>

              <div className="relative mt-6 flex flex-col gap-3">
                <Button shape="xl" fullWidth>
                  رزرو این کابین
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
