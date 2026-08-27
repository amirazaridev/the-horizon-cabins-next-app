import { type StaticImageData } from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
import { type ReactNode } from "react";

export interface CabinCardProps {
  name: string;
  price: number;
  discount?: number;
  capacity?: number;
  image: string | StaticImageData;
  imageAlt?: string;
  features?: string[];
  size?: string;
  href?: string;
  className?: string;
  children?: ReactNode;
  animation?: "none" | "hover";
}

export default function CabinCard({
  name,
  price,
  discount,
  capacity,
  image,
  imageAlt,
  features = [],
  size,
  href,
  className = "",
  children,
  animation = "hover",
}: CabinCardProps): ReactNode {
  const baseClasses =
    "group relative overflow-hidden rounded-3xl border border-white/5 bg-surface";

  const animationClasses = {
    none: "transition-all duration-300",
    hover:
      "transition-all duration-500 hover:border-primary-400/30 hover:shadow-2xl hover:shadow-primary-400/10",
  };

  const cardClasses = `${baseClasses} ${animationClasses[animation]} ${className}`;

  const hasDiscount = Boolean(discount && discount > 0);
  const discountPercent = hasDiscount ? (discount as number) : 0;
  const discountedPrice = hasDiscount
    ? Math.round(price * (1 - discountPercent / 100))
    : price;

  const priceBadge = (
    <div className="absolute top-4 right-4 flex items-center gap-2" dir="ltr">
      {hasDiscount && (
        <span className="rounded-full bg-surface/80 px-4 py-1.5 text-sm font-medium text-text/60 line-through backdrop-blur-sm">
          ${price}
        </span>
      )}
      <span className="bg-primary-400 rounded-full px-4 py-1.5 text-sm font-bold text-black">
        ${discountedPrice}/هر شب
      </span>
    </div>
  );

  const discountBadge = hasDiscount ? (
    <span className="absolute top-4 left-4 rounded-full bg-danger-strong px-3 py-1.5 text-xs font-bold text-white">
      {discountPercent}٪ تخفیف
    </span>
  ) : null;

  const cardContent = (
    <div className={cardClasses}>
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          alt={imageAlt || name}
          src={typeof image === "string" ? image : image.src}
        />
        <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent" />
        {priceBadge}
        {discountBadge}
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white sm:text-2xl">{name}</h3>
          {size && (
            <span className="text-xs text-white/40 sm:text-sm">{size}</span>
          )}
        </div>

        {capacity !== undefined && (
          <div className="text-text-gray mb-3 flex items-center gap-2 text-sm">
            <Users className="text-primary-400 size-4" />
            <span>ظرفیت تا {capacity.toLocaleString("fa-IR")} نفر</span>
          </div>
        )}

        {features.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {features.map((feature, i) => (
              <span
                key={i}
                className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60 sm:text-sm"
              >
                {feature}
              </span>
            ))}
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

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
