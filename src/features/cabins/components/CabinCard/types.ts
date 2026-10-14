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
  price?: number;
  /** قیمت پیش از تخفیف (خط‌خورده) — مکمل `price`. */
  originalPrice?: number;
  badge?: string;
  showFavorite?: boolean;
}

export type CardVariantProps = Omit<
  CabinCardProps,
  "variant" | "href" | "disableLink" | "showFavorite"
>;
