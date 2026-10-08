"use client";

import { Heart } from "lucide-react";
import { useState, type ReactNode } from "react";

type Props = {
  /** شناسه‌ی اقامتگاه — برای اتصال به API در فاز بعد. */
  cabinId: number;
  className?: string;
};

/**
 * دکمه‌ی «افزودن به علاقه‌مندی‌ها» روی کارت اقامتگاه.
 *
 * ⚠️ در این فاز **فقط نمایشی** است: وضعیت در state محلی نگه داشته می‌شود و
 * با کلیک، قلب قرمز و پُر می‌شود. هیچ درخواستی به سرور/دیتابیس زده
 * نمی‌شود.
 *
 * TODO(backend): با آماده‌شدن اندپوینت علاقه‌مندی‌ها، `cabinId` را در یک
 * Server Action به API بفرستید و وضعیت اولیه را از سرور بگیرید (پراپ
 * `defaultFavorite`). همین کامپوننت بدون تغییر ساختار قابل اتصال است.
 */
export default function FavoriteButton({ cabinId, className = "" }: Props): ReactNode {
  const [isFavorite, setIsFavorite] = useState(false);

  const label = isFavorite
    ? "حذف از علاقه‌مندی‌ها"
    : "افزودن به علاقه‌مندی‌ها";

  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      aria-label={label}
      title={label}
      data-cabin-id={cabinId}
      onClick={() => setIsFavorite((prev) => !prev)}
      className={`grid size-9 place-items-center rounded-full border backdrop-blur-md transition-all duration-300 active:scale-90 ${
        isFavorite
          ? "border-white/70 bg-white/90 shadow-danger/25 text-danger shadow-lg"
          : "text-white hover:bg-black/45 border-white/25 bg-black/30"
      } ${className}`}
    >
      <Heart
        className={`size-4.5 transition-transform duration-300 ${
          isFavorite ? "fill-current scale-110" : ""
        }`}
      />
    </button>
  );
}
