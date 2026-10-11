import type { Cabin } from "../types/cabin.types";

/**
 * قیمت مؤثر یک اقامتگاه برای نمایش روی کارت.
 *
 * ⚠️ زمینه: مدل `Cabin` بک‌اند **هیچ فیلد `discount` ندارد**؛ تخفیف‌ها در
 * `PriceRule` و read-model `CabinDailyPrice` هستند. اندپوینت لیست فقط شیء
 * `pricing` را برمی‌گرداند که در حالت بدون تاریخ `startingPrice` (کمینه‌ی
 * قیمت مؤثر پس از تخفیف/افزایش) را دارد.
 *
 * پس به‌جای فیلد ناموجود `discount`، قیمت را از `pricing` استخراج می‌کنیم.
 */
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

/**
 * قیمت مؤثر را از `pricing` (حالت `startingFrom`) محاسبه می‌کند.
 *
 * حالت `stay` (با تاریخ) اینجا مدیریت نمی‌شود؛ کارت‌ها برای آن حالت جمع کل
 * بازه را جداگانه نشان می‌دهند.
 */
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
