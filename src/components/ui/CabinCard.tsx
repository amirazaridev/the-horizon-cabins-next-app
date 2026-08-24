import { type StaticImageData } from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";

export interface CabinCardProps {
  name: string;
  price: string;
  image: string | StaticImageData;
  imageAlt?: string;
  features?: string[];
  size?: string;
  href?: string;
  className?: string;
  children?: ReactNode;
  animation?: "none" | "hover" | "scroll" | "landing";
}

export default function CabinCard({
  name,
  price,
  image,
  imageAlt,
  features = [],
  size,
  href,
  className = "",
  children,
  animation = "hover",
}: CabinCardProps): ReactNode {
  const baseClasses = "group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900";

  const animationClasses = {
    none: "transition-all duration-300",
    hover: "transition-all duration-500 hover:border-primary-400/30 hover:shadow-2xl hover:shadow-primary-400/10",
    scroll: "transition-all duration-500",
    landing: "transition-all duration-500 hover:border-primary-400/30 hover:shadow-2xl hover:shadow-primary-400/10",
  };

  const cardClasses = `${baseClasses} ${animationClasses[animation]} ${className}`;

  const cardContent = (
    <div className={cardClasses}>
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          
          
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={imageAlt || name}
          src={image}
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />
        <div className="absolute top-4 right-4 rounded-full bg-primary-400 px-4 py-1.5 text-sm font-bold text-black">
          {price}/هر شب
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl sm:text-2xl font-bold text-white">{name}</h3>
          {size && <span className="text-xs sm:text-sm text-white/40">{size}</span>}
        </div>

        {features.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {features.map((feature, i) => (
              <span
                key={i}
                className="rounded-full bg-white/5 px-3 py-1 text-xs sm:text-sm text-white/60"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        {children || (
          <button className="w-full rounded-xl border border-white/10 bg-white/5 py-3 font-semibold text-white transition-all duration-300 hover:border-primary-400 hover:bg-primary-400 hover:text-black">
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