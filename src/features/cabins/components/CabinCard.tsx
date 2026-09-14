import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Bath, BedDouble, CalendarDays, Maximize, Users } from "lucide-react";
import { type ReactNode } from "react";
import { format as formatJalali } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import { type Cabin } from "@/features/cabins/lib/data-service";
import { formatCurrency } from "@/libs/utils/format";

export interface CabinCardProps {
  cabin: Cabin;
  /**
   * "dashboard" → نسخه مدیریتی با اطلاعات کامل‌تر (قیمت‌نامه، تاریخ ثبت، کد)
   * و بدون لینک — عملیات را از طریق prop «children» (منو) دریافت می‌کند.
   */
  variant?: "default" | "dashboard";
  imageOverride?: string | StaticImageData;
  imageAlt?: string;
  href?: string;
  disableLink?: boolean;
  className?: string;
  children?: ReactNode;
  animation?: "none" | "hover";
  maxAmenities?: number;
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

function DefaultCard({
  cabin,
  imageOverride,
  imageAlt,
  className = "",
  children,
  animation = "hover",
  maxAmenities = 4,
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
  } = cabin;

  const image = imageOverride ?? images[0];
  const visibleAmenities = amenities.slice(0, maxAmenities);
  const remainingAmenitiesCount = amenities.length - visibleAmenities.length;

  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} ${className}`}
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={image}
          alt={imageAlt || name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="from-surface absolute inset-0 bg-linear-to-t via-transparent to-transparent" />
        <PriceBadge cabin={cabin} />
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-text text-xl font-bold sm:text-2xl">{name}</h3>
          <span className="text-text-gray text-xs sm:text-sm">
            {areaSqm} متر مربع
          </span>
        </div>

        <div className="text-text-gray mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <SpecItem icon={<Users className="text-primary-400 size-4" />}>
            تا {maxCapacity} نفر
          </SpecItem>
          <SpecItem icon={<BedDouble className="text-primary-400 size-4" />}>
            {bedrooms} اتاق خواب
          </SpecItem>
          <SpecItem icon={<Bath className="text-primary-400 size-4" />}>
            {bathrooms} سرویس
          </SpecItem>
        </div>

        {amenities.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
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

        {children || (
          <button className="hover:border-primary-400 hover:bg-primary-400 border-foreground/10 bg-foreground/5 text-text hover:text-background w-full rounded-xl border py-3 font-semibold transition-all duration-300">
            مشاهده جزئیات
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════ نسخه داشبورد (ادمین) ═══════════════════ */

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
  } = cabin;

  const image = imageOverride ?? images[0];
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
          src={image}
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
        \
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
      <span className="bg-primary-400 max-w-27 rounded-full px-4 py-1.5 text-xs font-bold text-black sm:max-w-max md:text-sm">
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

function SpecItem({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}): ReactNode {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{children}</span>
    </div>
  );
}

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
