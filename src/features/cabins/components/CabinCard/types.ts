import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import type { Cabin } from "@/features/cabins/types/cabin.types";

export type CabinCardVariant = "default" | "dashboard" | "landing";

export interface CabinCardProps {
  cabin: Cabin;

  variant?: CabinCardVariant;
  imageOverride?: string | StaticImageData;
  imageAlt?: string;
  href?: string;
  disableLink?: boolean;
  className?: string;
  children?: ReactNode;
  animation?: "none" | "hover";
  maxAmenities?: number;
  /** نمایش قیمت به شکل درون‌کارت (واریانت `landing`). */
  showPrice?: boolean;
  /**
   * قیمت نمایشی دستی.
   *
   * اگر ندهید از `resolveCabinPrice(cabin)` محاسبه می‌شود. برای
   * پیشنهادهای لحظه‌آخری لازم است، چون قیمت تخفیف‌خورده‌شان از اندپوینت
   * `last-minute` می‌آید و با `pricing` معمولی یکی نیست.
   */
  price?: number;
  /** قیمت پیش از تخفیف (خط‌خورده) — مکمل `price`. */
  originalPrice?: number;
  /**
   * نشان گوشه‌ی کارت — فقط واریانت `landing` («پیشنهاد ویژه»، «خوش‌قیمت»).
   *
   * ⚠️ پیش از این این نشان در `OfferCard` **بیرون** از کارت رندر می‌شد و
   * برای هم‌ارتفاع‌کردن لینک، سلکتور `[&>a]:h-full` به DOM درونی کارت نفوذ
   * می‌کرد. حالا خود کارت نشانش را می‌کشد.
   */
  badge?: string;
  /**
   * نمایش دکمه‌ی «علاقه‌مندی» (قلب) روی تصویر کارت.
   *
   * ⚠️ فقط روی واریانت `default` اعمال می‌شود؛ واریانت‌های
   * `landing`/`dashboard` نشان داده نمی‌شوند.
   */
  showFavorite?: boolean;
}

/**
 * پراپ‌های مشترک سه واریانت — فقط مواردی که **ریشه** مدیریت می‌کند
 * (واریانت، لینک، قلب) حذف شده‌اند.
 */
export type CardVariantProps = Omit<
  CabinCardProps,
  "variant" | "href" | "disableLink" | "showFavorite"
>;
