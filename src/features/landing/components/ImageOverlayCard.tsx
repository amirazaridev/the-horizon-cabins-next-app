import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * ⚠️ پراپ‌های `Link` (مثل `data-animate` یا `aria-*`) از این تایپ عبور
 * می‌کنند و روی خود `<a>` می‌نشینند. بدون این، صفت‌هایی مثل
 * `data-animate="reveal"` **بی‌صدا دور ریخته می‌شدند** و انیمیشن ورود
 * کارت‌ها هرگز اجرا نمی‌شد.
 */
type Props = Omit<ComponentProps<typeof Link>, "className"> & {
  image: string | StaticImageData;
  imageAlt: string;
  /** مقدار `sizes` برای تصویر `fill`. */
  sizes: string;
  aspectClassName: string;
  gradientClassName: string;
  children: ReactNode;
  className?: string;
};

export default function ImageOverlayCard({
  image,
  imageAlt,
  sizes,
  aspectClassName,
  gradientClassName,
  children,
  className = "",
  ...linkProps
}: Props): ReactNode {
  return (
    <Link
      {...linkProps}
      className={`group relative block h-full overflow-hidden rounded-2xl border border-white/8 bg-white/5 ${className}`}
    >
      <div className={`relative ${aspectClassName} overflow-hidden`}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes={sizes}
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className={`absolute inset-0 ${gradientClassName}`}
        />
      </div>
      {children}
    </Link>
  );
}
