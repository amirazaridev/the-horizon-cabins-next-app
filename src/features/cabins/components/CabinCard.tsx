import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CalendarDays,
  MapPin,
  Maximize,
  Users,
} from "lucide-react";
import { type ReactNode } from "react";
import { format as formatJalali } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import { type Cabin } from "@/features/cabins/lib/data-service";
import { formatCurrency } from "@/libs/utils/format";

export interface CabinCardProps {
  cabin: Cabin;

  variant?: "default" | "dashboard" | "landing";
  imageOverride?: string | StaticImageData;
  imageAlt?: string;
  href?: string;
  disableLink?: boolean;
  className?: string;
  children?: ReactNode;
  animation?: "none" | "hover";
  maxAmenities?: number;
  showPrice?: boolean;
}

const baseClasses =
  "group relative overflow-hidden rounded-3xl border border-foreground/5 bg-surface";

const animationClasses = {
  none: "transition-all duration-300",
  hover:
    "transition-all duration-500 hover:border-primary-400/30 hover:shadow-2xl hover:shadow-primary-400/10",
};

export default function CabinCard({
  cabin,
  variant = "default",
  ...props
}: CabinCardProps): ReactNode {
  const card =
    variant === "dashboard" ? (
      <DashboardCard cabin={cabin} {...props} />
    ) : variant === "landing" ? (
      <LandingCard cabin={cabin} {...props} />
    ) : (
      <DefaultCard cabin={cabin} {...props} />
    );

  // نسخه داشبورد هرگز لینک نیست (داخلش منوی دکمه‌دار داریم)
  if (variant === "dashboard" || props.disableLink) return card;

  return (
    <Link href={props.href ?? `/cabins/${cabin.id}`} className="block">
      {card}
    </Link>
  );
}

type CardVariantProps = Omit<
  CabinCardProps,
  "variant" | "href" | "disableLink"
>;

function LandingCard({
  cabin,
  imageOverride,
  imageAlt,
  className = "",
  animation = "hover",
  showPrice = false,
}: CardVariantProps): ReactNode {
  const { name, bedrooms, areaSqm, images, city, regularPrice, discount } =
    cabin;
  const image = imageOverride ?? images?.[0];
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount ? regularPrice - discount : regularPrice;

  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} flex h-full flex-col ${className}`}
    >
      <div className="bg-background-2 relative aspect-video overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={imageAlt || name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="text-text-gray flex h-full items-center justify-center text-xs">
            تصویر موجود نیست
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="text-text truncate text-base font-bold">{name}</h3>

        <div className="text-text-gray flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          {city?.name && (
            <span className="flex min-w-0 items-center gap-1">
              <MapPin className="text-primary-400 size-3.5 shrink-0" />
              <span className="truncate">{city.name}</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <BedDouble className="text-primary-400 size-3.5" />
            {bedrooms.toLocaleString("fa-IR")}
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="text-primary-400 size-3.5" />
            {areaSqm.toLocaleString("fa-IR")} متر
          </span>
        </div>
        {showPrice && (
          <div className="mt-auto flex items-baseline gap-1.5 pt-1.5">
            {hasDiscount && (
              <span className="text-text-gray/60 text-[11px] line-through">
                {formatCurrency(regularPrice)}
              </span>
            )}
            <span className="text-primary-500 text-sm font-extrabold tabular-nums">
              {formatCurrency(finalPrice)}
            </span>
            <span className="text-text-gray text-[10px]">تومان/شب</span>
          </div>
        )}
      </div>
    </div>
  );
}

function DefaultCard({
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
    regularPrice,
    discount,
    maxCapacity,
    amenities,
    bedrooms,
    bathrooms,
    areaSqm,
    images,
    city,
  } = cabin;

  const image = imageOverride ?? images?.[0];
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount ? regularPrice - discount : regularPrice;
  const discountPercent = hasDiscount
    ? Math.round((discount / regularPrice) * 100)
    : 0;
  const visibleAmenities = amenities.slice(0, maxAmenities);
  const remainingAmenitiesCount = amenities.length - visibleAmenities.length;

  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} flex h-full flex-col ${className}`}
    >
      {/* تصویر */}
      <div className="bg-background-2 relative aspect-video overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={imageAlt || name}
            fill
            sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="text-text-gray flex h-full items-center justify-center text-xs">
            تصویر موجود نیست
          </div>
        )}

        {hasDiscount && (
          <span className="bg-danger-strong absolute top-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-bold text-white">
            {discountPercent.toLocaleString("fa-IR")}٪ تخفیف
          </span>
        )}
      </div>

      {/* محتوا */}
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
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-text-gray/70 text-[11px] line-through">
                {formatCurrency(regularPrice)}
              </span>
            )}
            <span className="text-text text-sm font-extrabold tabular-nums sm:text-base">
              {formatCurrency(finalPrice)}
              <span className="text-text-gray mr-1 text-[10px] font-normal">
                تومان/شب
              </span>
            </span>
          </div>

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

function DashboardCard({
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
    regularPrice,
    discount,
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
  const hasDiscount = discount > 0;
  const discountPercent = hasDiscount
    ? Math.round((discount / regularPrice) * 100)
    : 0;
  const visibleAmenities = amenities.slice(0, maxAmenities);
  const remainingAmenitiesCount = amenities.length - visibleAmenities.length;

  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} ${className}`}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={image || ""}
          alt={imageAlt || name}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
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
          <span className="text-text-gray flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {formatJalali(new Date(createdAt), "d MMMM yyyy", { locale: faIR })}
          </span>
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
          <PriceRow label="قیمت اصلی" value={formatCurrency(regularPrice)} />
          {hasDiscount && (
            <PriceRow
              label={`تخفیف (${discountPercent}٪)`}
              value={formatCurrency(discount)}
              tone="danger"
            />
          )}
          <div className="border-border border-t pt-1.5" />
          <PriceRow
            label="قیمت نهایی / شب"
            value={formatCurrency(
              hasDiscount ? regularPrice - discount : regularPrice,
            )}
            bold
          />
        </div>
      </div>
    </div>
  );
}

function PriceBadge({ cabin }: { cabin: Cabin }): ReactNode {
  const { regularPrice, discount } = cabin;
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount ? regularPrice - discount : regularPrice;
  const discountPercent = hasDiscount
    ? Math.round((discount / regularPrice) * 100)
    : 0;

  return (
    <div className="absolute top-4 right-2 flex items-center justify-between gap-2 sm:right-4">
      <span className="bg-primary-400 max-w-27 truncate rounded-full px-4 py-1.5 text-xs font-bold text-black sm:max-w-max md:text-sm">
        {formatCurrency(finalPrice)} تومان/هر شب
      </span>
      {hasDiscount && (
        <>
          <span className="bg-surface/80 text-text/60 rounded-full px-4 py-1.5 text-xs font-medium line-through backdrop-blur-sm md:text-sm">
            {formatCurrency(regularPrice)}
          </span>
          <span className="bg-danger-strong rounded-full px-3 py-1.5 text-[10px] font-bold text-white md:text-xs">
            {discountPercent}٪ تخفیف
          </span>
        </>
      )}
    </div>
  );
}

// function SpecItem({
//   icon,
//   children,
// }: {
//   icon: ReactNode;
//   children: ReactNode;
// }): ReactNode {
//   return (
//     <div className="flex items-center gap-2">
//       {icon}
//       <span>{children}</span>
//     </div>
//   );
// }

function SpecTile({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: number;
  label: string;
}): ReactNode {
  return (
    <div className="bg-background-2 flex flex-col items-center gap-1 rounded-xl py-2.5">
      <span className="text-primary-400">{icon}</span>
      <span className="text-text text-sm font-bold">
        {value.toLocaleString("fa-IR")}
      </span>
      <span className="text-text-gray text-[10px]">{label}</span>
    </div>
  );
}

function AmenityChip({ children }: { children: ReactNode }): ReactNode {
  return (
    <span className="bg-foreground/5 text-text-gray rounded-full px-3 py-1 text-xs sm:text-sm">
      {children}
    </span>
  );
}

function PriceRow({
  label,
  value,
  tone = "default",
  bold = false,
}: {
  label: string;
  value: string;
  tone?: "default" | "danger";
  bold?: boolean;
}): ReactNode {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-gray">{label}</span>
      <span
        className={`font-semibold tabular-nums ${
          tone === "danger" ? "text-danger" : "text-text"
        } ${bold ? "text-base font-extrabold" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
