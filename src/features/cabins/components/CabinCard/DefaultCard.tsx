import { ArrowLeft, Bath, BedDouble, MapPin, Users } from "lucide-react";
import type { ReactNode } from "react";

import { resolveCabinPrice } from "@/features/cabins/utils/cabin-price";
import { formatCurrency } from "@/libs/utils/format";
import { animationClasses, baseClasses, CARD_IMAGE_SIZES } from "./classes";
import { AmenityChip, CardImage } from "./primitives";
import type { CardVariantProps } from "./types";

/**
 * کارت پیش‌فرض — کارت صفحه‌ی «اقامتگاه‌ها» و پیش‌نمایش جستجو.
 * (تنها واریانتی که قلب «علاقه‌مندی» رویش می‌آید.)
 */
export default function DefaultCard({
  cabin,
  imageOverride,
  imageAlt,
  className = "",
  children,
  animation = "hover",
  maxAmenities = 3,
}: CardVariantProps): ReactNode {
  const {
    name,
    maxCapacity,
    amenities,
    bedrooms,
    bathrooms,
    areaSqm,
    images,
    city,
  } = cabin;

  const image = imageOverride ?? images?.[0];

  //* با تاریخ، کارت «جمع کل بازه» را نشان می‌دهد و تخفیف شبانه بی‌معناست.
  const stay = cabin.pricing?.mode === "stay" ? cabin.pricing : null;

  //* قیمت مؤثر از `pricing` استخراج می‌شود (فیلد `discount` در API وجود ندارد).
  const { originalPrice, finalPrice, hasDiscount, discountPercent } =
    resolveCabinPrice(cabin);

  const visibleAmenities = amenities.slice(0, maxAmenities);
  const remainingAmenitiesCount = amenities.length - visibleAmenities.length;

  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} flex h-full flex-col ${className}`}
    >
      <div className="bg-background-2 relative aspect-video overflow-hidden">
        <CardImage
          image={image}
          alt={imageAlt || name}
          sizes={CARD_IMAGE_SIZES.default}
          hover="lg"
        />

        {hasDiscount && (
          <span className="bg-danger-strong absolute top-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-bold text-white">
            {discountPercent.toLocaleString("fa-IR")}٪ تخفیف
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3.5 sm:p-4">
        {/* عنوان + متراژ */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-text min-w-0 truncate text-base font-bold sm:text-lg">
            {name}
          </h3>
          <span className="text-text-gray shrink-0 text-xs">
            {areaSqm.toLocaleString("fa-IR")} متر
          </span>
        </div>

        {/* شهر + مشخصات در یک ردیف */}
        <div className="text-text-gray flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          {city?.name && (
            <span className="flex min-w-0 items-center gap-1">
              <MapPin className="text-primary-400 size-3.5 shrink-0" />
              <span className="truncate">{city.name}</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="text-primary-400 size-3.5" />
            {maxCapacity.toLocaleString("fa-IR")}
          </span>
          <span className="flex items-center gap-1">
            <BedDouble className="text-primary-400 size-3.5" />
            {bedrooms.toLocaleString("fa-IR")}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="text-primary-400 size-3.5" />
            {bathrooms.toLocaleString("fa-IR")}
          </span>
        </div>

        {/* امکانات */}
        {visibleAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleAmenities.map((amenity) => (
              <AmenityChip key={amenity}>{amenity}</AmenityChip>
            ))}
            {remainingAmenitiesCount > 0 && (
              <AmenityChip>
                +{remainingAmenitiesCount.toLocaleString("fa-IR")}
              </AmenityChip>
            )}
          </div>
        )}

        {/* قیمت + دکمه */}
        <div className="border-border mt-auto flex items-center justify-between gap-2 border-t pt-3">
          {stay ? (
            /* با تاریخ: جمع کل بازه + تعداد شب (خروجی مستقیم API) */
            <div className="flex flex-col">
              <span className="text-text-gray text-[11px]">
                {stay.nights.toLocaleString("fa-IR")} شب اقامت
              </span>
              <span className="text-text text-sm font-extrabold tabular-nums sm:text-base">
                {formatCurrency(stay.totalPrice)}
                <span className="text-text-gray mr-1 text-[10px] font-normal">
                  تومان
                </span>
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-text-gray/70 text-[11px] line-through">
                  {formatCurrency(originalPrice)}
                </span>
              )}
              <span className="text-text text-sm font-extrabold tabular-nums sm:text-base">
                {formatCurrency(finalPrice)}
                <span className="text-text-gray mr-1 text-[10px] font-normal">
                  تومان/شب
                </span>
              </span>
            </div>
          )}

          {children || (
            <span className="bg-foreground/5 text-text group-hover:bg-primary-400 flex size-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:text-black">
              <ArrowLeft className="size-4" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
