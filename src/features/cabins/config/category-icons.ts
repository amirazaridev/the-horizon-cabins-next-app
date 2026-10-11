import {
  Building2,
  Castle,
  Home,
  Hotel,
  House,
  MountainSnow,
  Sparkles,
  Trees,
  Waves,
  WavesLadder,
  type LucideIcon,
} from "lucide-react";

/**
 * نگاشت نام نمادین دسته‌بندی (فیلد `icon` که از `GET /categories` می‌آید)
 * به آیکن Lucide.
 *
 * ⚠️ این فایل پیش‌تر در `libs/utils/icon-map.ts` بود؛ ولی `libs` باید
 * مستقل از کتابخانه‌های UI بماند و این نگاشت به‌طور مشخص به دامنه‌ی
 * «دسته‌بندی اقامتگاه» تعلق دارد. پس به فیچر `cabins` منتقل شد.
 */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Home,
  Building2,
  Hotel,
  Castle,
  Trees,
  Sparkles,
  MountainSnow,
  Waves,
  WavesLadder,
  House,
};

/**
 * آیکن یک دسته‌بندی را از نامش برمی‌گرداند.
 *
 * ⚠️ اگر نام ناشناخته باشد `Home` برگردانده می‌شود (تا UI نشکند)، ولی در
 * محیط توسعه یک هشدار هم لاگ می‌شود؛ نسخه‌ی قبلی این خطا را کاملاً بی‌صدا
 * رد می‌کرد و اشتباه داده‌ای (مثلاً تغییر نام فیلد در بک‌اند) دیده نمی‌شد.
 */
export function getCategoryIcon(name: string): LucideIcon {
  const icon = CATEGORY_ICONS[name];

  if (!icon) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[category-icons] آیکن ناشناخته «${name}» — آیکن پیش‌فرض Home استفاده شد.`,
      );
    }
    return Home;
  }

  return icon;
}
