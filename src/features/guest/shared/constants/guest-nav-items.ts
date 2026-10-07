import { CalendarCheck, Heart, Settings } from "lucide-react";

/**
 * آیتم‌های ناوبری ناحیه‌ی مهمان.
 *
 * ⚠️ تک‌منبعِ حقیقت: سایدبار ناحیه‌ی مهمان و منوی پروفایل نوار بالا هر دو
 * از همین لیست تغذیه می‌شوند تا با اضافه‌شدن یک بخش جدید، فقط یک‌جا تغییر
 * لازم باشد و آدرس‌ها هرگز واگرا نشوند.
 */
export type GuestNavItem = {
  name: string;
  href: string;
  icon: typeof CalendarCheck;
};

export const GUEST_NAV_ITEMS: readonly GuestNavItem[] = [
  { name: "رزروهای من", href: "/my/bookings", icon: CalendarCheck },
  { name: "تنظیمات حساب کاربری", href: "/my/account", icon: Settings },
  { name: "علاقه‌مندی‌ها", href: "/my/favorites", icon: Heart },
];

/** آیا مسیر جاری به این آیتم تعلق دارد؟ (شامل زیرمسیرها) */
export function isGuestNavItemActive(item: GuestNavItem, pathname: string): boolean {
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
