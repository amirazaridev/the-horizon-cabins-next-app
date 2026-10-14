import { Bath, BedDouble, MapPin, Maximize, Users } from "lucide-react";
import type { ReactNode } from "react";

import { resolveCabinPrice } from "@/features/cabins/utils/cabin-price";
import { formatCurrency } from "@/libs/utils/format";
import { animationClasses, baseClasses, CARD_IMAGE_SIZES } from "./classes";
import {
  AmenityChip,
  CardImage,
  CreatedAtLabel,
  PriceBadge,
  PriceRow,
  SpecTile,
} from "./primitives";
import type { CardVariantProps } from "./types";

export default function DashboardCard({
  cabin,
  imageOverride,
  imageAlt,
  className = "",
  children,
  animation = "none",
  maxAmenities = 6,
}: CardVariantProps): ReactNode {
  const {
    id,
    name,
    maxCapacity,
    amenities,
    bedrooms,
    bathrooms,
    areaSqm,
    images,
    createdAt,
    city,
  } = cabin;

  const image = imageOverride ?? images?.[0];

  //* قیمت مؤثر از `pricing` استخراج می‌شود (فیلد `discount` در API وجود ندارد).
  const { originalPrice, finalPrice, hasDiscount, discountPercent } =
    resolveCabinPrice(cabin);

  const visibleAmenities = amenities.slice(0, maxAmenities);
  const remainingAmenitiesCount = amenities.length - visibleAmenities.length;

  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} ${className}`}
    >
      <div className="relative aspect-video overflow-hidden">
        <CardImage
          image={image}
          alt={imageAlt || name}
          sizes={CARD_IMAGE_SIZES.dashboard}
        />
        <div className="from-surface/90 absolute inset-0 bg-linear-to-t via-transparent to-transparent" />
        <PriceBadge cabin={cabin} />
        {hasDiscount && (
          <span className="bg-danger-strong absolute top-4 left-4 rounded-full px-3 py-1.5 text-[10px] font-bold text-white md:text-xs">
            {discountPercent}٪ تخفیف
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4 p-5">
        {/* عنوان + منوی عملیات (children) */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-text truncate text-lg font-bold">{name}</h3>
            <p className="text-text-gray mt-0.5 text-xs">
              کد سوییت: {id.toLocaleString("fa-IR")}
            </p>
          </div>
          {children}
        </div>

        {/* مشخصات کامل */}
        <div className="grid grid-cols-4 gap-2">
          <SpecTile
            icon={<Users className="size-4" />}
            value={maxCapacity}
            label="ظرفیت"
          />
          <SpecTile
            icon={<BedDouble className="size-4" />}
            value={bedrooms}
            label="اتاق خواب"
          />
          <SpecTile
            icon={<Bath className="size-4" />}
            value={bathrooms}
            label="سرویس"
          />
          <SpecTile
            icon={<Maximize className="size-4" />}
            value={areaSqm}
            label="متر مربع"
          />
        </div>

        {city?.name && (
          <div className="text-text-gray mb-3 flex items-center gap-1.5 text-sm">
            <MapPin className="text-primary-400 size-4" />
            <span>{city.name}</span>
          </div>
        )}

        {/* امکانات */}
        {amenities.length > 0 && (
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

        <div className="border-border flex items-center justify-between border-t pt-3 text-xs">
          <CreatedAtLabel createdAt={createdAt} />
          <span
            className={`rounded-full px-2.5 py-1 font-medium ${
              hasDiscount
                ? "bg-danger/10 text-danger"
                : "bg-foreground/5 text-text-gray"
            }`}
          >
            {hasDiscount ? "تخفیف‌دار" : "قیمت اصلی"}
          </span>
        </div>

        {/* قیمت‌نامه */}
        <div className="bg-background-2 flex flex-col gap-1.5 rounded-xl p-3.5 text-sm">
          <PriceRow label="قیمت اصلی" value={formatCurrency(originalPrice)} />
          {hasDiscount && (
            <PriceRow
              label={`تخفیف (${discountPercent}٪)`}
              value={formatCurrency(originalPrice - finalPrice)}
              tone="danger"
            />
          )}
          <div className="border-border border-t pt-1.5" />
          <PriceRow
            label="قیمت نهایی / شب"
            value={formatCurrency(finalPrice)}
            bold
          />
        </div>
      </div>
    </div>
  );
}
