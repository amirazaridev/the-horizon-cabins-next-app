import { BedDouble, MapPin, Maximize } from "lucide-react";
import type { ReactNode } from "react";

import { resolveCabinPrice } from "@/features/cabins/utils/cabin-price";
import { formatCurrency } from "@/libs/utils/format";
import { animationClasses, baseClasses, CARD_IMAGE_SIZES } from "./classes";
import { CardImage } from "./primitives";
import type { CardVariantProps } from "./types";

/**
 * کارت واریانت `landing` — کارت‌های سکشن‌های لندینگ.
 *
 * ⚠️ پیش از این همین کارت به‌همراه نشان و پاورقی قیمت در `OfferCard` به
 * شکل «کارت + یک لایه‌ی بیرونی با سلکتور `[&>a]`» ساخته می‌شد. حالا نشان
 * (`badge`) و قیمت دستی (`price`/`originalPrice`) پراپِ خود کارت‌اند.
 */
export default function LandingCard({
  cabin,
  imageOverride,
  imageAlt,
  className = "",
  animation = "hover",
  showPrice = false,
  badge,
  price,
  originalPrice,
}: CardVariantProps): ReactNode {
  const { name, bedrooms, areaSqm, images, city } = cabin;
  const image = imageOverride ?? images?.[0];

  //* با تاریخ، کارت «جمع کل بازه» را نشان می‌دهد و تخفیف شبانه بی‌معناست.
  const stay = cabin.pricing?.mode === "stay" ? cabin.pricing : null;

  //* قیمت مؤثر از `pricing` استخراج می‌شود (فیلد `discount` در API وجود ندارد).
  const resolved = resolveCabinPrice(cabin);
  const finalPrice = price ?? resolved.finalPrice;
  const basePrice = originalPrice ?? resolved.originalPrice;
  const hasDiscount = basePrice > finalPrice;

  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} flex h-full flex-col ${className}`}
    >
      <div className="bg-background-2 relative aspect-video overflow-hidden">
        <CardImage
          image={image}
          alt={imageAlt || name}
          sizes={CARD_IMAGE_SIZES.landing}
        />
        {badge && (
          <span className="bg-primary-400 pointer-events-none absolute top-3 right-3 rounded-full px-3 py-1.5 text-xs font-bold text-slate-950 shadow-sm">
            {badge}
          </span>
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
            {stay ? (
              /* با تاریخ: جمع کل بازه + تعداد شب (خروجی مستقیم API) */
              <>
                <span className="text-primary-500 text-sm font-extrabold tabular-nums">
                  {formatCurrency(stay.totalPrice)}
                </span>
                <span className="text-text-gray text-[10px]">
                  تومان / {stay.nights.toLocaleString("fa-IR")} شب
                </span>
              </>
            ) : (
              /* بدون تاریخ: قیمت، «کمینه‌ی پنجره» است نه قیمت ثابت — پس با
                 «از» می‌آید تا کاربر بفهمد ممکن است شب‌های دیگر گران‌تر باشد. */
              <>
                {hasDiscount && (
                  <span className="text-text-gray/60 text-[11px] line-through">
                    {formatCurrency(basePrice)}
                  </span>
                )}
                <span className="text-text-gray text-[10px]">از</span>
                <span className="text-primary-500 text-sm font-extrabold tabular-nums">
                  {formatCurrency(finalPrice)}
                </span>
                <span className="text-text-gray text-[10px]">تومان/شب</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
