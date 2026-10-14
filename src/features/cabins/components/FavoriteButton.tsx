"use client";

import { Heart } from "lucide-react";
import { useState, type ReactNode } from "react";

type Props = {
  /** شناسه‌ی اقامتگاه — برای اتصال به API در فاز بعد. */
  cabinId: number;
  className?: string;
};

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
