import Link from "next/link";
import type { ReactNode } from "react";

import FavoriteButton from "../FavoriteButton";
import DashboardCard from "./DashboardCard";
import DefaultCard from "./DefaultCard";
import LandingCard from "./LandingCard";
import type { CabinCardProps } from "./types";

export type { CabinCardProps, CabinCardVariant } from "./types";

/**
 * کارت اقامتگاه — سه واریانت مستقل در سه فایل، و اینجا فقط انتخاب‌کننده.
 *
 * ⚠️ پیش از این هر سه واریانت + اجزای کمکی در یک فایل ۵۵۵ خطی بودند و
 * بلوک تصویر/مشخصات/قیمت سه بار تکرار شده بود. حالا:
 *  - `LandingCard` / `DefaultCard` / `DashboardCard` ⇒ هر کدام یک فایل
 *  - اجزای مشترک (`CardImage`, `AmenityChip`, `SpecTile`, `PriceRow`,
 *    `PriceBadge`) ⇒ `primitives.tsx`
 *  - قاب/انیمیشن/اندازه‌ی تصویر ⇒ `classes.ts`
 *  - تایپ‌ها ⇒ `types.ts`
 *
 * ⚠️ لینک ریشه اکنون `h-full` است. پیش از این `block` بود و مصرف‌کننده‌ها
 * برای هم‌ارتفاع‌کردنش مجبور می‌شدند با سلکتور `[&>a]` به DOM کارت نفوذ
 * کنند (`OfferCard`).
 */
export default function CabinCard({
  cabin,
  variant = "default",
  showFavorite = false,
  ...props
}: CabinCardProps): ReactNode {
  const card =
    variant === "dashboard" ? (
      <DashboardCard cabin={cabin} {...props} />
    ) : variant === "landing" ? (
      <LandingCard cabin={cabin} {...props} />
    ) : (
      <DefaultCard cabin={cabin} {...props} />
    );

  // نسخه‌ی داشبورد هرگز لینک نیست (داخلش منوی دکمه‌دار داریم)
  if (variant === "dashboard" || props.disableLink) return card;

  const href = props.href ?? `/cabins/${cabin.id}`;

  if (!showFavorite || variant !== "default") {
    return (
      <Link href={href} className="block h-full">
        {card}
      </Link>
    );
  }

  return (
    /* قلب بیرون از لینک و به‌شکل خواهر (sibling) رندر می‌شود تا نه HTML
       نامعتبر بسازیم (دکمه داخل لینک) و نه کلیک روی قلب صفحه را عوض کند. */
    <div className="relative h-full">
      <Link href={href} className="block h-full">
        {card}
      </Link>

      {/* گوشه‌ی بالا-چپ تصویر: گوشه‌ی بالا-راست به نشان تخفیف اختصاص دارد. */}
      <FavoriteButton
        cabinId={cabin.id}
        className="absolute top-3 left-3 z-10"
      />
    </div>
  );
}
