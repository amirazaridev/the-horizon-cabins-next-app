import { CalendarCheck, Heart, Settings } from "lucide-react";

import type { ShellNavItem } from "@/components/layout/shell/shell-nav";

export const GUEST_NAV_ITEMS: readonly ShellNavItem[] = [
  { name: "رزروهای من", href: "/account/bookings", icon: CalendarCheck },
  { name: "تنظیمات حساب کاربری", href: "/account/settings", icon: Settings },
  { name: "علاقه‌مندی‌ها", href: "/account/favorites", icon: Heart },
];
