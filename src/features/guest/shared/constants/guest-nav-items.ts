import { CalendarCheck, Heart, Settings } from "lucide-react";

import type { ShellNavItem } from "@/components/layout/shell/shell-nav";

/**
 * آیتم‌های ناوبری ناحیه‌ی مهمان.
 *
 * ⚠️ تک‌منبعِ حقیقت: سایدبار ناحیه‌ی مهمان و منوی پروفایل نوار بالا هر دو
 * از همین لیست تغذیه می‌شوند تا با اضافه‌شدن یک بخش جدید، فقط یک‌جا تغییر
 * لازم باشد و آدرس‌ها هرگز واگرا نشوند.
 */
export const GUEST_NAV_ITEMS: readonly ShellNavItem[] = [
  { name: "رزروهای من", href: "/account/bookings", icon: CalendarCheck },
  { name: "تنظیمات حساب کاربری", href: "/account/settings", icon: Settings },
  { name: "علاقه‌مندی‌ها", href: "/account/favorites", icon: Heart },
];
