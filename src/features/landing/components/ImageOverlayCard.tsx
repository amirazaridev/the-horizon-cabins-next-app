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
  /** نسبت ابعاد ناحیه‌ی تصویر — کلاس کامل Tailwind (مثل `aspect-[1.35/1]`). */
  aspectClassName: string;
  /** کلاس پوشش گرادیانی — بین سکشن‌ها متفاوت است. */
  gradientClassName: string;
  /** محتوای روی تصویر (معمولاً `absolute inset-x-* bottom-*`). */
  children: ReactNode;
  className?: string;
};

/**
 * کارت تصویری با پوشش گرادیانی و محتوای روی تصویر.
 *
 * مشترک بین «مقاصد محبوب» و «تجربه‌های خاص» — پیش از این هر دو همین
 * اسکلت (`Image fill` + `sizes` + پوشش + بزرگ‌نمایی در hover + قاب
 * گرد) را جداگانه تکرار می‌کردند.
 */
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
