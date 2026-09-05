import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Users, BedDouble, Bath } from "lucide-react";
import { type ReactNode } from "react";
import { type Cabin } from "@/features/cabins/lib/data-service";
import { formatNumberFa } from "@/libs/format";

export interface CabinCardProps {
  cabin: Cabin;
  imageOverride?: string | StaticImageData;
  imageAlt?: string;
  href?: string;
  disableLink?: boolean;
  className?: string;
  children?: ReactNode;
  animation?: "none" | "hover";
  maxAmenities?: number;
}

export default function CabinCard({
  cabin,
  imageOverride,
  imageAlt,
  href,
  disableLink = false,
  className = "",
  children,
  animation = "hover",
  maxAmenities = 4,
}: CabinCardProps): ReactNode {
  const {
    id,
    name,
    regularPrice,
    discount,
    maxCapacity,
    amenities,
    bedrooms,
    bathrooms,
    areaSqm,
    images,
  } = cabin;

  const image = imageOverride ?? images[0];
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount ? regularPrice - discount : regularPrice;
  const discountPercent = hasDiscount
    ? Math.round((discount / regularPrice) * 100)
    : 0;

  const visibleAmenities = amenities.slice(0, maxAmenities);
  const remainingAmenitiesCount = amenities.length - visibleAmenities.length;

  const baseClasses =
    "group relative overflow-hidden rounded-3xl border border-white/5 bg-surface";

  const animationClasses = {
    none: "transition-all duration-300",
    hover:
      "transition-all duration-500 hover:border-primary-400/30 hover:shadow-2xl hover:shadow-primary-400/10",
  };

  const cardClasses = `${baseClasses} ${animationClasses[animation]} ${className}`;

  const priceBadge = (
    <div className="absolute top-4 right-2 sm:right-4 flex items-center justify-between gap-2">
      <span className="bg-primary-400 rounded-full px-4 py-1.5 text-xs md:text-sm font-bold text-black max-w-27 sm:max-w-max">
        {formatNumberFa(finalPrice)} تومان/هر شب
      </span>
      {hasDiscount && (
        <>
          <span className="bg-surface/80 text-text/60 rounded-full px-4 py-1.5 text-xs font-medium line-through backdrop-blur-sm md:text-sm">
            {formatNumberFa(regularPrice)}
          </span>
          <span className="bg-danger-strong  rounded-full px-3 py-1.5 text-[10px] md:text-xs font-bold text-white">
            {discountPercent}٪ تخفیف
          </span>
        </>
      )}
    </div>
  );


  const cardContent = (
    <div className={cardClasses}>
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={image}
          alt={imageAlt || name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="from-surface absolute inset-0 bg-linear-to-t via-transparent to-transparent" />
        {priceBadge}
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white sm:text-2xl">{name}</h3>
          <span className="text-xs text-white/40 sm:text-sm">
            {areaSqm} متر مربع
          </span>
        </div>

        <div className="text-text-gray mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <div className="flex items-center gap-2">
            <Users className="text-primary-400 size-4" />
            <span>تا {maxCapacity} نفر</span>
          </div>
          <div className="flex items-center gap-2">
            <BedDouble className="text-primary-400 size-4" />
            <span>{bedrooms} اتاق خواب</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="text-primary-400 size-4" />
            <span>{bathrooms} سرویس</span>
          </div>
        </div>

        {amenities.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {visibleAmenities.map((amenity) => (
              <span
                key={amenity}
                className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60 sm:text-sm"
              >
                {amenity}
              </span>
            ))}
            {remainingAmenitiesCount > 0 && (
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/40 sm:text-sm">
                +{remainingAmenitiesCount.toLocaleString("fa-IR")}
              </span>
            )}
          </div>
        )}

        {children || (
          <button className="hover:border-primary-400 hover:bg-primary-400 w-full rounded-xl border border-white/10 bg-white/5 py-3 font-semibold text-white transition-all duration-300 hover:text-black">
            مشاهده جزئیات
          </button>
        )}
      </div>
    </div>
  );

  if (disableLink) return cardContent;

  return (
    <Link href={href ?? `/cabins/${id}`} className="block">
      {cardContent}
    </Link>
  );
}
