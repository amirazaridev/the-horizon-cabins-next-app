import {
  BookText,
  Hotel,
  LayoutGrid,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

import type { UserRole } from "@/features/auth/constants/auth-cookie";

export type SidebarItem = {
  name: string;
  href: string;
  icon: typeof LayoutGrid;
  roles?: readonly UserRole[];
  group?: string;
};

/** عنوان دسته‌ها — تک‌منبع؛ ترتیب نمایش هم از همین آبجکت می‌آید. */
export const SIDEBAR_GROUPS = {
  general: "عمومی",
  management: "مدیریت اقامتگاه",
  access: "کاربران و دسترسی",
} as const;

/** آیتم‌های ناوبری اصلی (دسته‌بندی‌شده). */
export const SIDEBAR_ITEMS: readonly SidebarItem[] = [
  {
    name: "داشبورد",
    href: "/dashboard",
    icon: LayoutGrid,
    group: SIDEBAR_GROUPS.general,
  },
  {
    name: "سوییت ها",
    href: "/dashboard/cabins",
    icon: Hotel,
    group: SIDEBAR_GROUPS.management,
  },
  {
    name: "رزرو ها",
    href: "/dashboard/bookings",
    icon: BookText,
    group: SIDEBAR_GROUPS.management,
  },
  {
    name: "افراد و مهمانان",
    href: "/dashboard/users",
    icon: Users,
    group: SIDEBAR_GROUPS.access,
  },
  {
    name: "مدیران",
    href: "/dashboard/admins",
    icon: ShieldCheck,
    roles: ["owner"],
    group: SIDEBAR_GROUPS.access,
  },
];

export const SIDEBAR_UTILITY_ITEMS: readonly SidebarItem[] = [
  { name: "تنظیمات", href: "/dashboard/settings", icon: Settings },
];

/** آیتم‌های ناوبری قابل‌نمایش برای یک نقش مشخص. */
export function visibleSidebarItems(role: UserRole): SidebarItem[] {
  return SIDEBAR_ITEMS.filter((item) => !item.roles || item.roles.includes(role));
}

/** آیتم‌های کاربردی قابل‌نمایش برای یک نقش مشخص. */
export function visibleSidebarUtilityItems(role: UserRole): SidebarItem[] {
  return SIDEBAR_UTILITY_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(role),
  );
}
