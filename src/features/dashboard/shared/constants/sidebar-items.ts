import { BookText, Hotel, LayoutGrid, ShieldCheck, Users } from "lucide-react";

import type { UserRole } from "@/features/auth/constants/auth-cookie";

/**
 * آیتم‌های منوی پنل مدیریت.
 *
 * `roles` مشخص می‌کند چه نقش‌هایی این آیتم را می‌بینند. آیتم بدون `roles`
 * برای همه‌ی نقش‌های دارای دسترسی پنل (admin و owner) نمایش داده می‌شود.
 */
export type SidebarItem = {
  name: string;
  href: string;
  icon: typeof LayoutGrid;
  roles?: readonly UserRole[];
};

export const SIDEBAR_ITEMS: readonly SidebarItem[] = [
  { name: "داشبورد", href: "/dashboard", icon: LayoutGrid },
  { name: "سوییت ها", href: "/dashboard/cabins", icon: Hotel },
  { name: "افراد و مهمانان", href: "/dashboard/users", icon: Users },
  { name: "رزرو ها", href: "/dashboard/bookings", icon: BookText },
  /**
   * نمونه‌ی آیتم اختصاصی owner — همان قاعده‌ای که در بک‌اند برای «حذف
   * سایر adminها» اعمال می‌شود، اینجا هم در سطح UI منعکس شده است.
   */
  {
    name: "مدیران",
    href: "/dashboard/admins",
    icon: ShieldCheck,
    roles: ["owner"],
  },
];

/** آیتم‌های قابل‌نمایش برای یک نقش مشخص. */
export function visibleSidebarItems(role: UserRole): SidebarItem[] {
  return SIDEBAR_ITEMS.filter((item) => !item.roles || item.roles.includes(role));
}
