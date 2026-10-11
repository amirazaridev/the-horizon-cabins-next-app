import Image, { type StaticImageData } from "next/image";
import { CalendarDays } from "lucide-react";
import { format as formatJalali } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import type { ReactNode } from "react";

import type { Cabin } from "@/features/cabins/types/cabin.types";
import { resolveCabinPrice } from "@/features/cabins/utils/cabin-price";
import { formatCurrency } from "@/libs/utils/format";
import { IMAGE_HOVER_SCALE } from "./classes";

/**
 * ناحیه‌ی تصویر کارت + جایگزین «تصویر موجود نیست».
 *
 * ⚠️ پیش از این این بلوک در هر سه واریانت کپی شده بود، و واریانت داشبورد
 * جایگزین نداشت (`src={image || ""}` ⇒ `src` خالی به `next/image`) —
 * یعنی رفتارشان ناهمگون بود. حالا یک پیاده‌سازی مشترک دارند.
 */
export function CardImage({
  image,
  alt,
  sizes,
  hover = "sm",
}: {
  image?: string | StaticImageData;
  alt: string;
  sizes: string;
  hover?: keyof typeof IMAGE_HOVER_SCALE;
}): ReactNode {
  if (!image) {
    return (
      <div className="text-text-gray flex h-full items-center justify-center text-xs">
        تصویر موجود نیست
      </div>
    );
  }

  return (
    <Image
      src={image}
      alt={alt}
      fill
      sizes={sizes}
      className={`object-cover transition-transform duration-700 ${IMAGE_HOVER_SCALE[hover]}`}
    />
  );
}

/** برچسب کوچک امکانات کارت. */
export function AmenityChip({ children }: { children: ReactNode }): ReactNode {
  return (
    <span className="bg-foreground/5 text-text-gray rounded-full px-3 py-1 text-xs sm:text-sm">
      {children}
    </span>
  );
}

/** کاشی مشخصات کارت داشبورد (ظرفیت/اتاق/سرویس/متراژ). */
export function SpecTile({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: number;
  label: string;
}): ReactNode {
  return (
    <div className="bg-background-2 flex flex-col items-center gap-1 rounded-xl py-2.5">
      <span className="text-primary-400">{icon}</span>
      <span className="text-text text-sm font-bold">
        {value.toLocaleString("fa-IR")}
      </span>
      <span className="text-text-gray text-[10px]">{label}</span>
    </div>
  );
}

/** ردیف برچسب/مقدار قیمت‌نامه‌ی کارت داشبورد. */
export function PriceRow({
  label,
  value,
  tone = "default",
  bold = false,
}: {
  label: string;
  value: string;
  tone?: "default" | "danger";
  bold?: boolean;
}): ReactNode {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-gray">{label}</span>
      <span
        className={`font-semibold tabular-nums ${
          tone === "danger" ? "text-danger" : "text-text"
        } ${bold ? "text-base font-extrabold" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

/** نشان قیمت روی تصویر کارت داشبورد. */
export function PriceBadge({ cabin }: { cabin: Cabin }): ReactNode {
  //* قیمت مؤثر از `pricing` استخراج می‌شود (فیلد `discount` در API وجود ندارد).
  const { originalPrice, finalPrice, hasDiscount, discountPercent } =
    resolveCabinPrice(cabin);

  return (
    <div className="absolute top-4 right-2 flex items-center justify-between gap-2 sm:right-4">
      <span className="bg-primary-400 max-w-27 truncate rounded-full px-4 py-1.5 text-xs font-bold text-black sm:max-w-max md:text-sm">
        {formatCurrency(finalPrice)} تومان/هر شب
      </span>
      {hasDiscount && (
        <>
          <span className="bg-surface/80 text-text/60 rounded-full px-4 py-1.5 text-xs font-medium line-through backdrop-blur-sm md:text-sm">
            {formatCurrency(originalPrice)}
          </span>
          <span className="bg-danger-strong rounded-full px-3 py-1.5 text-[10px] font-bold text-white md:text-xs">
            {discountPercent}٪ تخفیف
          </span>
        </>
      )}
    </div>
  );
}

/** تاریخ ایجاد کارت داشبورد (جلالی). */
export function CreatedAtLabel({ createdAt }: { createdAt: Date }): ReactNode {
  return (
    <span className="text-text-gray flex items-center gap-1.5">
      <CalendarDays className="size-3.5" />
      {formatJalali(new Date(createdAt), "d MMMM yyyy", { locale: faIR })}
    </span>
  );
}
