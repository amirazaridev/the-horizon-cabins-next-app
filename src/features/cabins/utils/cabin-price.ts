import type { Cabin } from "../types/cabin.types";

export type CabinPriceInfo = {
  /** قیمت پایه‌ی اقامتگاه (قبل از تخفیف) — برای نمایش خط‌خورده. */
  originalPrice: number;
  /** قیمت مؤثر قابل‌نمایش (پس از تخفیف/افزایش). */
  finalPrice: number;
  /** آیا قیمت مؤثر از قیمت پایه کمتر است؟ */
  hasDiscount: boolean;
  /** درصد تخفیف مؤثر (۰ اگر تخفیفی نباشد). */
  discountPercent: number;
};

export function resolveCabinPrice(cabin: Cabin): CabinPriceInfo {
  const originalPrice = cabin.regularPrice;

  const starting =
    cabin.pricing?.mode === "startingFrom" ? cabin.pricing.startingPrice : null;

  const finalPrice =
    starting !== null && starting !== undefined ? starting : originalPrice;

  const hasDiscount = originalPrice > 0 && finalPrice < originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0;

  return { originalPrice, finalPrice, hasDiscount, discountPercent };
}
